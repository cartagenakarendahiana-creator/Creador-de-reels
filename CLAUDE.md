# Estudio de Reels — contexto para Claude Code

Editor de video estilo CapCut, en español, para Reels/TikTok. Corre 100 % en el navegador (celular y PC).
Dueño: Karen (creador de contenido, Colombia). Escribe y responde siempre en **español**, con lenguaje sencillo.

## Dónde vive
- Repo: `cartagenakarendahiana-creator/Creador-de-reels`, **rama `estudio-de-reels`** (rama huérfana; `main`/otras ramas son otro proyecto en Python: no tocarlas).
- Producción: **https://estudio-de-reels.web.app** (Firebase Hosting, proyecto `estudio-de-reels`).
- Publicación automática: cada push a `estudio-de-reels` dispara `.github/workflows/firebase-hosting.yml` (secreto `FIREBASE_SERVICE_ACCOUNT` ya configurado). Verifica que el workflow termine en `success` después de cada push.
- Copia anterior en GitHub Pages (`cartagenakarendahiana-creator.github.io/Creador-de-reels/`): desactualizada, se puede ignorar.

## Arquitectura (todo estático, sin build)
- `index.html` — toda la app (HTML + CSS + JS en un solo archivo, IIFE).
- `firebase-config.js` — `window.FIREBASE_CONFIG` (público) y `window.AI_MODELS` (`text: gemini-3.6-flash`, `image: gemini-3.1-flash-image`) y `window.APP_CHECK` (`provider: 'v3'|'enterprise'`, `siteKey` de reCAPTCHA).
- `lib/firebase-ai.js` — SDK Firebase AI Logic empaquetado con esbuild firebase@13.3.0 (`initializeApp`, `getAI`, `getGenerativeModel`, `GoogleAIBackend`, `ResponseModality`, `initializeAppCheck`, `ReCaptchaV3Provider`, `ReCaptchaEnterpriseProvider`). App Check debe ir en el mismo paquete que AI.
- `lib/mp4-muxer.js` — mp4-muxer 5.x empaquetado (exportación con WebCodecs).
- `asr-worker.js` + `lib/transformers.min.js` + `lib/ort-wasm-simd-threaded.jsep.*` + `models/Xenova/whisper-tiny/` — reconocimiento de voz local (Whisper tiny, respaldo sin internet). Los archivos grandes están partidos en `.p0.wasm`/`.p1.wasm` y el worker los une con un `fetch` interceptado (`SPLITS`).
- `firebase.json`, `.firebaserc` — hosting.

## Flujo principal (en `index.html`)
1. Cargar video → `segs` (partes conservadas/cortadas sobre el tiempo del video original).
2. **✦ Auto** (`analyzeBtn`): audio a 16 kHz → `detectSpeech` (VAD por energía) → `runASR` (Gemini por Firebase si hay config; si falla, Whisper local; `asrInfo` guarda qué motor se usó y el error) → si hay guion, `alignScript` (Smith-Waterman por frase, elige la última toma buena) → `buildSegs` + `applyCut` (muletillas) → `chunkTimed` crea subtítulos con tiempos por palabra.
3. IA (`initAI`): Gemini en el dominio propio; Claude (`window.claude.use('sample')`) solo dentro de claude.ai. `aiIdeas` = gancho, palabras clave, emojis, caption.
4. Render: `renderFrame` (video con zoom/look/formato, subtítulos, gancho, logo/cierre, barra de progreso) o `drawAnim` (video animado desde guion + foto caricatura).
5. Exportación: `exportSmooth` (WebCodecs + mp4-muxer, 30 cps constantes, audio mezclado offline con `mixAudio`); si el navegador no lo soporta, respaldo con MediaRecorder en tiempo real.

## Estado y pendientes (nov 2026)
- **App Check está OBLIGATORIO** en el proyecto Firebase para AI Logic: sin token, Gemini responde 401 "Firebase App Check token is invalid" y el editor cae a Whisper local (causa de los subtítulos malos). El editor ya inicia App Check si `window.APP_CHECK.siteKey` tiene valor; falta que Karen cree la clave reCAPTCHA y la registre en Firebase → App Check. Para probar en local sin reCAPTCHA: token de depuración (`self.FIREBASE_APPCHECK_DEBUG_TOKEN`) registrado en la consola, inyectado con Playwright, nunca en el repo.
- **Gemini real NO verificado** con un video de Karen. Hay un botón "Probar conexión con la IA" en ✦ Auto. Si falla, revisar que AI Logic (Gemini Developer API) esté activado en Firebase y que el modelo exista.
- Karen reportó: subtítulos que no coincidían con su voz (probablemente cayó al modelo local) y video poco fluido (ya se cambió a exportación cuadro por cuadro). Confirmar con un video real.
- La vista previa puede saltar un poco en los cortes (la exportación sale bien).
- Caricatura con IA requiere plan Blaze en Firebase; sin Blaze se usa el filtro.
- Claude no puede escuchar audio por API; la suscripción de Claude no da API en la página propia.

## Cómo probar
- Servidor local: `python3 -m http.server` en la raíz y abrir `index.html#en` (el hash `#en` fuerza transcripción en inglés para pruebas con voces sintéticas).
- Para probar sin gastar IA: definir `window.__AI_MOCK = {kind, transcribe, json, text, image}` antes de cargar la página (Playwright `add_init_script`).
- Verificar exportación con `ffprobe` (30 cps, sin saltos) y `mpdecimate` (sin cuadros repetidos).

## Convenciones
- Interfaz y textos en español latino, sin tecnicismos. Diseño oscuro estilo CapCut; móvil primero (panel en hoja deslizable) y PC (barra lateral + panel + vista previa + timeline).
- No agregar dependencias de CDN nuevas: empaquetar localmente en `lib/`.
- Mensajes de commit en español.
