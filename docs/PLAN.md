# Plan — "The Darkroom"

Client: Pratik Gupta. Subject: a personal photography portfolio (aircraft, birds,
animals, nature, buildings, plus an unsorted "Field Notes" bucket). Content:
high-quality stills, added over time as loose files.

## Concept
Photography's own vernacular is the darkroom: deep warm darkness, images
"developing" out of black. The site treats photographs as prints hanging on a
dark wall. Darkness is tonal separation, not mood. One accent — safelight red —
is spent only on state (active, hover, focus). Light mode exists as "gallery
mode": warm paper, same tokens, same layout.

## Design tokens (canonical copy in `src/styles/global.css`)
| Token      | Dark (default) | Light          | Role                                  |
|------------|----------------|----------------|---------------------------------------|
| `--bg`     | `#1a1815`      | `#f6f3ee`      | page background                        |
| `--text`   | `#ede8e0`      | `#1a1815`      | primary text                           |
| `--accent` | `#d03a2b`      | `#b23225`      | safelight: active/hover/focus only     |
| `--meta`   | `#8a857c`      | `#6e6a62`      | counts, years, secondary text          |
| `--frame`  | `#2c2823`      | `#ddd8cf`      | hairlines, dividers                    |

Type: **Fraunces** (display: name, category titles) · **Archivo** (body, nav,
captions) · **JetBrains Mono** (EXIF, numbering, counts). Scale: hero
`clamp(2.75rem, 9vw, 7rem)`, category `clamp(2rem, 5vw, 3.25rem)`, index
`clamp(1.6rem, 4vw, 2.5rem)`, body 1rem/1.6, small 0.8125rem.

## Layout (information architecture)
Borrowed from two Astro templates (adapted to the darkroom system, not
copied): astro-photography-portfolio contributed the **per-collection pages**
(pill switcher, featured home, hero scroll cue, nav underline hover);
astro-frame-shift contributed the **per-photo detail pages** (`/photo/<id>`),
related-photo ranking, the native-popover zoom, and Astro View Transitions
with shared-element morphs. No page is ever longer than one body of work.

1. **Home (`/`)** — hero → featured wall → index. Deliberately short.
   - **Hero**: full-bleed photograph, 100svh, slow 18s zoom (the single
     page-load motion moment). Name in Fraunces lower-left. A small "Featured"
     scroll invitation at bottom-center that fades out once the page moves.
   - **Featured**: a short masonry wall — every `main` photo first, topped up
     with category covers (capped at 8).
   - **Index**: vertical table of contents, one row per category (mono number,
     Fraunces name, count); hovering a row develops that category's cover into
     the background; rows link to `/collections/<category>`.
2. **Collections (`/collections/` and `/collections/<category>`)** — Fraunces
   title (+ the folder's `description.txt` line if present), a pill switcher
   (All + categories, active in safelight red), then CSS multi-column masonry.
   Full-width prints, no frames. Caption below: title + year (mono, meta).
   Subcategories render as labeled sub-blocks before the category's loose photos.
4. **Photo detail (`/photo/<id>`)** — one photograph, full attention:
   back link ("← Aircraft"), large image (2/3, object-contain, max 85svh,
   `cursor: zoom-in`) beside a sticky metadata column (Fraunces title,
   series, optional note, and a facts list: Series / Date / Camera /
   Settings in mono). Clicking the image opens a **native popover zoom**
   (2400px rendition, scale+fade, darkroom background, click to close).
   Below: "More from {series}" — up to 8 related photos ranked by
   subseries match first, then series match.
5. **View Transitions** — SPA-style navigation via `ClientRouter`; grid
   tiles and the detail image share `transition:name="image-<id>"` so a
   tile morphs into the detail page; the footer persists across navigations.
   (The earlier `#photo/` hash lightbox was replaced by these real routes —
   better sharing, SEO, and no in-page state to lose.)

## Alignment & type rules
- Everything left-aligned, ragged right. Nothing centered except the lightbox image.
- Line length < 70ch on prose.
- No all-caps labels. No accent on a single word in a headline. No `·`-joined
  decorative meta strings (EXIF lines are data, and may use `·`).
- Numbering exists only where content is a sequence (index rows, EXIF counts).

## Motion budget
- Hero slow-zoom: the one ambient moment.
- Index cover develop (hover): fade 0.6s + settle 1.4s.
- Blur-up image load: filter/transform 0.6s.
- Everything else instant. `prefers-reduced-motion` disables all of it.

## Content model (the drop-in folder system)
```
src/photos/                        ← as of Oct 2026:
├── aircraft/                      ← 25 photos
│   ├── description.txt            ← "Military jets and aviation photography"
│   ├── F-16 Falcon/  F-18 Hornet/  F-22 Raptor/  osprey/  rca f t33/
├── buildings/                     ← 8 photos (modern/)
├── landscape/                     ← 8 photos (coastal/, mountains/)
└── wildlife/                      ← 15 photos (sparrows, seagulls, squirrel, ...)
```
- New folder = new category appears. New subfolder = new sub-section.
  (Categories were birds/animals/nature in the original plan; the real library
  organized itself as landscape/wildlife — the scanner never cared.)
- `*-main.jpg` files mark covers; a category without one uses its first photo.
- Root-level files count toward Field Notes (catch-all, always last).
- Title = filename (`_` → spaces, `main` removed; hyphens/spaces kept).
- `description.txt` first line = section subtitle.
- EXIF read from the JPEG at build time (camera, lens, focal, ƒ, shutter, ISO, date).
- Year for captions: EXIF date → file mtime.
- Sidecar `photo.txt` with a `Title: ...` line overrides the title (only override needed).

## Avoid list (checked on every design change)
- cream background + terracotta accent, near-black + acid accent, broadsheet
  hairline rules, identical rounded SaaS cards, all-caps eyebrows,
  `A · B · C` template chrome, `→` appended to link text, monospace used as
  generic label decoration, fade-up-on-scroll for every section.

## Phases
1. **Skeleton** — Astro scaffold, tokens (both themes), layout, header/footer, theme toggle ✅
2. **Photo scanner** — folder walk → categories/subcategories/covers/hero, EXIF, ids ✅
3. **Rendition pipeline** — sharp script (40/900/1600/2400/2560 WebP), incremental ✅
4. **Home** — hero with scroll cue, featured wall, hover-develop index ✅
5. **Collections** — per-category pages + All page, pill switcher, masonry,
   blur-up loading, subcategory blocks ✅
6. **Real photos** — library copied in (56 photos, 4 categories) ✅
7. **Photo detail pages** (frame-shift IA) — `/photo/<id>`, related wall,
   popover zoom, view transitions ✅
8. **Owner QA & launch** — owner testing, hero/cover picks, caption cleanup,
   performance + a11y audit, OG images, deploy
   (GitHub Pages / Netlify / Cloudflare Pages)
