// Vice Cover Studio — the poster renderer.
// Draws a multi-panel GTA-style poster onto a canvas: the user's photos fill
// the panels (each cropped and positioned on its own), a colour grade washes
// over the whole poster, and a bold caption is lettered across it with a
// halftone dot pattern and a hard shadow, like a Vice City sunset poster.
// Everything is drawn with the canvas API; no font files, no network, no
// Rockstar artwork.

/** Panel layouts. Each panel is a rectangle in unit space (0..1 of the cover). */
export const LAYOUTS = {
  'sunset-strip': {
    label: 'Sunset Strip',
    panels: [
      { x: 0.03, y: 0.03, w: 0.94, h: 0.44 },
      { x: 0.03, y: 0.51, w: 0.46, h: 0.32 },
      { x: 0.51, y: 0.51, w: 0.46, h: 0.32 },
    ],
    title: { x: 0.5, y: 0.94, size: 0.11, align: 'center' },
  },
  'neon-grid': {
    label: 'Neon Grid',
    panels: [
      { x: 0.03, y: 0.03, w: 0.455, h: 0.385 },
      { x: 0.515, y: 0.03, w: 0.455, h: 0.385 },
      { x: 0.03, y: 0.445, w: 0.455, h: 0.365 },
      { x: 0.515, y: 0.445, w: 0.455, h: 0.365 },
    ],
    title: { x: 0.5, y: 0.93, size: 0.1, align: 'center' },
  },
  'vice-nine': {
    label: 'Vice Nine',
    panels: [
      { x: 0.03, y: 0.03, w: 0.29, h: 0.25 }, { x: 0.345, y: 0.03, w: 0.29, h: 0.25 }, { x: 0.65, y: 0.03, w: 0.21, h: 0.25 },
      { x: 0.03, y: 0.305, w: 0.29, h: 0.25 }, { x: 0.345, y: 0.305, w: 0.29, h: 0.25 }, { x: 0.65, y: 0.305, w: 0.21, h: 0.25 },
      { x: 0.03, y: 0.58, w: 0.29, h: 0.2 }, { x: 0.345, y: 0.58, w: 0.29, h: 0.2 }, { x: 0.65, y: 0.58, w: 0.21, h: 0.2 },
    ],
    title: { x: 0.925, y: 0.72, size: 0.068, align: 'left', vertical: true },
  },
  'hero-split': {
    label: 'Hero Split',
    panels: [
      { x: 0.03, y: 0.03, w: 0.55, h: 0.79 },
      { x: 0.605, y: 0.03, w: 0.365, h: 0.38 },
      { x: 0.605, y: 0.435, w: 0.365, h: 0.385 },
    ],
    title: { x: 0.5, y: 0.93, size: 0.105, align: 'center' },
  },
  boulevard: {
    label: 'Boulevard',
    panels: [
      { x: 0.03, y: 0.03, w: 0.94, h: 0.4 },
      { x: 0.03, y: 0.47, w: 0.21, h: 0.34 },
      { x: 0.265, y: 0.47, w: 0.21, h: 0.34 },
      { x: 0.5, y: 0.47, w: 0.21, h: 0.34 },
      { x: 0.735, y: 0.47, w: 0.21, h: 0.34 },
    ],
    title: { x: 0.5, y: 0.93, size: 0.1, align: 'center' },
  },
  'stack-six': {
    label: 'Stack Six',
    panels: [
      { x: 0.03, y: 0.03, w: 0.455, h: 0.255 }, { x: 0.515, y: 0.03, w: 0.455, h: 0.255 },
      { x: 0.03, y: 0.31, w: 0.455, h: 0.255 }, { x: 0.515, y: 0.31, w: 0.455, h: 0.255 },
      { x: 0.03, y: 0.59, w: 0.455, h: 0.21 }, { x: 0.515, y: 0.59, w: 0.455, h: 0.21 },
    ],
    title: { x: 0.5, y: 0.94, size: 0.1, align: 'center' },
  },
};

