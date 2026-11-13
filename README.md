# ✦ Estudio de Reels

Editor de video estilo CapCut con IA (Gemini por Firebase). Corre en el navegador del celular o del computador.

## Qué hace
- **✦ Edición automática:** Gemini escucha tu voz, quita silencios y **tomas repetidas** comparando con tu guion, y crea subtítulos sincronizados. Sin internet usa un modelo de voz que corre en el celular (Whisper).
- **✦ Ideas con IA:** título gancho, palabras clave resaltadas, emojis y texto para la publicación con hashtags.
- **✨ Video animado:** la IA escribe el guion a partir de un tema, convierte tu foto en caricatura (con IA o con filtro) y arma el video con texto en movimiento.
- Subtítulos con estilo, línea de tiempo, formatos libres (9:16, 4:5, 1:1, 16:9…), música, voz clonada de ElevenLabs, zoom, filtros de color y exportación en MP4.

## Publicarlo en Firebase (como tus otras apps)
1. En https://console.firebase.google.com crea un proyecto llamado **estudio-de-reels** (puedes apagar Analytics).
2. En el menú: **IA → AI Logic → Comenzar** y elige **Gemini Developer API**.
3. En **Configuración del proyecto → Tus apps → Web (</>)** registra la app y copia el bloque `firebaseConfig`. Pégalo en `firebase-config.js` (o envíaselo a Claude para que lo haga).
4. Si Firebase le puso otro ID al proyecto (por ejemplo `estudio-de-reels-1a2b3`), cámbialo en `.firebaserc`.
5. Publica de una de estas dos formas:
   - **Desde un computador:** `npx firebase-tools login` y luego `npx firebase-tools deploy --only hosting` en esta carpeta.
   - **Automático con GitHub:** en Firebase ve a **Configuración → Cuentas de servicio → Generar nueva clave privada**. En GitHub, en este repo, ve a **Settings → Secrets and variables → Actions → New repository secret**, llámalo `FIREBASE_SERVICE_ACCOUNT` y pega el contenido del archivo. Desde ahí, cada cambio en esta rama se publica solo.

Queda en `https://estudio-de-reels.web.app` (o el ID de tu proyecto).

### Caricatura con IA
Los modelos de imagen de Gemini piden el plan **Blaze** de Firebase. Sin Blaze, el editor usa el filtro de caricatura y todo lo demás sigue funcionando.

### Seguridad recomendada
En Firebase activa **App Check** para que solo tu dominio pueda usar tu cuota de Gemini.

## Archivos
- `index.html`: la aplicación.
- `firebase-config.js`: datos de tu proyecto de Firebase y modelos de Gemini.
- `lib/firebase-ai.js`: SDK de Firebase AI Logic empaquetado.
- `asr-worker.js`, `lib/ort-*`, `lib/transformers.min.js`, `models/`: reconocimiento de voz sin internet (Whisper tiny).
- `firebase.json`, `.firebaserc`, `.github/workflows/`: publicación en Firebase Hosting.
