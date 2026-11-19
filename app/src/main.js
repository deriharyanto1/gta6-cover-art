// Vice Cover Studio — wires the page: load photos, pick a layout and a grade,
// edit the caption, crop and position each panel's photo, and export the cover
// as a PNG. A `?shot=` query sets up a fixed scene for a screenshot instead.
import { renderPoster, defaultPlacements, LAYOUTS, GRADES, panelAt } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const captionInput = document.getElementById('caption');
const subtitleInput = document.getElementById('subtitle');
const layoutSelect = document.getElementById('layout');
const gradeSelect = document.getElementById('grade');
const sizeSelect = document.getElementById('size');
const statusLine = document.getElementById('status');
const panelPhotoSelect = document.getElementById('panel-photo');
const panelZoomRange = document.getElementById('panel-zoom');
const panelDxRange = document.getElementById('panel-dx');
const panelDyRange = document.getElementById('panel-dy');
const zoomLabel = document.getElementById('zoom-val');
const panelLabel = document.getElementById('panel-name');

const SAMPLES = [
  { file: 'sunset-boulevard.png', name: 'Sunset Blvd' },
  { file: 'neon-street.png', name: 'Neon Street' },
  { file: 'beach-palm.png', name: 'Beach Palm' },
];

/** The photos the app can draw: { img, name } — samples first, uploads appended. */
const photos = [];
/** Which panel is being edited (0-based). */
let activePanel = 0;
/** Per-panel placement, rebuilt when the layout changes. */
let placements = defaultPlacements(3);

function currentState() {
  return {
    photos: photos.map((p) => p.img),
    layout: layoutSelect.value,
    grade: gradeSelect.value,
    caption: captionInput.value,
    subtitle: subtitleInput.value,
    placements,
  };
}

function paint() {
  renderPoster(canvas, currentState());
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Keeps the panel editor in step with the layout, the photos and the panel. */
function syncPanelEditor() {
  const layout = LAYOUTS[layoutSelect.value] || LAYOUTS['sunset-strip'];
  if (placements.length !== layout.panels.length) placements = defaultPlacements(layout.panels.length);
  if (activePanel >= layout.panels.length) activePanel = 0;
  panelLabel.textContent = String(activePanel + 1);
  panelPhotoSelect.innerHTML = '';
  photos.forEach((p, i) => {
    const o = document.createElement('option');
    o.value = String(i);
    o.textContent = `${i + 1} · ${p.name}`;
    panelPhotoSelect.appendChild(o);
  });
  const place = placements[activePanel];
  panelPhotoSelect.value = String(place.photo % Math.max(1, photos.length));
  panelZoomRange.value = String(Math.round(place.zoom * 100));
  panelDxRange.value = String(Math.round(place.dx * 100));
  panelDyRange.value = String(Math.round(place.dy * 100));
  zoomLabel.textContent = `${Math.round(place.zoom * 100)}%`;
}

/** Applies the panel editor's sliders and photo choice to the active panel. */
function applyPanelEditor() {
  const place = placements[activePanel];
  place.photo = Number(panelPhotoSelect.value) || 0;
  place.zoom = Number(panelZoomRange.value) / 100;
  place.dx = Number(panelDxRange.value) / 100;
  place.dy = Number(panelDyRange.value) / 100;
  zoomLabel.textContent = `${panelZoomRange.value}%`;
  paint();
}

/** Builds the sample-photo strip: one click fills every panel with a sample. */
function buildSampleStrip() {
  const box = document.getElementById('samples');
  SAMPLES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.title = s.name;
    const img = document.createElement('img');
    img.src = `samples/${s.file}`;
    img.alt = s.name;
    b.appendChild(img);
    b.addEventListener('click', () => {
      placements.forEach((p) => { p.photo = i; });
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      syncPanelEditor();
      paint();
    });
    box.appendChild(b);
  });
}

