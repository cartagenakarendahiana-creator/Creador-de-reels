# Editor con Claude — notas para Claude

- El usuario (Karen) no programa y trabaja desde el celular: explica en español sencillo, sin jerga, y haz tú todo lo posible.
- Se publica solo en Firebase al hacer push a la rama `editor-claude` (`.github/workflows/editor-claude.yml`). Nunca usar GitHub Pages.
- `functions/`: Cloud Functions v2 (Node 22, ESM).
  - `procesarVideo` (jobs creado) → ElevenLabs Scribe → Claude (`lib/claude.js`, herramienta `plan_de_edicion`) → status `renderizar`.
  - `renderizar` (jobs actualizado a `renderizar`) → `lib/render.js` con ffmpeg-static → `final_vN.mp4`.
  - `pedirCambio` (callable) → Claude revisa el plan → vuelve a `renderizar`.
- Subtítulos: `lib/subtitles.js` genera .ass (Poppins en `functions/fonts`).
- Para probar el render en local: `node` con un plan de ejemplo llamando a `renderVideo` (ver historial).
- Preferencias editoriales: nada que suene a publicidad, no alargar, mejorar con cortes precisos.
