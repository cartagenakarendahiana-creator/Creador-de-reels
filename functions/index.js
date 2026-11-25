// Editor con Claude — funciones en la nube.
// Flujo: el navegador sube el video y crea jobs/{id} → preparar (audio) → Whisper (functions-py) → Claude hace el plan → render → listo.
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions, logger } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';

import { setBinaries, probe, extractAudio, renderVideo } from './lib/render.js';
import { makePlan, revisePlan } from './lib/claude.js';
import { cleanWords } from './lib/timeline.js';

setBinaries({ ffmpeg: ffmpegPath, ffprobe: ffprobe.path });
initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 3 });

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

const db = getFirestore();
const bucket = () => getStorage().bucket();
const MAX_SECONDS = 6 * 60;

// ---------- utilidades ----------

async function setJob(id, data) {
  await db.doc(`jobs/${id}`).set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

// El primer usuario que usa el editor queda como dueño; nadie más puede gastar tus créditos.
async function ensureOwner(uid) {
  const ref = db.doc('config/owner');
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) { tx.set(ref, { uid, since: FieldValue.serverTimestamp() }); return true; }
    const allowed = [snap.data().uid, ...(snap.data().extra || [])];
    return allowed.includes(uid);
  });
}

async function getSettings(uid) {
  const s = await db.doc(`users/${uid}`).get();
  return s.exists ? s.data().settings || {} : {};
}

async function listTracks(uid) {
  const [files] = await bucket().getFiles({ prefix: `users/${uid}/musica/` });
  return files.map((f) => path.basename(f.name)).filter((n) => /\.(mp3|m4a|wav|aac|ogg)$/i.test(n));
}

// tracks: null = sin música, [] = sin biblioteca
async function tracksFor(uid, job) {
  if (job.music === 'ninguna') return null;
  const all = await listTracks(uid);
  if (job.music && job.music !== 'auto') return all.filter((t) => t === job.music);
  return all;
}

async function loadTranscript(jobId) {
  const [buf] = await bucket().file(`jobs/${jobId}/transcript.json`).download();
  return JSON.parse(String(buf));
}

function friendly(e) {
  const msg = e?.message || String(e);
  return msg.length > 400 ? msg.slice(0, 400) + '…' : msg;
}

// ---------- 1. preparar: revisar el video y sacar el audio ----------
// Luego la función de Python (functions-py) transcribe con Whisper y deja el video en "planificar".

