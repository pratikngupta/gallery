# Knowledge — what this project knows

Read this before changing anything visual or content-related. This file is the
shared memory for humans and agents.

## The owner
Pratik Gupta, photographer. Library lives at `~/Pictures/photos` and was
copied into `src/photos/` on 2026-10-22 (56 photos, 102MB). He organizes in
folders himself; current categories: aircraft (25, incl. F-16/F-18/F-22/
osprey/rca f t33), buildings (8, modern/), landscape (8, coastal/ + mountains/),
wildlife (15, per-species subfolders). Photos are high quality and real — the
footer explicitly says "All photos are real, not AI generated". His feedback
history: the single endless page was too long to scroll → per-collection pages
were added (see Decisions).

## Design system (the contract)
- **Two themes, one token set.** Dark "darkroom" is the default; light "gallery"
  is the alternate. Tokens and their values: `docs/PLAN.md` → "Design tokens"
  (the source of truth in code is `:root` in `src/styles/global.css`).
- **Typefaces:** Fraunces (display), Archivo (body), JetBrains Mono (EXIF +
  numbers). Loaded from Google Fonts in `Layout.astro`. Never add a fourth.
- **Accent discipline:** `--accent` (safelight red) appears only on
  active/hover/focus. If a mockup shows it anywhere else, the mockup is wrong.
- **No photo chrome:** zero borders, shadows, radii, or overlays on grid images.
  Captions sit *below*, never on, the photo.
- **Layout:** left-aligned, ragged right; masonry via CSS `columns` (3/2/1 at
  1024/640px); lightbox is the only centered surface and it is always dark.

## Content conventions (teach these to anyone adding photos)
1. Put photos in `src/photos/<category>/` — any folder works, no config.
2. A photo with `main` in the name (e.g. `toronto-skyline-main.jpeg`) becomes
   its category's cover in the index and lands on the home featured wall.
3. Subfolders become subcategories (e.g. `aircraft/F-16 Falcon/`).
4. Files at the `src/photos/` root land in Field Notes.
5. The filename is the title: underscores become spaces, hyphens and spaces
   stay, `main` is removed, first letter capitalized. Rename to retitle.
   (`f_16_falcon.jpg` → "F 16 Falcon" — rename to `F-16 falcon.jpg` for the
   proper caption.)
6. A `description.txt` in a category folder: first line shown under the title.
7. Camera settings display automatically (read from the JPEG). To override a
   caption, add a `photo.txt` sidecar with a `Title: ...` line.
8. After adding files: `npm run build` (renditions regenerate only for what's
   new) and deploy. Nothing else.

## Decisions made (and why — don't re-litigate without a reason)
- **Astro, not React/Next:** the site is content, not an app; zero-JS output
  is the exact fit.
- **Git + files over a CMS:** see `docs/ARCHITECTURE.md` → "Why no CMS".
- **Per-collection pages over one long page:** the owner found the single
  6000px page too long to scroll. Borrowed from
  `~/Downloads/astro-photography-portfolio-main` (its collection routes +
  pill switcher + hero scroll cue + nav underline hover) — its Tailwind/
  Playfair/white visual system was NOT adopted; only the IA and micro-UX.
- **Sharp script over `astro:assets`:** Astro 7's `getImage` rejects file-path
  strings and our photos are discovered, not imported (see ARCHITECTURE).
- **WebP renditions over AVIF:** AVIF quality-per-byte is better but encode time
  at build grows fast with a large library; WebP is the pragmatic 90%.
- **CSS columns masonry over JS masonry:** no layout shift, no JS cost,
  and reading order is column-wise, which reads fine for a gallery.
- **Hash-based photo routes** (`#photo/...`) over real routes: the lightbox is
  an overlay, not a page; hashes survive any static host without rewrites.
- **exifr at build time** rather than storing EXIF in files: the photographer
  will never want to write metadata by hand, and JPEGs already carry it.

## Gotchas
- `load` events don't bubble — the blur-up upgrade listens in capture phase on
  the `.masonry` container. If you move images elsewhere, move the listener too.
- The theme script in `Layout.astro` must stay `is:inline` and in `<head>`;
  Astro will otherwise bundle it and you get a light/dark flash on load.
- Photo ids are filesystem paths — moving a file breaks its `#photo/` hash.
  Fine today; note it before building a favorites/bookmarks feature.
- `exifr` can throw on unusual containers (HEIC, truncated files). The scanner
  catches it and moves on — never let one bad photo kill the build.

## Open questions for the owner
- Contact / commission details for the footer (currently "prints available on request").
- Which photo should be the site hero? (Currently: first `main` photo found —
  a `main_*.jpg` placed at the `src/photos/` root overrides everything.)
- Caption cleanup: several filenames are raw camera names (`f_16_falcon_2.jpg`)
  — a rename pass or `photo.txt` sidecars would make captions read properly.
