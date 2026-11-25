// Claude decide la edición: qué cortar, cómo agrupar subtítulos, qué resaltar, gancho, música y texto del post.
import Anthropic from '@anthropic-ai/sdk';
import { STYLES } from './subtitles.js';

export const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

const PLAN_TOOL = {
  name: 'plan_de_edicion',
  description: 'Entrega el plan completo de edición del video.',
  input_schema: {
    type: 'object',
    properties: {
      keep: {
        type: 'array',
        description: 'Tramos del video ORIGINAL que se conservan, en segundos y en orden. Todo lo que no esté aquí se corta.',
        items: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, required: ['start', 'end'] },
      },
      captions: {
        type: 'array',
        description: 'Grupos de subtítulos en orden. w = [índice primera palabra, índice última palabra] según los # de la transcripción. text = las mismas palabras corregidas (ortografía, tildes, mayúsculas de nombres), con EXACTAMENTE la misma cantidad de palabras. hl = posiciones (0 = primera del grupo) de la palabra clave a resaltar; casi siempre 0 o 1 palabra.',
        items: {
          type: 'object',
          properties: {
            w: { type: 'array', items: { type: 'integer' }, minItems: 2, maxItems: 2 },
            text: { type: 'string' },
            hl: { type: 'array', items: { type: 'integer' } },
          },
          required: ['w', 'text'],
        },
      },
      punch: {
        type: 'array',
        description: 'Momentos (segundos del ORIGINAL) donde conviene un golpe de zoom para dar ritmo: frases fuertes, remates, cambios de idea. Uno cada 3 a 6 segundos aprox.',
        items: { type: 'number' },
      },
      hook: {
        type: 'object',
        description: 'Texto de gancho que aparece arriba al inicio del video. Corto (máx. 7 palabras), que dé ganas de quedarse. Nada de tono publicitario.',
        properties: { text: { type: 'string' }, seconds: { type: 'number' } },
        required: ['text'],
      },
      style: { type: 'string', enum: Object.keys(STYLES), description: 'Estilo de subtítulos según el tono del video.' },
      uppercase: { type: 'boolean', description: 'Subtítulos en MAYÚSCULAS (solo si el video es muy enérgico).' },
      music: {
        type: 'object',
        description: 'Música de fondo. track = nombre exacto de una canción de la biblioteca, o null si el video va mejor sin música.',
        properties: { track: { type: ['string', 'null'] }, volume: { type: 'number', description: '0.08 a 0.3; más bajo si hay mucha voz.' } },
      },
      title: { type: 'string', description: 'Título corto para el video.' },
      post: { type: 'string', description: 'Texto para la publicación (copy). Natural, en la voz del creador, sin sonar a cuña.' },
      hashtags: { type: 'array', items: { type: 'string' } },
      notes: { type: 'string', description: 'Explicación breve (2-4 frases) para el creador de lo que hiciste y por qué.' },
    },
    required: ['keep', 'captions', 'punch', 'hook', 'style', 'title', 'post', 'notes'],
  },
};

const SYSTEM = `Eres el editor de video de un creador de contenido latinoamericano que publica Reels, TikToks y YouTube en español. Editas a partir de la transcripción con marcas de tiempo por palabra. No ves la imagen: decides por la voz.

Cómo editas:
- Quitas silencios largos (más de ~0.35 s), arranques en falso, muletillas de relleno ("eh", "mmm", "este..." cuando no aportan), y tomas repetidas: si dice la misma frase dos veces, te quedas con la ÚLTIMA versión completa.
- Nunca cortas a mitad de palabra ni pegas frases de forma que cambie lo que quiso decir. El resultado debe sonar natural y fluido, con ritmo de redes.
- No inventas ni agregas contenido. Mejoras, no alargas.
- Si el video ya está limpio, cortas poco.

Subtítulos:
- Grupos cortos de 1 a 4 palabras (máx. ~20 caracteres), cortados en pausas naturales de la frase.
- Cubren todas las palabras que se conservan, en orden, sin repetir índices.
- Corriges ortografía y tildes; sin punto final; conservas ¿? y ¡! cuando aportan.
- Resaltas solo la palabra que pesa: cifras, nombres, palabras emocionales o la idea clave. No resaltes en todos los grupos.

Gancho, título y post:
- El creador odia que suene a publicidad. Todo debe sentirse auténtico, como algo suyo, no como una cuña.
- El gancho es corto y genera curiosidad sobre lo que viene.

Responde SIEMPRE usando la herramienta plan_de_edicion.`;

