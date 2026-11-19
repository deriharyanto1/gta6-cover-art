# Vice Cover Studio

[![gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/deriharyanto1/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/deriharyanto1/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

A web app that turns a person's photo and a caption into cover art in the style
of GTA 6's posters — and exports it as a PNG to share. Built for the
[make.fun gta6-cover-art-01 bounty](https://make.fun/bounty/gta6-cover-art-01).

## What it does

- **Your photos**: upload one or several from your machine (nothing is
  uploaded anywhere), or start from the three bundled sample scenes. Click a
  panel in the preview to pick it, drag to move its photo, scroll to zoom —
  each panel crops and positions its own photo.
- **Six layouts**: Sunset Strip (3 panels), Neon Grid (4), Vice Nine (9),
  Hero Split (3), Boulevard (5) and Stack Six (6) — a multi-panel poster
  collage in every one.
- **Six colour grades**: Sunset, Neon, Coral, Vice Purple, Palm and Midnight —
  a sunset or neon wash over the whole poster, with a frame to match.
- **Bold lettering**: the caption is set in heavy capitals with a hard shadow
  and a halftone dot pattern, and a subtitle line underneath.
- **One-click export**: 1080 × 1080, 1080 × 1350 or 1920 × 1080 PNG, saved
  straight to your downloads. A "Surprise me" button restyles the poster
  with a random layout and grade.

Everything is original: no Rockstar logo, artwork or font — the lettering is a
system sans drawn by hand on canvas, and the sample photos are vector scenes
drawn by a script written for this build.

## Run it

Serve `app/` with any static server (for example `python3 -m http.server`
inside `app/`) and open it in a desktop browser. It works fully offline:
every file it loads lives under `app/`.

## Hand it in

`main.ts` copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
