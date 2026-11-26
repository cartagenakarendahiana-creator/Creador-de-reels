# Editor con Claude

Subes tu video y Claude lo edita solo: corta silencios, muletillas y tomas repetidas, pone subtítulos palabra por palabra con la palabra clave resaltada, agrega zooms para dar ritmo, mete música de fondo (que baja sola cuando hablas) y te propone el gancho y el texto del post. Si algo no te gusta, le escribes el cambio y vuelve a armar el video.

## Cómo funciona

1. Subes el video desde el celular.
2. **Whisper** (gratis, corre dentro de tu Firebase) pasa la voz a texto, con el tiempo exacto de cada palabra.
3. **Claude** lee la transcripción y decide la edición.
4. Un servidor en Firebase arma el video con ffmpeg (subtítulos con letra Poppins, zooms, música, voz nivelada a volumen de redes).
5. Lo ves, lo descargas o le pides cambios.

## Configuración (una sola vez)

### 1. Proyecto de Firebase
1. Entra a https://console.firebase.google.com y crea un proyecto nuevo (por ejemplo `editor-claude`).
2. Ve a **Configuración ⚙ → Uso y facturación** y cambia al plan **Blaze**. Pon una alerta de presupuesto (por ejemplo 5 USD).
3. En el menú de la izquierda:
   - **Authentication → Comenzar → Google → Habilitar**.
   - **Firestore Database → Crear base de datos** → ubicación `nam5 (United States)` → modo producción.
   - **Storage → Comenzar** → misma ubicación → modo producción.

### 2. Llave para que GitHub publique
1. En Firebase: **Configuración ⚙ → Cuentas de servicio → Generar nueva clave privada**. Se descarga un archivo `.json`.
2. En https://console.cloud.google.com/iam-admin/iam (con el mismo proyecto elegido), busca la cuenta que termina en `firebase-adminsdk-…` → lápiz → **Agregar rol → Propietario** → Guardar.

### 3. Clave de Claude
https://console.anthropic.com → Billing → cargar saldo → **API Keys → Create Key**.

### 4. Guardar las 2 claves en GitHub
En el repo: **Settings → Secrets and variables → Actions → New repository secret**:

| Nombre | Valor |
|---|---|
| `EDITOR_FIREBASE_SA` | todo el contenido del archivo `.json` del paso 2 |
| `ANTHROPIC_API_KEY` | la clave de Claude (`sk-ant-…`) |

### 5. Publicar
Ve a la pestaña **Actions** → "Publicar Editor con Claude" → **Re-run**. Al terminar, el editor queda en `https://TU-PROYECTO.web.app`.

**La primera cuenta de Google que entre al editor queda como dueña.** Nadie más puede usarlo ni gastar tus créditos.

## Costos aproximados por video de 1 minuto
- Claude: Haiku por defecto (muy económico, 5 USD alcanzan para cientos de videos). Si eliges "Calidad máxima" usa Sonnet, que cuesta varias veces más.
- Transcripción (Whisper): gratis, solo usa un poco de servidor.
- Firebase: casi siempre dentro de la capa gratis.

## Límites actuales
- Hasta 6 minutos por video.
- Claude decide por la voz, no ve la imagen.
- La transcripción tarda más o menos lo mismo que dura el video.
