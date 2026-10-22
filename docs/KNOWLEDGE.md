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
were added (see Decisions); then (Oct 2026) he asked for the home/collection
pages to match a centered reference layout — hero CTA, centered headings and
filter chips, clean tiles with hover titles — while keeping the darkroom
tokens and typefaces.

## Design system (the contract)
- **Two themes, one token set.** Dark "darkroom" is the default; light "gallery"
  is the alternate. Tokens and their values: `docs/PLAN.md` → "Design tokens"
  (the source of truth in code is `:root` in `src/styles/global.css`).
- **Typefaces:** Fraunces (display), Archivo (body), JetBrains Mono (EXIF +
  numbers). Loaded from Google Fonts in `Layout.astro`. Never add a fourth.
- **Accent discipline:** `--accent` (safelight red) appears only on
  active/hover/focus. If a mockup shows it anywhere else, the mockup is wrong.
- **No photo chrome:** no cards, borders, or shadows on grid images. The only
  tile chrome (owner-approved Oct 2026) is a 6px radius and a title-only hover
  scrim (shown on hover-capable devices; never on touch). Full metadata —
  title, series, EXIF — lives on the `/photo/<id>` detail page.
- **Layout:** left-aligned by default; the hero, the "Featured works" heading
  and collection headings + filter chips are centered (owner-approved Oct
  2026). Masonry via CSS `columns` (3/2/1 at 1024/640px). The zoom popover is
  always dark, in both themes.

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
   caption or add a blurb to the detail page, add a `photo.txt` sidecar with
   `Title: ...` and/or `Note: ...` lines.
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
- **Per-photo detail pages + popover zoom + view transitions:** borrowed from
  `~/Downloads/astro-frame-shift-main` on the owner's request. Replaced the
  hash-based lightbox entirely — real `/photo/<id>` routes are shareable and
  SEO-friendly. Related ranking: same subseries (score 2) before same series
  (score 1), capped at 8. The zoom is a native `popover` element (no JS).
- **Sharp script over `astro:assets`:** Astro 7's `getImage` rejects file-path
  strings and our photos are discovered, not imported (see ARCHITECTURE).
- **No route may collide with an index route:** a `src/pages/collections.astro`
  stub used to shadow `collections/index.astro` — Astro warns and skips the
  duplicate at build time (the file silently never ships), while in dev its
  meta-refresh got stuck under client-side navigation ("Moving to…" screen).
  It was deleted. URLs use trailing slashes; static hosts resolve the
  directory form, the dev server redirects the bare form.
- **Collection pages show the full collection.** (An early 12-photo cap with
  a "Load more" button was added for "pages become too long" and later
  removed at the owner's request — the per-category page structure is what
  keeps pages short.)
- **WebP renditions over AVIF:** AVIF quality-per-byte is better but encode time
  at build grows fast with a large library; WebP is the pragmatic 90%.
- **CSS columns masonry over JS masonry:** no layout shift, no JS cost,
  and reading order is column-wise, which reads fine for a gallery.
- **Real `/photo/<id>` routes over the old hash lightbox** (`#photo/...`):
  the hash lightbox was replaced entirely — real routes are shareable and
  SEO-friendly.
- **exifr at build time** rather than storing EXIF in files: the photographer
  will never want to write metadata by hand, and JPEGs already carry it.

## Gotchas
- `load` events don't bubble — the blur-up upgrade listens on `document` in
  capture phase (survives View Transition navigations) plus a start-of-script
  sweep for images already complete. Cached 40px thumbs never fire `load`
  again, so the sweep is load-bearing, not belt-and-braces.
- The theme script in `Layout.astro` must stay `is:inline` and in `<head>`;
  Astro will otherwise bundle it and you get a light/dark flash on load.
- Photo ids are filesystem paths — moving a file changes its
  `/photo/...` URL (old links 404). Note it before any reorganization.
- `exifr` can throw on unusual containers (HEIC, truncated files). The scanner
  catches it and moves on — never let one bad photo kill the build.
- **Astro hoists `getStaticPaths`** out of the frontmatter: its body can only
  see imports, not consts declared in the frontmatter (bit us once with
  RELATED_LIMIT). Keep `getStaticPaths` bodies self-contained.

## Open questions for the owner
- Contact / commission details for the footer (currently "prints available on request").
- Which photo should be the site hero? (Currently: first `main` photo found —
  a `main_*.jpg` placed at the `src/photos/` root overrides everything.)
- Caption cleanup: several filenames are raw camera names (`f_16_falcon_2.jpg`)
  — a rename pass or `photo.txt` sidecars would make captions read properly.