function formatTranscript(rawWords) {
  const lines = [];
  let idx = 0;
  let prevEnd = 0;
  for (const w of rawWords) {
    if (w.type === 'spacing') continue;
    if (w.start - prevEnd > 0.3) lines.push(`   (silencio ${(w.start - prevEnd).toFixed(2)}s)`);
    if (w.type === 'audio_event') {
      lines.push(`   [${w.text} ${w.start.toFixed(2)}–${w.end.toFixed(2)}]`);
    } else if (w.type === 'word' && String(w.text).trim()) {
      lines.push(`#${idx} [${w.start.toFixed(2)}–${w.end.toFixed(2)}] ${String(w.text).trim()}`);
      idx++;
    }
    prevEnd = Math.max(prevEnd, w.end);
  }
  return lines.join('\n');
}

function contextBlock({ duration, settings, tracks, instructions, format }) {
  const parts = [`Duración del video original: ${duration.toFixed(2)} s. Formato de salida: ${format === 'horizontal' ? 'horizontal 16:9 (YouTube)' : 'vertical 9:16 (Reels/TikTok)'}.`];
  if (settings?.style) parts.push(`Estilo fijo del creador (aplícalo siempre):\n${settings.style}`);
  if (settings?.vocab) parts.push(`Nombres y palabras que se escriben así: ${settings.vocab}`);
  if (settings?.subtitleStyle && settings.subtitleStyle !== 'auto') parts.push(`Usa el estilo de subtítulos "${settings.subtitleStyle}".`);
  if (tracks === null) parts.push('Este video va SIN música (music.track = null).');
  else if (tracks.length) parts.push(`Biblioteca de música disponible:\n${tracks.map((t) => `- ${t}`).join('\n')}`);
  else parts.push('No hay música en la biblioteca: music.track = null.');
  if (instructions) parts.push(`Instrucciones para ESTE video:\n${instructions}`);
  return parts.join('\n\n');
}

async function callClaude(apiKey, messages) {
  const client = new Anthropic({ apiKey });
  let res;
  try {
    res = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      tools: [PLAN_TOOL],
      tool_choice: { type: 'tool', name: PLAN_TOOL.name },
      messages,
    });
  } catch (e) {
    if (e?.status === 401) throw new Error('La clave de la API de Claude no es válida.');
    if (e?.status === 400 && /credit/i.test(e?.message || '')) throw new Error('Tu cuenta de la API de Claude no tiene saldo. Recarga en console.anthropic.com.');
    throw e;
  }
  const block = res.content.find((c) => c.type === 'tool_use');
  if (!block) throw new Error('Claude no devolvió un plan.');
  return { plan: block.input, usage: res.usage };
}

export async function makePlan({ apiKey, rawWords, duration, settings, tracks, instructions, format }) {
  const content = `${contextBlock({ duration, settings, tracks, instructions, format })}\n\nTranscripción:\n${formatTranscript(rawWords)}`;
  return callClaude(apiKey, [{ role: 'user', content }]);
}

export async function revisePlan({ apiKey, rawWords, duration, settings, tracks, instructions, format, previousPlan, history, request }) {
  const content = `${contextBlock({ duration, settings, tracks, instructions, format })}\n\nTranscripción:\n${formatTranscript(rawWords)}\n\n` +
    `Este es el plan que ya aplicaste:\n${JSON.stringify(previousPlan)}\n\n` +
    (history?.length ? `Cambios pedidos antes: ${history.map((h) => `"${h}"`).join(', ')}\n\n` : '') +
    `El creador ahora pide este cambio:\n"${request}"\n\nDevuelve el plan COMPLETO actualizado; cambia solo lo necesario para cumplir el pedido.`;
  return callClaude(apiKey, [{ role: 'user', content }]);
}