document.getElementById('photo').addEventListener('change', async (e) => {
  const files = [...(e.target.files || [])];
  for (const file of files) {
    try {
      const img = await loadImage(URL.createObjectURL(file));
      photos.push({ img, name: file.name });
    } catch {
      statusLine.textContent = `Could not read ${file.name}`;
    }
  }
  if (files.length > 0) {
    statusLine.textContent = `${files.length} photo${files.length > 1 ? 's' : ''} added`;
    syncPanelEditor();
    paint();
  }
});

captionInput.addEventListener('input', paint);
subtitleInput.addEventListener('input', paint);
layoutSelect.addEventListener('change', () => { syncPanelEditor(); paint(); });
gradeSelect.addEventListener('change', paint);
panelPhotoSelect.addEventListener('change', applyPanelEditor);
panelZoomRange.addEventListener('input', applyPanelEditor);
panelDxRange.addEventListener('input', applyPanelEditor);
panelDyRange.addEventListener('input', applyPanelEditor);

// Surprise me: a random layout and grade, so one click restyles the poster.
document.getElementById('shuffle').addEventListener('click', () => {
  const layouts = Object.keys(LAYOUTS);
  const grades = Object.keys(GRADES);
  layoutSelect.value = layouts[Math.floor(Math.random() * layouts.length)];
  gradeSelect.value = grades[Math.floor(Math.random() * grades.length)];
  syncPanelEditor();
  paint();
  statusLine.textContent = `Now showing ${LAYOUTS[layoutSelect.value].label} in ${GRADES[gradeSelect.value].label}`;
});

// Click a panel to edit it; drag to move its photo; scroll to zoom it.
let dragging = false;
let lastX = 0;
let lastY = 0;
canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const px = (e.clientX - r.left) * (canvas.width / r.width);
  const py = (e.clientY - r.top) * (canvas.height / r.height);
  const hit = panelAt(currentState(), px, py, canvas.width, canvas.height);
  if (hit >= 0) {
    activePanel = hit;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    syncPanelEditor();
  }
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const r = canvas.getBoundingClientRect();
  const place = placements[activePanel];
  place.dx = Math.max(-1, Math.min(1, place.dx + (e.clientX - lastX) / r.width * 1.5));
  place.dy = Math.max(-1, Math.min(1, place.dy + (e.clientY - lastY) / r.height * 1.5));
  lastX = e.clientX;
  lastY = e.clientY;
  syncPanelEditor();
  paint();
});
canvas.addEventListener('pointerup', () => { dragging = false; });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const place = placements[activePanel];
  place.zoom = Math.max(1, Math.min(2.6, place.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
  syncPanelEditor();
  paint();
}, { passive: false });

/** Renders the cover at an export size and returns its PNG blob. */
export function exportCover(sizeLabel) {
  const [w, h] = sizeLabel.split('x').map(Number);
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  renderPoster(off, currentState());
  return new Promise((resolve) => off.toBlob(resolve, 'image/png'));
}

document.getElementById('export').addEventListener('click', async () => {
  const blob = await exportCover(sizeSelect.value);
  if (!blob) {
    statusLine.textContent = 'Export failed — try another size';
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cover-${sizeSelect.value}.png`;
  a.click();
  statusLine.textContent = `Saved cover-${sizeSelect.value}.png (${Math.round(blob.size / 1024)} KB)`;
});

// Boot: load the bundled samples, then draw. A ?shot= query takes over instead.
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
async function boot() {
  for (const s of SAMPLES) {
    try {
      photos.push({ img: await loadImage(`samples/${s.file}`), name: s.name });
    } catch {
      // A missing sample still leaves the editor usable with uploads.
    }
  }
  buildSampleStrip();
  syncPanelEditor();
  if (shot) {
    await runShot(shot, params, {
      setCaption: (t) => { captionInput.value = t; },
      setSubtitle: (t) => { subtitleInput.value = t; },
      setLayout: (v) => { layoutSelect.value = v; },
      setGrade: (v) => { gradeSelect.value = v; },
      setPlacements: (list) => { placements = list; },
      setCanvasSize: (w, h) => { canvas.width = w; canvas.height = h; },
      redraw: paint,
      exportCover,
    });
  } else {
    paint();
  }
}
boot();
