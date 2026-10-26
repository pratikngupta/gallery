# Plan — "The Darkroom"

Client: Pratik Gupta. Subject: a personal photography portfolio (aircraft, birds,
animals, nature, buildings, plus an unsorted "Field Notes" bucket). Content:
high-quality stills, added over time as loose files.

## Concept
Photography's own vernacular is the darkroom: deep warm darkness, images
"developing" out of black. The site treats photographs as prints hanging on a
dark wall. Darkness is tonal separation, not mood. One accent — safelight red —
is spent only on state (active, hover, focus). Light mode exists as "gallery
mode": warm paper, same tokens, inverted ink.

## Design tokens (canonical copy in `src/styles/global.css`)
| Token            | Dark (default) | Light          | Role                                  |
|------------------|----------------|----------------|---------------------------------------|
| `--bg`           | `#1a1815`      | `#f6f3ee`      | page background                        |
| `--text`         | `#ede8e0`      | `#1a1815`      | primary text                           |
| `--accent`       | `#d03a2b`      | `#b23225`      | safelight: focus rings, nav underline  |
| `--accent-text`  | `#e0604f`      | `var(--accent)`| the accent when it is *text* (AA)      |
| `--meta`         | `#a8a29e`      | `#57534e`      | counts, years, secondary text          |
| `--frame`        | `#2c2823`      | `#ddd8cf`      | hairlines, dividers                    |
| `--darkroom`     | `#0e0d0b`      | `#0e0d0b`      | badge, scrim, popover — always dark    |
| `--radius`       | `8px`          | `8px`          | prints, flat on the wall               |
| `--radius-pill`  | `9999px`       | `9999px`       | chips, badges, the archive CTA         |
| `--container`    | `1320px`       | `1320px`       | content grid                           |
| `--t-fast` / `--t-reveal` / `--t-hero` | `.2s` / `.6s` / `.85s` | same | state change · blur-up develop · hero crossfade |

Type: **Archivo** (unified heading and body family: wordmark, headlines, section titles,
captions; requested as one variable range `400..700` because display lines set 700) ·
**JetBrains Mono** (EXIF, numbering, counts).

## Layout (information architecture)
1. **Header (`.site-header`)**:
   - Mobile ($\le 640\text{px}$): Single compact bar (`h-14` / 56px) with `PRATIK GUPTA` on the left and `HOME GALLERY ABOUT` + theme toggle in one line with 44×44px touch hitboxes.
   - Desktop: Sticky glass header (`backdrop-blur-md`) constrained to the 1320px content grid container.
2. **Home (`/`)**:
   - **Hero**: sentence-case role line, headline, editorial statement; 3:2 photography
     showcase whose prints come from the library (`Hero: N` sidecar ranks, otherwise the
     collection covers, capped at 6), an auto-switching slideshow with a Pause control in
     the hero bar, and a single badge that states a place when the library knows one,
     otherwise the series. No pin icon, no guessed geography.
   - **Featured**: 9-item balanced 3-column masonry wall, deduplicated so it never repeats
     a print the showcase is already showing.
   - **Full Gallery Portal (`#full-gallery`)**: An editorial archive section with one
     cover card per collection plus its count, the row length set from the scanned
     collection count (`--portal-cols`) rather than a hardcoded four, and a solid
     ink/paper pill CTA named after the destination's own word — "Browse the gallery".
     Hover develops the chip (it inverts); nothing lifts on a shadow.
3. **Collections (`/collections/` and `/collections/<category>`)**:
   - Top-level `/collections/`: shows all categories via primary pill bar.
   - Dedicated category `/collections/<category>`: lightweight breadcrumb (`Gallery / Category`,
     gaining `/ Subcategory` only when a filter is active), single-tier subcategory pill switcher,
     high-contrast solid active pills, and a "Back to gallery" capsule at the head of the pill
     row, left of "All <Category>" — the breadcrumb crumb alone was too quiet to find as a way
     back. Capsule radius marks it as navigation, the 8px print radius stays on the series
     filters, and the accent is spent on hover only. The crumb floats in the page-top padding
     band rather than in flow, so every collection page opens at the same level as the gallery
     index — recording the filter costs no vertical space.
4. **Photo detail (`/photo/<id>`)**:
   - Back affordance: a chip pointing at wherever the click came from (`← Home`, `← Gallery`,
     `← Aircraft`, `← Previous print`), read from `window.__fromUrl` (set by `Layout.astro` on
     `astro:before-swap`); on desktop it heads the breadcrumb line (always visible, styled as a
     capsule, elevated with `z-index: 10` above Astro's view-transition overlay layers), on mobile
     the single `← [Series]` link carries the dynamic label. Falls back to the print's own series
     page when there is no recorded origin.
   - Framing: image expands up to `85vh` with `object-contain`.
   - Metadata: 340px sticky right sidebar with a clean, structured spec table (Camera, Lens, Focal Length, Aperture, Shutter, ISO, Captured).
   - Zoom: native popover darkroom zoom to 2400px.
   - Series walk: one quiet line under the spec table — `Previous · …` and `Next · …`, in
     wall order, sentence case, no arrows. It does not render for a series of one.
   - Related wall: "More from {series}" ranked by subseries and category.
5. **View Transitions & Theming**:
   - Client-side navigation via Astro `ClientRouter`. Footer and header are pinned with
     `transition:name` + `transition:animate="none"` so they hold still. Masonry tiles and the
     detail image share `transition:name` for the print-travel morph (the tile lifts off the
     wall and fades as the print settles in); the root swap is instant and `.page-fade` is
     gone, so the print is the only thing that moves on navigation. The hero slides
     intentionally omit `transition:name` to avoid a jarring zoom-out when navigating back
     from a detail page.
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
- Hero showcase crossfade (`--t-hero`) and the badge fade: the one ambient moment, and it
  stops when a viewer hovers, focuses, or presses Pause.
- Blur-up develop: filter/transform `--t-reveal`.
- Everything else is `--t-fast`. `prefers-reduced-motion` disables all of it, including
  the auto-advance.

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
- Sidecar `<photo>.jpg.txt` may carry `Title:`, `Note:`, and `location:` lines. `location:`
  is the only honest source of a place — folders and filenames only ever name a place that is
  literally written in them.

## Avoid list (checked on every design change)
- cream background + terracotta accent, near-black + acid accent, broadsheet
  hairline rules, identical rounded SaaS cards, all-caps eyebrows,
  `A · B · C` template chrome, `→` appended to link text, monospace used as
  generic label decoration, fade-up-on-scroll for every section, and responsive overrides
  written before the rules they override (media queries add no specificity — the later
  base rule wins).

## Phases
1. **Skeleton** — Astro scaffold, tokens (both themes), layout, header/footer, theme toggle ✅
2. **Photo scanner** — folder walk → categories/subcategories/covers/hero, EXIF, ids ✅
3. **Rendition pipeline** — sharp script (40/900/1600/2400/2560 WebP), incremental ✅
4. **Home** — hero with centered CTA, featured wall ✅
5. **Collections** — per-category pages + All page, pill switcher, masonry,
   blur-up loading, subcategory pills ✅
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
