// Arma el video final con ffmpeg: cortes, zoom alterno, subtítulos, gancho y música.
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPieces, buildCaptionGroups, normalizeKeeps } from './timeline.js';
import { buildAss } from './subtitles.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const FONTS_DIR = path.join(here, '..', 'fonts');

export let FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
export let FFPROBE = process.env.FFPROBE_PATH || 'ffprobe';
export function setBinaries({ ffmpeg, ffprobe }) {
  if (ffmpeg) FFMPEG = ffmpeg;
  if (ffprobe) FFPROBE = ffprobe;
}

export function run(bin, args, { onStderr } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; if (err.length > 200000) err = err.slice(-100000); onStderr?.(String(d)); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve({ out, err }) : reject(new Error(`${path.basename(bin)} salió con ${code}: ${err.slice(-1500)}`))));
  });
}

export async function probe(file) {
  const { out } = await run(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', file]);
  const info = JSON.parse(out);
  const v = info.streams.find((s) => s.codec_type === 'video');
  const a = info.streams.find((s) => s.codec_type === 'audio');
  if (!v) throw new Error('El archivo no tiene video.');
  let rotation = 0;
  const sd = (v.side_data_list || []).find((s) => s.rotation !== undefined);
  if (sd) rotation = Number(sd.rotation);
  else if (v.tags?.rotate) rotation = Number(v.tags.rotate);
  const swap = Math.abs(rotation) % 180 === 90;
  return {
    duration: Number(info.format.duration) || Number(v.duration) || 0,
    width: swap ? v.height : v.width,
    height: swap ? v.width : v.height,
    hasAudio: !!a,
  };
}

export async function extractAudio(input, output) {
  await run(FFMPEG, ['-y', '-i', input, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'libmp3lame', '-b:a', '64k', output]);
  return output;
}

const even = (n) => Math.round(n / 2) * 2;

/**
 * @param {object} o
 * @param {string} o.input       video original
 * @param {string} o.output      mp4 final
 * @param {object} o.plan        plan de Claude
 * @param {Array}  o.words       palabras limpias (cleanWords)
 * @param {object} o.info        resultado de probe()
 * @param {string} [o.music]     archivo de música (opcional)
 * @param {string} o.workDir     carpeta temporal
 * @param {(p:number)=>void} [o.onProgress]
 */
export async function renderVideo({ input, output, plan, words, info, music, workDir, onProgress, format = 'vertical' }) {
  const W = format === 'horizontal' ? 1920 : 1080;
  const H = format === 'horizontal' ? 1080 : 1920;

  const keeps = normalizeKeeps(plan.keep, words, info.duration);
  const { pieces, outDuration } = buildPieces(keeps, plan.punch, plan.zoom === false ? 1 : 1.12);
  const groups = buildCaptionGroups(plan.captions, words, pieces, outDuration);

  const assPath = path.join(workDir, 'subs.ass');
  await writeFile(assPath, buildAss({
    groups, hook: plan.hook, styleKey: plan.style, uppercase: !!plan.uppercase, width: W, height: H,
  }));

  const n = pieces.length;
  const f = [];
  f.push(`[0:v]split=${n}${pieces.map((_, i) => `[sv${i}]`).join('')}`);
  if (info.hasAudio) f.push(`[0:a]asplit=${n}${pieces.map((_, i) => `[sa${i}]`).join('')}`);

  pieces.forEach((p, i) => {
    const d = p.srcEnd - p.srcStart;
    const sw = even(W * p.zoom);
    const sh = even(H * p.zoom);
    f.push(`[sv${i}]trim=start=${p.srcStart.toFixed(3)}:end=${p.srcEnd.toFixed(3)},setpts=PTS-STARTPTS,` +
      `scale=${sw}:${sh}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},setsar=1,fps=30,format=yuv420p[v${i}]`);
    if (info.hasAudio) {
      const fd = Math.min(0.015, d / 4).toFixed(3);
      f.push(`[sa${i}]atrim=start=${p.srcStart.toFixed(3)}:end=${p.srcEnd.toFixed(3)},asetpts=PTS-STARTPTS,` +
        `aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=${fd},afade=t=out:st=${(d - Number(fd)).toFixed(3)}:d=${fd}[a${i}]`);
    } else {
      f.push(`anullsrc=r=48000:cl=stereo,atrim=duration=${d.toFixed(3)}[a${i}]`);
    }
  });

  f.push(`${pieces.map((_, i) => `[v${i}][a${i}]`).join('')}concat=n=${n}:v=1:a=1[vc][ac]`);

  const fontsDir = FONTS_DIR.replace(/\\/g, '/').replace(/:/g, '\\:');
  const assEsc = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
  f.push(`[vc]ass=filename='${assEsc}':fontsdir='${fontsDir}'[vout]`);

  // Voz: limpia y a volumen de redes
  f.push(`[ac]highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=10:release=150,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[voice]`);

  const args = ['-y', '-i', input];
  if (music) {
    args.push('-stream_loop', '-1', '-i', music);
    const vol = Math.min(Math.max(Number(plan.music?.volume) || 0.18, 0.05), 0.5);
    const fadeSt = Math.max(0, outDuration - 1.5).toFixed(3);
    f.push(`[voice]asplit=2[vmain][vside]`);
    f.push(`[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${vol},atrim=duration=${outDuration.toFixed(3)},` +
      `afade=t=in:d=0.6,afade=t=out:st=${fadeSt}:d=1.5[mus]`);
    f.push(`[mus][vside]sidechaincompress=threshold=0.04:ratio=6:attack=30:release=450[duck]`);
    f.push(`[vmain][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[aout]`);
  } else {
    f.push(`[voice]anull[aout]`);
  }

  const graphPath = path.join(workDir, 'graph.txt');
  await writeFile(graphPath, f.join(';\n'));

  args.push(
    '-filter_complex_script', graphPath,
    '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-t', outDuration.toFixed(3),
    '-movflags', '+faststart',
    output,
  );

  await run(FFMPEG, args, {
    onStderr: (s) => {
      const m = /time=(\d+):(\d+):([\d.]+)/.exec(s);
      if (m && onProgress) onProgress(Math.min(0.99, (Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) / outDuration));
    },
  });

  return { outDuration, pieces: pieces.length, keeps, captionGroups: groups.length };
}
