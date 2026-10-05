# Creador de reels

Editor de video por línea de comandos que recorta silencios y muletillas
**sin perder la naturalidad de la voz** y deja un sonido uniforme, listo para
Instagram, TikTok o YouTube Shorts.

## Qué hace para mantener la coherencia

| Problema | Solución |
|---|---|
| Cortes que se comen el inicio o el final de las palabras | Se deja un margen (`--margen`, 0,12 s) antes y después de cada frase |
| Ritmo robótico con todas las pausas eliminadas | Las pausas cortas (`--pausa-natural`, 0,25 s) se conservan |
| Clics o "pops" en cada corte | Micro-fundido de 12 ms en la entrada y la salida de cada tramo |
| Labios desincronizados tras muchos cortes | Los cortes se alinean a fotogramas exactos, así audio y video avanzan igual |
| Volumen distinto entre frases | Filtro paso alto, reducción de ruido, compresor y normalización EBU R128 a −14 LUFS |
| La música tapa la voz | La música baja automáticamente cuando hablas (*ducking* con compresión por cadena lateral) |
| Subtítulos desfasados después de editar | Las palabras se trasladan al tiempo del video ya editado |

## Requisitos

- Python 3.10 o superior
- [FFmpeg](https://ffmpeg.org/) (con libass para los subtítulos)
- Opcional, para subtítulos y quitar muletillas: `pip install -e '.[transcripcion]'` (faster-whisper)

## Uso

```bash
pip install -e .

# Recortar silencios y nivelar el audio
creador-reels video.mp4

# Reel vertical con subtítulos, sin muletillas y con música de fondo
creador-reels video.mp4 -o reel.mp4 --vertical --subtitulos --quitar-muletillas --musica fondo.mp3

# Ver el plan de cortes sin renderizar
creador-reels video.mp4 --solo-analizar --plan cortes.json
```

Si corta palabras de más, baja el umbral (`--umbral -40`) o sube `--margen`.
Si deja demasiados silencios, sube el umbral (`--umbral -30`) o baja `--silencio-min`.

## Pruebas

```bash
python3 -m unittest discover -s tests -t .
```
