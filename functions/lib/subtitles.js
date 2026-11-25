// Genera subtítulos .ass "palabra por palabra" con la palabra activa resaltada.

// Colores ASS van en formato &HAABBGGRR
export const STYLES = {
  amarillo: { name: 'Amarillo', active: '&H0000E1FF', keyword: '&H0000E1FF' },
  verde:    { name: 'Verde neón', active: '&H0057FF39', keyword: '&H0057FF39' },
  rosa:     { name: 'Rosa', active: '&H00B469FF', keyword: '&H00B469FF' },
  celeste:  { name: 'Celeste', active: '&H00FFD24A', keyword: '&H00FFD24A' },
  limpio:   { name: 'Blanco limpio', active: '&H00FFFFFF', keyword: '&H0000E1FF' },
};

function ts(t) {
  t = Math.max(0, t);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t - Math.floor(t)) * 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function esc(text) {
  return String(text).replace(/\\/g, '').replace(/[{}]/g, '').replace(/\n/g, ' ');
}

export function buildAss({ groups, hook, styleKey = 'amarillo', uppercase = false, width = 1080, height = 1920 }) {
  const st = STYLES[styleKey] || STYLES.amarillo;
  const marginV = Math.round(height * 0.27);
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: ${width}
PlayResY: ${height}
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Poppins ExtraBold,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,8,3,2,90,90,${marginV},1
Style: Hook,Poppins Black,76,&H00111111,&H00FFFFFF,&H00FFFFFF,&H00FFFFFF,0,0,0,0,100,100,0,0,3,18,0,8,110,110,${Math.round(height * 0.12)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const lines = [];
  const fmt = (t) => (uppercase ? t.toLocaleUpperCase('es') : t);

  for (const g of groups) {
    const ws = g.words;
    for (let k = 0; k < ws.length; k++) {
      const start = k === 0 ? g.start : ws[k].start;
      const end = k === ws.length - 1 ? g.end : ws[k + 1].start;
      if (end - start < 0.02) continue;
      const parts = ws.map((w, j) => {
        const t = esc(fmt(w.text));
        if (j === k) {
          // palabra que se está diciendo: color + pequeño "pop"
          return `{\\c${st.active}\\fscx108\\fscy108\\t(0,90,\\fscx116\\fscy116)\\t(90,180,\\fscx110\\fscy110)}${t}{\\r}`;
        }
        if (w.hl) return `{\\c${st.keyword}}${t}{\\r}`;
        return t;
      });
      // Entrada suave del grupo
      const intro = k === 0 ? '{\\fad(60,0)}' : '';
      lines.push(`Dialogue: 0,${ts(start)},${ts(end)},Caption,,0,0,0,,${intro}${parts.join(' ')}`);
    }
  }

  if (hook && hook.text) {
    const dur = Math.min(Math.max(Number(hook.seconds) || 3, 1.5), 6);
    lines.push(`Dialogue: 1,${ts(0)},${ts(dur)},Hook,,0,0,0,,{\\fad(120,250)}${esc(hook.text)}`);
  }

  return header + lines.join('\n') + '\n';
}
