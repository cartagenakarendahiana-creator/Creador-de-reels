"""Interfaz de línea de comandos."""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path

from . import ffmpeg, segmentos, transcripcion


def _argumentos(argv: list[str] | None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        prog="creador-reels",
        description="Recorta silencios y muletillas manteniendo la voz natural, "
        "sincronizada y con volumen uniforme.",
    )
    p.add_argument("entrada", type=Path, help="video de entrada")
    p.add_argument("-o", "--salida", type=Path, help="video de salida (por defecto <entrada>_reel.mp4)")
    p.add_argument("--vertical", action="store_true", help="recorta a 1080x1920 (9:16)")
    p.add_argument("--musica", type=Path, help="música de fondo; baja sola cuando hablas")
    p.add_argument("--volumen-musica", type=float, default=0.18)
    p.add_argument("--subtitulos", action="store_true", help="transcribe y quema subtítulos (requiere faster-whisper)")
    p.add_argument("--quitar-muletillas", action="store_true", help="elimina 'eh', 'mmm', 'um'... (requiere faster-whisper)")
    p.add_argument("--modelo", default="small", help="modelo de Whisper (tiny, base, small, medium...)")
    p.add_argument("--idioma", default="es")
    p.add_argument("--umbral", type=float, default=-35.0, help="dB por debajo de los cuales se considera silencio")
    p.add_argument("--silencio-min", type=float, default=0.45, help="segundos mínimos de silencio para cortar")
    p.add_argument("--margen", type=float, default=0.12, help="segundos de aire antes y después de cada frase")
    p.add_argument("--pausa-natural", type=float, default=0.25, help="pausas más cortas que esto se conservan")
    p.add_argument("--lufs", type=float, default=-14.0, help="sonoridad final (LUFS integrados)")
    p.add_argument("--sin-reduccion-ruido", action="store_true")
    p.add_argument("--solo-analizar", action="store_true", help="muestra el plan de cortes sin renderizar")
    p.add_argument("--plan", type=Path, help="guarda el plan de cortes en JSON")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _argumentos(argv)
    if not args.entrada.exists():
        print(f"No existe: {args.entrada}", file=sys.stderr)
        return 2
    info = ffmpeg.analizar(args.entrada)
    if not info.tiene_audio:
        print("El video no tiene audio: no hay habla que analizar.", file=sys.stderr)
        return 2

    log = ffmpeg.detectar_silencios(args.entrada, args.umbral, args.silencio_min)
    silencios = segmentos.parsear_silencedetect(log, info.duracion)
    tramos = segmentos.tramos_de_habla(
        silencios, info.duracion, args.margen, args.pausa_natural
    )

    palabras: list[transcripcion.Palabra] = []
    if args.subtitulos or args.quitar_muletillas:
        print(f"Transcribiendo con Whisper ({args.modelo})...")
        palabras = transcripcion.transcribir(args.entrada, args.modelo, args.idioma)
        if args.quitar_muletillas:
            tramos = segmentos.restar(tramos, transcripcion.cortes_por_muletillas(palabras))

    tramos = segmentos.ajustar_a_fotogramas(tramos, info.fps)
    final = segmentos.duracion_total(tramos)
    print(
        f"Duración: {info.duracion:.1f}s -> {final:.1f}s "
        f"({len(tramos)} tramos, {info.duracion - final:.1f}s eliminados)"
    )

    if args.plan:
        args.plan.write_text(
            json.dumps([{"inicio": t.inicio, "fin": t.fin} for t in tramos], indent=2)
        )
    if args.solo_analizar:
        for t in tramos:
            print(f"  {t.inicio:8.2f} -> {t.fin:8.2f}  ({t.duracion:.2f}s)")
        return 0

    salida = args.salida or args.entrada.with_name(f"{args.entrada.stem}_reel.mp4")
    ancho, alto = (1080, 1920) if args.vertical else (info.ancho, info.alto)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        ruta_ass = None
        if args.subtitulos:
            frases = transcripcion.agrupar_frases(transcripcion.palabras_editadas(palabras, tramos))
            ruta_ass = tmp_dir / "subs.ass"
            ruta_ass.write_text(transcripcion.generar_ass(frases, ancho, alto), encoding="utf-8")
            salida.with_suffix(".srt").write_text(transcripcion.generar_srt(frases), encoding="utf-8")
        ffmpeg.renderizar(
            args.entrada,
            salida,
            tramos,
            info,
            ffmpeg.OpcionesAudio(
                lufs=args.lufs,
                reducir_ruido=not args.sin_reduccion_ruido,
                volumen_musica=args.volumen_musica,
            ),
            tmp_dir / "filtro.txt",
            vertical=args.vertical,
            subtitulos=ruta_ass,
            musica=args.musica,
        )
    print(f"Listo: {salida}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
