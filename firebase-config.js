// Configuración de Firebase para la IA (Gemini por Firebase AI Logic).
// Pega aquí los datos de tu app web de Firebase (Configuración del proyecto → Tus apps → Web).
// Estos datos son públicos por diseño; la seguridad se controla desde Firebase.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDWHhR7Kha223v3rLdRsgv06yjTkUAp_FY",
  authDomain: "estudio-de-reels.firebaseapp.com",
  projectId: "estudio-de-reels",
  storageBucket: "estudio-de-reels.firebasestorage.app",
  messagingSenderId: "104107160079",
  appId: "1:104107160079:web:3908ae6b5f8927bdfb697a"
};
/* Ejemplo:
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "estudio-de-reels.firebaseapp.com",
  projectId: "estudio-de-reels",
  storageBucket: "estudio-de-reels.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
*/
// Modelos de Gemini (se pueden cambiar aquí sin tocar el editor).
window.AI_MODELS = { text: 'gemini-3.6-flash', image: 'gemini-3.1-flash-image' };
// Protección App Check (obligatoria en este proyecto para usar Gemini).
// siteKey: la "clave del sitio" de reCAPTCHA que registraste en Firebase → App Check.
// provider: 'v3' para reCAPTCHA v3, 'enterprise' para reCAPTCHA Enterprise.
window.APP_CHECK = { provider: 'v3', siteKey: '' };