async function prepare(jobId, job) {
  const work = await mkdtemp(path.join(tmpdir(), 'pr-'));
  try {
    await setJob(jobId, { status: 'preparando', step: 'Preparando tu video…', error: FieldValue.delete() });
    const input = path.join(work, 'input');
    await bucket().file(job.inputPath).download({ destination: input });
    const info = await probe(input);
    if (info.duration > MAX_SECONDS) throw new Error(`El video dura ${Math.round(info.duration)} s. Por ahora el máximo es ${MAX_SECONDS / 60} minutos.`);
    if (!info.hasAudio) throw new Error('El video no tiene audio, así que no hay voz que editar.');
    const audio = await extractAudio(input, path.join(work, 'audio.mp3'));
    await bucket().upload(audio, { destination: `jobs/${jobId}/audio.mp3`, contentType: 'audio/mpeg', resumable: false });
    await setJob(jobId, { status: 'transcribir', step: 'Escuchando tu video…', duration: info.duration, info });
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

export const procesarVideo = onDocumentCreated(
  { document: 'jobs/{jobId}', timeoutSeconds: 540, memory: '2GiB', cpu: 1 },
  async (event) => {
    const jobId = event.params.jobId;
    const job = event.data?.data();
    if (!job || job.status !== 'subido') return;
    try {
      if (!(await ensureOwner(job.uid))) throw new Error('Este editor es privado y pertenece a otra cuenta.');
      await prepare(jobId, job);
    } catch (e) {
      logger.error(e);
      await setJob(jobId, { status: 'error', error: friendly(e) });
    }
  },
);

// ---------- 1b. Claude hace el plan de edición ----------

export const planificar = onDocumentUpdated(
  { document: 'jobs/{jobId}', secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 300, memory: '512MiB' },
  async (event) => {
    const before = event.data.before.data();
    const job = event.data.after.data();
    if (job.status !== 'planificar' || before.status === 'planificar') return;
    const jobId = event.params.jobId;
    try {
      await setJob(jobId, { status: 'editando', step: 'Claude está editando…' });
      const tr = await loadTranscript(jobId);
      const settings = await getSettings(job.uid);
      const tracks = await tracksFor(job.uid, job);
      const { plan, usage } = await makePlan({
        apiKey: ANTHROPIC_API_KEY.value(), rawWords: tr.words, duration: job.duration,
        settings, tracks, instructions: job.instructions, format: job.format,
      });
      logger.info('plan', { jobId, usage });
      await setJob(jobId, { plan, status: 'renderizar', step: 'Armando el video…' });
    } catch (e) {
      logger.error(e);
      await setJob(jobId, { status: 'error', error: friendly(e) });
    }
  },
);

// ---------- 2. render ----------

export const renderizar = onDocumentUpdated(
  { document: 'jobs/{jobId}', timeoutSeconds: 540, memory: '8GiB', cpu: 4 },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (after.status !== 'renderizar' || before.status === 'renderizar') return;
    const jobId = event.params.jobId;

    const work = await mkdtemp(path.join(tmpdir(), 'rd-'));
    try {
      await setJob(jobId, { status: 'renderizando', step: 'Armando el video…', progress: 0 });
      const input = path.join(work, 'input');
      await bucket().file(after.inputPath).download({ destination: input });
      const info = after.info || (await probe(input));
      const tr = await loadTranscript(jobId);
      const words = cleanWords(tr.words);

      let music;
      const track = after.plan?.music?.track;
      if (track && after.music !== 'ninguna') {
        const f = bucket().file(`users/${after.uid}/musica/${track}`);
        const [exists] = await f.exists();
        if (exists) { music = path.join(work, 'music' + path.extname(track)); await f.download({ destination: music }); }
      }

      let last = 0;
      const output = path.join(work, 'final.mp4');
      const result = await renderVideo({
        input, output, plan: after.plan, words, info, music, workDir: work, format: after.format,
        onProgress: (p) => {
          if (p - last >= 0.1) { last = p; setJob(jobId, { progress: Math.round(p * 100) }).catch(() => {}); }
        },
      });

      const version = (after.version || 0) + 1;
      const outPath = `users/${after.uid}/jobs/${jobId}/final_v${version}.mp4`;
      await bucket().upload(output, { destination: outPath, contentType: 'video/mp4', resumable: false });
      await setJob(jobId, {
        status: 'listo', step: '¡Listo!', progress: 100, outputPath: outPath, version,
        outDuration: result.outDuration,
      });
    } catch (e) {
      logger.error(e);
      await setJob(jobId, { status: 'error', error: friendly(e) });
    } finally {
      await rm(work, { recursive: true, force: true });
    }
  },
);

// ---------- 3. pedirle cambios a Claude ----------

export const pedirCambio = onCall(
  { secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 300, memory: '1GiB' },
  async (req) => {
    const uid = req.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Inicia sesión.');
    const { jobId, texto } = req.data || {};
    const ref = db.doc(`jobs/${jobId}`);
    const snap = await ref.get();
    if (!snap.exists || snap.data().uid !== uid) throw new HttpsError('not-found', 'No encontré ese video.');
    if (!(await ensureOwner(uid))) throw new HttpsError('permission-denied', 'Este editor es privado.');
    const job = snap.data();
    if (['subido', 'preparando', 'transcribir', 'planificar', 'editando', 'renderizando', 'renderizar'].includes(job.status)) {
      throw new HttpsError('failed-precondition', 'Espera a que termine la versión actual.');
    }

    try {
      // Sin plan todavía (falló antes): se retoma desde la etapa que falta.
      if (!job.plan) {
        const [hasTr] = await bucket().file(`jobs/${jobId}/transcript.json`).exists();
        const [hasAudio] = await bucket().file(`jobs/${jobId}/audio.mp3`).exists();
        if (hasTr) await setJob(jobId, { status: 'planificar', step: 'Claude está editando…', error: FieldValue.delete() });
        else if (hasAudio && job.duration) await setJob(jobId, { status: 'transcribir', step: 'Escuchando tu video…', error: FieldValue.delete() });
        else await prepare(jobId, job);
        return { ok: true };
      }
      const pedido = String(texto || '').trim();
      if (!pedido) { await setJob(jobId, { status: 'renderizar', step: 'Armando el video…' }); return { ok: true }; }

      await setJob(jobId, { status: 'editando', step: 'Claude está aplicando tu cambio…', error: FieldValue.delete() });
      const tr = await loadTranscript(jobId);
      const settings = await getSettings(uid);
      const tracks = await tracksFor(uid, job);
      const { plan } = await revisePlan({
        apiKey: ANTHROPIC_API_KEY.value(), rawWords: tr.words, duration: job.duration, settings, tracks,
        instructions: job.instructions, format: job.format, previousPlan: job.plan, history: job.history || [], request: pedido,
      });
      await setJob(jobId, { plan, history: FieldValue.arrayUnion(pedido), status: 'renderizar', step: 'Armando el video…' });
      return { ok: true };
    } catch (e) {
      logger.error(e);
      await setJob(jobId, { status: 'error', error: friendly(e) });
      throw new HttpsError('internal', friendly(e));
    }
  },
);
