# Plan — "The Darkroom"

Client: Pratik Gupta. Subject: a personal photography portfolio (aircraft, birds,
animals, nature, buildings, plus an unsorted "Field Notes" bucket). Content:
high-quality stills, added over time as loose files.

## Concept
Photography's own vernacular is the darkroom: deep warm darkness, images
"developing" out of black. The site treats photographs as prints hanging on a
dark wall. Darkness is tonal separation, not mood. One accent — safelight red —
is spent only on state (active, hover, focus). Light mode exists as "gallery
mode": warm paper, same tokens, same layo## Design tokens (canonical copy in `src/styles/global.css`)
| Token            | Dark (default) | Light          | Role                                  |
|------------------|----------------|----------------|---------------------------------------|
| `--bg`           | `#1a1815`      | `#f6f3ee`      | page background                        |
| `--text`         | `#ede8e0`      | `#1a1815`      | primary text                           |
| `--accent`       | `#d03a2b`      | `#b23225`      | safelight: active/hover/focus only     |
| `--meta`         | `#a8a29e`      | `#57534e`      | counts, years, secondary text (WCAG AA)|
| `--frame`        | `#2c2823`      | `#ddd8cf`      | hairlines, dividers                    |
| `--radius`       | `8px`          | `8px`          | unified corner radius for tiles/cards  |

Type: **Archivo** (unified heading and body family: wordmark, headlines, section titles,
captions) · **JetBrains Mono** (EXIF, numbering, counts).

## Layout (information architecture)
1. **Header (`.site-header`)**:
   - Mobile ($\le 640\text{px}$): Single compact bar (`h-14` / 56px) with `PRATIK GUPTA` on the left and `HOME GALLERY ABOUT` + theme toggle in one line with 44×44px touch hitboxes.
   - Desktop: Sticky glass header (`backdrop-blur-md`) constrained to the 1320px content grid container.
2. **Home (`/`)**:
   - **Hero**: 3:2 photography showcase with auto-switching slideshow, location pill, and editorial statement.
   - **Featured**: 9-item balanced 3-column masonry wall, automatically deduplicated to exclude the active hero image.
   - **Full Gallery Portal (`#full-gallery`)**: An editorial archive section with category preview cards (Aircraft, Buildings, Landscape, Wildlife with photograph counts) and a high-contrast pill CTA linking to `/collections/`.
3. **Collections (`/collections/` and `/collections/<category>`)**:
   - Top-level `/collections/`: shows all categories via primary pill bar.
   - Dedicated category `/collections/<category>`: lightweight breadcrumb (`Gallery / Category` dynamically updating to `Gallery / Category / Subcategory`), single-tier subcategory pill switcher, high-contrast solid active pills.
4. **Photo detail (`/photo/<id>`)**:
   - Responsive breadcrumb: clean single back affordance (`← [Subcategory]`) on mobile ($<640\text{px}$), full hierarchy on desktop.
   - Framing: image expands up to `85vh` with `object-contain`.
   - Metadata: 340px sticky right sidebar with a clean, structured spec table (Camera, Lens, Focal Length, Aperture, Shutter, ISO, Captured).
   - Zoom: native popover darkroom zoom to 2400px.
   - Related wall: "More from {series}" ranked by subseries and category.
5. **View Transitions & Theming**:
   - Client-side navigation via Astro `ClientRouter` with shared-element image morphs.
   - Theme toggle uses document-level event delegation and `<head>` `astro:after-swap` listener to guarantee persistence and reactivity across all page transitions.

## Alignment & type rules
- Left-aligned by default. Centered, by owner approval (Oct 2026): the hero
  composition, the "Featured works" heading, and collection headings + chips.
  Nothing else.
- Line length < 70ch on prose.
- No all-caps labels. No accent on a single word in a headline. No `·`-joined
  decorative meta strings (EXIF lines are data, and may use `·`).
- Numbering exists only where content is a sequence (index rows, EXIF counts).

## Motion budget
- Hero slow-zoom: the one ambient moment.
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
4. **Home** — hero with centered CTA, featured wall ✅
5. **Collections** — per-category pages + All page, pill switcher, masonry,
   blur-up loading, subcategory blocks ✅
6. **Real photos** — library copied in (56 photos, 4 categories) ✅
7. **Photo detail pages** (frame-shift IA) — `/photo/<id>`, related wall,
   popover zoom, view transitions ✅
8. **Owner QA & polish** —
   - Typography standardized to Archivo across all headings and body ✅
   - Dynamic title normalization (`f_22_raptor_7` → `F-22 Raptor #07`) ✅
   - Mobile single-row header (`h-14`, 44×44px hitboxes) and compact spacing ✅
   - Hero photo deduplication from featured works & balanced 9-item grid ✅
   - Detail view structured spec table, 85vh framing, responsive breadcrumb ✅
   - Main page "Explore the full gallery" archive portal (`#full-gallery`) ✅
   - Theme toggle event delegation & persistence across View Transitions ✅
9. **Launch & Deploy** —
   - OG image + social metadata
   - Domain + deploy (GitHub Pages / Netlify / Cloudflare Pages)
