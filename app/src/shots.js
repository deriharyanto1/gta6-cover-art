// Fixed scenes for screenshots: ?shot=cover shows the cover alone at the
// viewport's size; ?shot=editor shows the page with a sample photo; ?shot=export
// renders a PNG and records its size in the DOM so a headless check can read it.
// Query params: layout, grade, photo (sample index), caption, subtitle, size.
// window.__shotReady is set once the scene is painted.
import { defaultPlacements, LAYOUTS } from './cover.js';

/** Panel counts per layout, for spreading the samples across the panels. */
const PANEL_COUNTS = {
  'sunset-strip': 3,
  'neon-grid': 4,
  'vice-nine': 9,
  'hero-split': 3,
  boulevard: 5,
  'stack-six': 6,
};

export async function runShot(shot, query, api) {
  const layout = query.get('layout') ?? 'sunset-strip';
  const grade = query.get('grade') ?? 'sunset';
  const photo = Number(query.get('photo') ?? 0);
  const caption = query.get('caption') ?? 'Neon Getaway';
  const subtitle = query.get('subtitle') ?? 'Vice City After Dark';

  api.setLayout(layout);
  api.setGrade(grade);
  api.setCaption(caption);
  api.setSubtitle(subtitle);

  // Spread the samples across the panels: panel i takes sample (photo + i) % 3.
  const count = PANEL_COUNTS[layout] ?? LAYOUTS[layout]?.panels.length ?? 3;
  const placements = defaultPlacements(count);
  placements.forEach((p, i) => { p.photo = (photo + i) % 3; });
  api.setPlacements(placements);
  api.redraw();

  if (shot === 'cover' || shot === 'cover-wide') {
    // Draw the cover at its true export size so the full-bleed shot is undistorted.
    const size = query.get('size') ?? '1920x1080';
    const [w, h] = size.split('x').map(Number);
    api.setCanvasSize(w, h);
    api.redraw();
    document.body.classList.add('shot-cover');
  }
  if (shot === 'export') {
    const size = query.get('size') ?? '1920x1080';
    const blob = await api.exportCover(size);
    const el = document.createElement('p');
    el.id = 'export-check';
    el.textContent = blob ? `export-ok ${size} ${blob.size} ${blob.type}` : 'export-failed';
    document.body.appendChild(el);
  }
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
