// Voz a texto con ElevenLabs Scribe (marcas de tiempo por palabra).
import { readFile } from 'node:fs/promises';

export async function transcribe(audioPath, apiKey, { language = 'es' } = {}) {
  const buf = await readFile(audioPath);
  const form = new FormData();
  form.append('file', new Blob([buf], { type: 'audio/mpeg' }), 'audio.mp3');
  form.append('model_id', 'scribe_v2');
  if (language) form.append('language_code', language);
  form.append('timestamps_granularity', 'word');
  form.append('tag_audio_events', 'true');

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) throw new Error('La clave de ElevenLabs no es válida o venció.');
    if (res.status === 402 || /quota|credits/i.test(body)) throw new Error('Tu cuenta de ElevenLabs se quedó sin créditos de transcripción.');
    throw new Error(`ElevenLabs respondió ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return {
    language: data.language_code,
    text: data.text || '',
    words: (data.words || []).map((w) => ({ text: w.text, start: w.start, end: w.end, type: w.type })),
  };
}
