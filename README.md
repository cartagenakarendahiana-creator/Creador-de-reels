# ✦ Estudio de Reels

Editor de video estilo CapCut que corre **100% en el navegador** (celular o computador). Tu video nunca se sube a ningún servidor.

## Qué hace
- **✦ Edición automática:** escucha tu voz (modelo Whisper que corre en el dispositivo), quita silencios y **tomas repetidas** comparando con tu guion, y crea subtítulos sincronizados.
- **Subtítulos con estilo:** 6 estilos (Limpio, Elegante, Moderno, Impacto, Caja, Karaoke), 9 letras, animaciones y resaltado de la palabra que se dice.
- **Línea de tiempo** con miniaturas, cortes y bloques de texto y audio.
- **Formatos libres:** carga videos de cualquier tamaño u orientación y exporta en 9:16, 4:5, 1:1, 16:9, 3:4 u original, con fondo difuminado.
- **Música** con entrada y salida suave, y bajada automática cuando hay voz.
- **Voz clonada con ElevenLabs:** genera el audio en ElevenLabs, cárgalo y el editor lo sincroniza con tu video.
- **✨ Video animado:** con un guion y tu foto (convertida en caricatura) crea un video animado con texto en movimiento.
- **Efectos:** zoom en cortes, filtros de color, título gancho y barra de progreso.
- **Ideas con IA** (solo dentro de Claude): gancho, palabras clave, emojis y texto para la publicación.

## Cómo usarlo
Abre `index.html` desde un servidor web (por ejemplo GitHub Pages). No funciona abriendo el archivo directo con doble clic, porque el modelo de voz se carga por separado.

### Publicarlo gratis con GitHub Pages
1. En este repositorio ve a **Settings → Pages**.
2. En *Branch* elige `estudio-de-reels` y la carpeta `/ (root)`, y guarda.
3. En un par de minutos queda en `https://cartagenakarendahiana-creator.github.io/creador-de-reels/`.

## Archivos
- `index.html`: toda la aplicación.
- `asr-worker.js`: reconocimiento de voz en segundo plano.
- `lib/`: transformers.js y ONNX Runtime (motor del modelo).
- `models/Xenova/whisper-tiny/`: modelo de voz Whisper tiny (los archivos grandes van partidos en `.p0`/`.p1`).
