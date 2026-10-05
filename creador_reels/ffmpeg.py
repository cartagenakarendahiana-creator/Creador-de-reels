"""Análisis y renderizado con FFmpeg."""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from pathlib import Path

from .segmentos import Tramo


@dataclass(frozen=True)
class InfoMedio:
    duracion: float
    fps: float
    ancho: int
    alto: int
    tiene_audio: bool


@dataclass(frozen=True)
class OpcionesAudio:
    lufs: float = -14.0  # estándar de Instagram/TikTok/YouTube
    pico: float = -1.5
    reducir_ruido: bool = True
    volumen_musica: float = 0.18
    fundido: float = 0.012  # micro-fundido en cada corte para evitar clics


def _ejecutar(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"Falló {cmd[0]}:\n{r.stderr[-2000:]}")
    return r


def analizar(ruta: Path) -> InfoMedio:
    r = _ejecutar(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(ruta)]
    )
    datos = json.loads(r.stdout)
    video = next((s for s in datos["streams"] if s["codec_type"] == "video"), None)
    if video is None:
        raise ValueError(f"{ruta} no contiene video")
    num, _, den = video.get("avg_frame_rate", "0/1").partition("/")
    fps = float(num) / float(den or 1) if float(den or 1) else 0.0
    return InfoMedio(
        duracion=float(datos["format"]["duration"]),
        fps=fps,
        ancho=int(video["width"]),
        alto=int(video["height"]),
        tiene_audio=any(s["codec_type"] == "audio" for s in datos["streams"]),
    )


def detectar_silencios(ruta: Path, umbral_db: float, silencio_min: float) -> str:
    """Devuelve el log de `silencedetect`. Se filtra el grave para que el
    zumbido eléctrico o el viento no se confundan con voz."""
    r = _ejecutar(
        [
            "ffmpeg", "-hide_banner", "-nostats", "-i", str(ruta), "-vn",
            "-af", f"highpass=f=100,lowpass=f=8000,silencedetect=noise={umbral_db}dB:d={silencio_min}",
            "-f", "null", "-",
        ]
    )
    return r.stderr


def _escapar_ruta_filtro(ruta: Path) -> str:
    s = str(ruta.resolve())
    for c in ("\\", ":", "'", ",", "[", "]", ";"):
        s = s.replace(c, "\\" + c)
    return s


def construir_filtro(
    tramos: list[Tramo],
    info: InfoMedio,
    audio: OpcionesAudio,
    vertical: bool,
    subtitulos: Path | None,
    con_musica: bool,
) -> str:
    n = len(tramos)
    partes: list[str] = []
    partes.append(f"[0:v]split={n}" + "".join(f"[vs{i}]" for i in range(n)))
    partes.append(f"[0:a]asplit={n}" + "".join(f"[as{i}]" for i in range(n)))
    f = audio.fundido
    for i, t in enumerate(tramos):
        partes.append(
            f"[vs{i}]trim=start={t.inicio:.6f}:end={t.fin:.6f},setpts=PTS-STARTPTS[v{i}]"
        )
        partes.append(
            f"[as{i}]atrim=start={t.inicio:.6f}:end={t.fin:.6f},asetpts=PTS-STARTPTS,"
            f"afade=t=in:d={f},afade=t=out:st={max(0.0, t.duracion - f):.6f}:d={f}[a{i}]"
        )
    partes.append(
        "".join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[vcat][acat]"
    )

    # --- Video ---
    cadena_v = []
    if vertical:
        cadena_v.append(
            "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"
        )
    if subtitulos is not None:
        cadena_v.append(f"subtitles=filename={_escapar_ruta_filtro(subtitulos)}")
    cadena_v.append("format=yuv420p")
    partes.append(f"[vcat]{','.join(cadena_v)}[vout]")

    # --- Voz: limpieza y dinámica consistente entre tramos ---
    voz = ["highpass=f=80"]
    if audio.reducir_ruido:
        voz.append("afftdn=nf=-25")
    voz.append("acompressor=threshold=0.089:ratio=3:attack=5:release=120:makeup=2")
    partes.append(f"[acat]{','.join(voz)}[voz]")

    final = f"loudnorm=I={audio.lufs}:TP={audio.pico}:LRA=11,aresample=48000"
    if con_musica:
        # La música baja automáticamente cuando hay voz (ducking).
        partes.append("[voz]asplit=2[voz1][voz2]")
        partes.append(f"[1:a]volume={audio.volumen_musica},aresample=48000[mus]")
        partes.append(
            "[mus][voz2]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=400[musduck]"
        )
        partes.append(
            f"[voz1][musduck]amix=inputs=2:duration=first:normalize=0,{final}[aout]"
        )
    else:
        partes.append(f"[voz]{final}[aout]")
    return ";\n".join(partes)


def renderizar(
    entrada: Path,
    salida: Path,
    tramos: list[Tramo],
    info: InfoMedio,
    audio: OpcionesAudio,
    script_filtro: Path,
    vertical: bool = False,
    subtitulos: Path | None = None,
    musica: Path | None = None,
) -> None:
    if not tramos:
        raise ValueError("No se detectó habla: ajusta --umbral o --silencio-min")
    script_filtro.write_text(
        construir_filtro(tramos, info, audio, vertical, subtitulos, musica is not None)
    )
    cmd = ["ffmpeg", "-hide_banner", "-y", "-i", str(entrada)]
    if musica is not None:
        cmd += ["-stream_loop", "-1", "-i", str(musica)]
    cmd += [
        "-filter_complex_script", str(script_filtro),
        "-map", "[vout]", "-map", "[aout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-movflags", "+faststart", "-shortest",
        str(salida),
    ]
    _ejecutar(cmd)
