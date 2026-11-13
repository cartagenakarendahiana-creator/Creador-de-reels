// Worker de reconocimiento de voz (Whisper tiny, corre local en el dispositivo)
let pipe = null;
let SPLITS = {};
const origFetch = self.fetch.bind(self);
self.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input && input.url) || String(input);
  const clean = url.split('?')[0].split('#')[0];
  for (const k in SPLITS) {
    if (clean.endsWith(k)) {
      const bufs = [];
      for (const u of SPLITS[k]) {
        const r = await origFetch(u);
        if (!r.ok) throw new Error('No se pudo descargar ' + u + ' (' + r.status + ')');
        bufs.push(await r.arrayBuffer());
        self.postMessage({ type: 'part', file: k });
      }
      const total = bufs.reduce((a, b) => a + b.byteLength, 0);
      return new Response(new Blob(bufs), { status: 200, headers: {
        'Content-Type': k.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream',
        'Content-Length': String(total) } });
    }
  }
  return origFetch(input, init);
};
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === 'load') {
    try {
      SPLITS = m.splits || {};
      const T = await import(m.base + 'lib/transformers.min.js');
      const env = T.env;
      env.allowRemoteModels = false;
      env.allowLocalModels = true;
      env.localModelPath = m.base + 'models/';
      env.useBrowserCache = typeof caches !== 'undefined';
      env.backends.onnx.wasm.wasmPaths = m.base + 'lib/';
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.proxy = false;
      pipe = await T.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
        dtype: 'q8', device: 'wasm',
        progress_callback: p => self.postMessage({ type: 'progress', p: { status: p.status, file: p.file, loaded: p.loaded, total: p.total } })
      });
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'error', message: String((err && err.message) || err) });
    }
  } else if (m.type === 'run') {
    try {
      const out = await pipe(m.audio, {
        language: m.lang || 'spanish', task: 'transcribe', return_timestamps: true,
        max_new_tokens: Math.min(440, Math.round(8 * m.seconds + 30))
      });
      self.postMessage({ type: 'result', id: m.id, out });
    } catch (err) {
      self.postMessage({ type: 'result', id: m.id, error: String((err && err.message) || err) });
    }
  }
};
