"""Transcripción opcional con faster-whisper, muletillas y subtítulos."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from .segmentos import Tramo


@dataclass(frozen=True)
class Palabra:
    inicio: float
    fin: float
    texto: str


_MULETILLA = re.compile(r"^(e+h+|e+m+|m+h*|u+h+|u+m+|a+h+|h?m+m+)$")


def limpiar(texto: str) -> str:
    return re.sub(r"[^\wáéíóúüñ]", "", texto.lower())


def es_muletilla(texto: str) -> bool:
    return bool(_MULETILLA.match(limpiar(texto)))


def transcribir(ruta: Path, modelo: str = "small", idioma: str | None = "es") -> list[Palabra]:
    try:
        from faster_whisper import WhisperModel
    except ImportError as e:  # pragma: no cover - depende del entorno
        raise RuntimeError(
            "La transcripción necesita faster-whisper: pip install 'creador-reels[transcripcion]'"
        ) from e
    whisper = WhisperModel(modelo, device="auto", compute_type="auto")
    segmentos, _ = whisper.transcribe(
        str(ruta), language=idioma, word_timestamps=True, vad_filter=True
    )
    return [
        Palabra(w.start, w.end, w.word.strip())
        for s in segmentos
        for w in (s.words or [])
        if w.word.strip()
    ]


def cortes_por_muletillas(palabras: list[Palabra]) -> list[Tramo]:
    return [Tramo(p.inicio, p.fin) for p in palabras if es_muletilla(p.texto)]


def palabras_editadas(palabras: list[Palabra], tramos: list[Tramo]) -> list[Palabra]:
    """Lleva las palabras al tiempo del video editado, descartando las cortadas."""
    resultado = []
    for p in palabras:
        if es_muletilla(p.texto):
            continue
        medio = (p.inicio + p.fin) / 2
        # Se reubica respecto al tramo que contiene el centro de la palabra
        # para que una palabra pegada a un corte no salte a otro tramo.
        acumulado = 0.0
        for t in tramos:
            if t.inicio <= medio <= t.fin:
                ini = acumulado + max(p.inicio, t.inicio) - t.inicio
                fin = acumulado + min(p.fin, t.fin) - t.inicio
                resultado.append(Palabra(ini, fin, p.texto))
                break
            acumulado += t.duracion
    return resultado


def agrupar_frases(
    palabras: list[Palabra], max_palabras: int = 4, max_caracteres: int = 22, pausa: float = 0.5
) -> list[Palabra]:
    """Agrupa palabras en subtítulos cortos, legibles en formato vertical."""
    frases: list[Palabra] = []
    actual: list[Palabra] = []

    def cerrar() -> None:
        if actual:
            texto = " ".join(p.texto for p in actual)
            frases.append(Palabra(actual[0].inicio, actual[-1].fin, texto))
            actual.clear()

    for p in palabras:
        if actual:
            largo = len(" ".join(x.texto for x in actual)) + 1 + len(p.texto)
            if (
                len(actual) >= max_palabras
                or largo > max_caracteres
                or p.inicio - actual[-1].fin > pausa
                or actual[-1].texto.endswith((".", "?", "!"))
            ):
                cerrar()
        actual.append(p)
    cerrar()
    return frases


def _tiempo_ass(t: float) -> str:
    cs = int(round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def _tiempo_srt(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def generar_ass(frases: list[Palabra], ancho: int, alto: int) -> str:
    tam = max(24, round(alto * 0.045))
    margen_v = round(alto * 0.22)
    cabecera = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {ancho}
PlayResY: {alto}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Reel,DejaVu Sans,{tam},&H00FFFFFF,&H0000FFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,{max(2, tam // 12)},2,2,60,60,{margen_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lineas = [
        f"Dialogue: 0,{_tiempo_ass(f.inicio)},{_tiempo_ass(f.fin)},Reel,,0,0,0,,"
        + f.texto.replace("{", "(").replace("}", ")").upper()
        for f in frases
    ]
    return cabecera + "\n".join(lineas) + "\n"


def generar_srt(frases: list[Palabra]) -> str:
    bloques = [
        f"{i}\n{_tiempo_srt(f.inicio)} --> {_tiempo_srt(f.fin)}\n{f.texto}\n"
        for i, f in enumerate(frases, 1)
    ]
    return "\n".join(bloques)