/** Colour grades: the paper, the wash, the frame, the inks and the dots. */
export const GRADES = {
  sunset: {
    label: 'Sunset',
    paper: '#251431',
    washTop: 'rgba(255,172,92,0.20)',
    washBottom: 'rgba(188,32,108,0.46)',
    frame: '#ffffff',
    ink: '#ffffff',
    shadow: '#ff2e7a',
    outline: '#190a24',
    dots: '#ffd166',
    subtitle: '#ffe9a8',
  },
  neon: {
    label: 'Neon',
    paper: '#070b26',
    washTop: 'rgba(0,228,255,0.13)',
    washBottom: 'rgba(255,44,148,0.40)',
    frame: '#eaf7ff',
    ink: '#eafcff',
    shadow: '#00e5ff',
    outline: '#0a1030',
    dots: '#ff2d95',
    subtitle: '#8ef1ff',
  },
  coral: {
    label: 'Coral',
    paper: '#113838',
    washTop: 'rgba(255,132,82,0.21)',
    washBottom: 'rgba(14,112,112,0.37)',
    frame: '#fff3e0',
    ink: '#fff7ea',
    shadow: '#ff7f50',
    outline: '#0b2828',
    dots: '#ffb38a',
    subtitle: '#c8fff2',
  },
  purple: {
    label: 'Vice Purple',
    paper: '#1a0e32',
    washTop: 'rgba(184,124,255,0.18)',
    washBottom: 'rgba(255,186,56,0.37)',
    frame: '#f3eaff',
    ink: '#fdf6ff',
    shadow: '#b478ff',
    outline: '#140a28',
    dots: '#ffbe3c',
    subtitle: '#e3c8ff',
  },
  palm: {
    label: 'Palm',
    paper: '#0a2d23',
    washTop: 'rgba(72,224,164,0.15)',
    washBottom: 'rgba(255,190,80,0.35)',
    frame: '#eafff3',
    ink: '#f2fff7',
    shadow: '#2ee6a8',
    outline: '#06221a',
    dots: '#ffd166',
    subtitle: '#b8ffd9',
  },
  midnight: {
    label: 'Midnight',
    paper: '#0b1226',
    washTop: 'rgba(92,142,255,0.18)',
    washBottom: 'rgba(255,172,62,0.34)',
    frame: '#dfe9ff',
    ink: '#f4f8ff',
    shadow: '#5a8cff',
    outline: '#090e20',
    dots: '#ffcf5c',
    subtitle: '#c9d9ff',
  },
};

/** Fresh per-panel placements for a layout of `count` panels. */
export function defaultPlacements(count) {
  const out = [];
  for (let i = 0; i < count; i += 1) out.push({ photo: i % 3, zoom: 1, dx: 0, dy: 0 });
  return out;
}

/** Draws one photo cover-fit into a panel rectangle, with zoom and pan. */
function drawPanelPhoto(ctx, photo, rect, place) {
  if (!photo) return;
  const iw = photo.naturalWidth || photo.width;
  const ih = photo.naturalHeight || photo.height;
  const scale = Math.max(rect.w / iw, rect.h / ih) * place.zoom;
  const pw = iw * scale;
  const ph = ih * scale;
  const cx = rect.x + rect.w / 2 + place.dx * rect.w * 0.4;
  const cy = rect.y + rect.h / 2 + place.dy * rect.h * 0.4;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(photo, cx - pw / 2, cy - ph / 2, pw, ph);
  ctx.restore();
}

/** The heavy poster font used for the caption and the subtitle. */
function posterFont(size) {
  return `900 ${size}px 'Arial Black', 'Helvetica Neue', Arial, sans-serif`;
}

/** Renders `text` onto an offscreen canvas and returns its alpha channel. */
function titleAlphaMask(canvas, text, x, y, size, align, vertical) {
  const off = document.createElement('canvas');
  off.width = canvas.width;
  off.height = canvas.height;
  const o = off.getContext('2d');
  o.font = posterFont(size);
  o.textAlign = align;
  o.textBaseline = 'alphabetic';
  o.fillStyle = '#ffffff';
  if (vertical) {
    o.save();
    o.translate(x, y);
    o.rotate(-Math.PI / 2);
    o.fillText(text, 0, 0);
    o.restore();
  } else {
    o.fillText(text, x, y);
  }
  return o.getImageData(0, 0, off.width, off.height).data;
}

