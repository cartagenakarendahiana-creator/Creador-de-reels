// Convierte el plan de Claude en una línea de tiempo segura para renderizar.
// Todo en segundos. "src" = video original, "out" = video final.

const MIN_PIECE = 0.25;   // tramo mínimo que vale la pena conservar
const PAD = 0.06;         // aire antes/después de cada palabra para no comerse sílabas

export function cleanWords(rawWords = []) {
  return rawWords
    .filter((w) => w.type === 'word' && typeof w.start === 'number' && typeof w.end === 'number')
    .map((w, i) => ({ i, text: String(w.text).trim(), start: w.start, end: Math.max(w.end, w.start + 0.05) }))
    .filter((w) => w.text.length > 0)
    .map((w, i) => ({ ...w, i }));
}

// Une, ordena y ajusta los tramos para no cortar a mitad de palabra.
export function normalizeKeeps(keeps, words, duration) {
  let list = (Array.isArray(keeps) ? keeps : [])
    .map((k) => ({ start: Number(k.start), end: Number(k.end) }))
    .filter((k) => Number.isFinite(k.start) && Number.isFinite(k.end) && k.end > k.start);

  if (!list.length) list = [{ start: 0, end: duration }];

  // No partir palabras: si un borde cae dentro de una palabra, se extiende hasta su borde.
  for (const k of list) {
    for (const w of words) {
      if (k.start > w.start && k.start < w.end) k.start = w.start;
      if (k.end > w.start && k.end < w.end) k.end = w.end;
    }
    k.start = Math.max(0, k.start - PAD);
    k.end = Math.min(duration, k.end + PAD);
  }

  list.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const k of list) {
    const last = merged[merged.length - 1];
    if (last && k.start <= last.end + 0.04) last.end = Math.max(last.end, k.end);
    else merged.push({ ...k });
  }
  return merged.filter((k) => k.end - k.start >= MIN_PIECE);
}

// Parte los tramos en "piezas" en cada golpe de zoom y alterna el zoom en cada corte.
export function buildPieces(keeps, punches = [], zoomAmount = 1.12) {
  const cuts = [...new Set((punches || []).map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
  const pieces = [];
  let out = 0;
  let zoomed = false;
  for (const k of keeps) {
    const inner = cuts.filter((t) => t > k.start + MIN_PIECE && t < k.end - MIN_PIECE);
    const bounds = [k.start, ...inner, k.end];
    for (let j = 0; j < bounds.length - 1; j++) {
      const srcStart = bounds[j];
      const srcEnd = bounds[j + 1];
      pieces.push({ srcStart, srcEnd, outStart: out, zoom: zoomed ? zoomAmount : 1 });
      out += srcEnd - srcStart;
      zoomed = !zoomed;
    }
  }
  return { pieces, outDuration: out };
}

export function srcToOut(t, pieces) {
  for (const p of pieces) {
    if (t >= p.srcStart - 1e-6 && t <= p.srcEnd + 1e-6) return p.outStart + (t - p.srcStart);
  }
  return null;
}

// Grupos de subtítulos ya en tiempo de salida.
export function buildCaptionGroups(captions, words, pieces, outDuration) {
  const groups = [];
  const used = new Set();
  const source = Array.isArray(captions) && captions.length ? captions : autoGroups(words);

  for (const c of source) {
    const [a, b] = Array.isArray(c.w) ? c.w : [];
    if (!Number.isInteger(a) || !Number.isInteger(b) || b < a) continue;
    const ws = words.slice(a, b + 1);
    if (!ws.length) continue;

    // Texto corregido por Claude: solo se usa si coincide en número de palabras.
    let texts = ws.map((w) => w.text);
    if (typeof c.text === 'string') {
      const t = c.text.trim().split(/\s+/).filter(Boolean);
      if (t.length === ws.length) texts = t;
    }
    const hl = new Set((c.hl || []).map(Number));

    const items = [];
    ws.forEach((w, idx) => {
      if (used.has(w.i)) return;
      const mid = (w.start + w.end) / 2;
      const s = srcToOut(Math.max(w.start, pieceStartFor(mid, pieces) ?? w.start), pieces);
      const e = srcToOut(Math.min(w.end, pieceEndFor(mid, pieces) ?? w.end), pieces);
      if (s == null || e == null) return; // palabra eliminada en la edición
      used.add(w.i);
      items.push({ text: texts[idx], start: s, end: Math.max(e, s + 0.08), hl: hl.has(idx) });
    });
    if (items.length) groups.push({ words: items, start: items[0].start, end: items[items.length - 1].end });
  }

  groups.sort((x, y) => x.start - y.start);
  // Suavizar: cada grupo se queda en pantalla hasta el siguiente si el hueco es corto.
  for (let g = 0; g < groups.length; g++) {
    const next = groups[g + 1];
    const limit = next ? next.start : outDuration;
    if (limit - groups[g].end < 0.6) groups[g].end = limit;
    else groups[g].end = Math.min(limit, groups[g].end + 0.25);
  }
  return groups;
}

function pieceStartFor(t, pieces) {
  const p = pieces.find((x) => t >= x.srcStart && t <= x.srcEnd);
  return p ? p.srcStart : null;
}
function pieceEndFor(t, pieces) {
  const p = pieces.find((x) => t >= x.srcStart && t <= x.srcEnd);
  return p ? p.srcEnd : null;
}

// Respaldo si Claude no devolvió subtítulos: grupos de hasta 3 palabras.
export function autoGroups(words) {
  const out = [];
  let start = 0;
  for (let i = 0; i < words.length; i++) {
    const isEnd = i - start >= 2 || i === words.length - 1 || /[.,;:?!]$/.test(words[i].text) ||
      (words[i + 1] && words[i + 1].start - words[i].end > 0.4);
    if (isEnd) { out.push({ w: [start, i], hl: [] }); start = i + 1; }
  }
  return out;
}