/** Letters the caption: hard shadow, dark outline, solid ink, halftone dots. */
function drawTitle(ctx, text, spec, grade, size) {
  const vertical = !!spec.vertical;
  const align = vertical ? 'left' : (spec.align || 'center');
  const x = spec.x * ctx.canvas.width;
  const y = spec.y * ctx.canvas.height;

  // One painter for the three solid passes: shadow, outline, ink.
  const paint = (style, dx, dy, stroke) => {
    ctx.save();
    ctx.font = posterFont(size);
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    if (stroke) {
      ctx.lineWidth = Math.max(2, size * 0.045);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = style;
    } else {
      ctx.fillStyle = style;
    }
    if (vertical) {
      ctx.translate(x + dx, y + dy);
      ctx.rotate(-Math.PI / 2);
    } else {
      ctx.translate(x + dx, y + dy);
    }
    if (stroke) ctx.strokeText(text, 0, 0);
    else ctx.fillText(text, 0, 0);
    ctx.restore();
  };
  paint(grade.shadow, size * 0.06, size * 0.06, false);
  paint(grade.outline, 0, 0, true);
  paint(grade.ink, 0, 0, false);

  // Halftone dots: a grid over the letters, a dot where the mask is set,
  // sized by the mask's alpha — big where the letter is solid, small at its
  // edges — so the caption reads as a printed poster title.
  const mask = titleAlphaMask(ctx.canvas, text, x, y, size, align, vertical);
  const step = Math.max(6, Math.round(size / 9));
  const W = ctx.canvas.width;
  ctx.fillStyle = grade.dots;
  for (let gy = 0; gy < ctx.canvas.height; gy += step) {
    for (let gx = 0; gx < W; gx += step) {
      const alpha = mask[(gy * W + gx) * 4 + 3] / 255;
      if (alpha > 0.4) {
        const r = step * (0.1 + 0.24 * alpha);
        ctx.beginPath();
        ctx.arc(gx + step / 2, gy + step / 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/**
 * Draws the whole poster.
 * `state`: { photos, layout, grade, caption, subtitle, placements }.
 * Photos are HTMLImageElements; placements are { photo, zoom, dx, dy } per panel.
 */
export function renderPoster(canvas, state) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const layout = LAYOUTS[state.layout] || LAYOUTS['sunset-strip'];
  const grade = GRADES[state.grade] || GRADES.sunset;
  const S = Math.min(w, h);

  ctx.fillStyle = grade.paper;
  ctx.fillRect(0, 0, w, h);

  // Panels: dark backing, the photo, then a white frame, like a poster collage.
  const inset = Math.round(S * 0.006);
  layout.panels.forEach((p, i) => {
    const rect = { x: p.x * w, y: p.y * h, w: p.w * w, h: p.h * h };
    const place = (state.placements && state.placements[i]) || { photo: i % 3, zoom: 1, dx: 0, dy: 0 };
    const photo = state.photos.length ? state.photos[place.photo % state.photos.length] : null;
    ctx.fillStyle = '#101018';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    drawPanelPhoto(ctx, photo, rect, place);
    ctx.lineWidth = Math.max(2, Math.round(S * 0.006));
    ctx.strokeStyle = grade.frame;
    ctx.strokeRect(rect.x + inset, rect.y + inset, rect.w - inset * 2, rect.h - inset * 2);
  });

  // Colour grade wash, stronger toward the bottom, then a vignette.
  const wash = ctx.createLinearGradient(0, 0, 0, h);
  wash.addColorStop(0, grade.washTop);
  wash.addColorStop(1, grade.washBottom);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);
  const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // Caption: shrink to fit, then letter it with halftone dots.
  const text = (state.caption || '').trim().toUpperCase();
  if (text) {
    const t = layout.title;
    let size = t.size * S;
    ctx.font = posterFont(size);
    const maxW = t.vertical ? h * 0.62 : w * 0.94;
    while (ctx.measureText(text).width > maxW && size > 14) {
      size -= 2;
      ctx.font = posterFont(size);
    }
    drawTitle(ctx, text, t, grade, size);
  }

  // Subtitle in small caps: under the title, or at the foot for a vertical title.
  const sub = (state.subtitle || '').trim().toUpperCase();
  if (sub) {
    const t = layout.title;
    ctx.font = `700 ${Math.max(12, Math.round(S * 0.028))}px 'Arial Black', 'Helvetica Neue', Arial, sans-serif`;
    ctx.fillStyle = grade.subtitle;
    if (t.vertical) {
      ctx.textAlign = 'center';
      ctx.fillText(sub, w / 2, h - Math.max(8, S * 0.02));
    } else {
      ctx.textAlign = t.align || 'center';
      ctx.fillText(sub, t.x * w, Math.min(h - 6, t.y * h + S * 0.055));
    }
  }
}

/** The panel index (in unit space) under a point on the canvas, or -1. */
export function panelAt(state, px, py, canvasW, canvasH) {
  const layout = LAYOUTS[state.layout] || LAYOUTS['sunset-strip'];
  for (let i = 0; i < layout.panels.length; i += 1) {
    const p = layout.panels[i];
    if (px >= p.x * canvasW && px <= (p.x + p.w) * canvasW && py >= p.y * canvasH && py <= (p.y + p.h) * canvasH) return i;
  }
  return -1;
}
