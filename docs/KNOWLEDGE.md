# Knowledge — what this project knows

Read this before changing anything visual or content-related. This file is the
shared memory for humans and agents.

## The owner
Pratik Gupta, photographer. Library lives at `~/Pictures/photos` and was
copied into `src/photos/` on 2026-10-22 (56 photos, 102MB). He organizes in
folders himself; current categories: aircraft (25, incl. F-16/F-18/F-22/
osprey/rca f t33), buildings (8, modern/), landscape (8, coastal/ + mountains/),
wildlife (15, per-species subfolders). Photos are high quality and real — the
footer says "Every photograph is real." His feedback
history: the single endless page was too long to scroll → per-collection pages
were added (see Decisions); then (Oct 2026) he asked for the home/collection
pages to match a centered reference layout — hero CTA, centered headings and
filter chips, clean tiles with hover titles — while keeping the darkroom
tokens and typefaces.

## Design system (the contract)
- **Two themes, one token set.** Dark "darkroom" is the default; light "gallery"
  is the alternate. `:root` in `src/styles/global.css` is the source of truth:
  `--bg #1a1815` / `#f6f3ee`, `--text #ede8e0` / `#1a1815`, `--accent #d03a2b` /
  `#b23225`, `--meta #a8a29e` / `#57534e`, `--frame #2c2823` / `#ddd8cf`,
  `--darkroom #0e0d0b` + `--darkroom-text` (the hero badge, the print scrim, the
  zoom popover — dark in both themes), `--radius: 8px` for prints and
  `--radius-pill: 9999px` for chips, `--container: 1320px`, and `--gutter`,
  `--page-top`, `--page-bottom` as clamps so the page breathes at every width.
  Theme switching is event-delegated with `astro:after-swap` persistence across
  View Transitions.
- **Contrast is measured, not assumed.** `--accent` on `--bg` is 3.65:1 — under
  AA for small text — so the red is spent only where the 3:1 graphical-object
  threshold is enough: focus rings and the nav underline. Anything that turns
  red as *text* on hover uses `--accent-text` (`#e0604f`, 5.02:1 on dark). In
  gallery mode `--accent` is already 5.62:1 on paper, so `--accent-text` is just
  `var(--accent)`. `--meta` measures 7.02:1.
- **Motion budget is a token, not a literal.** `--t-fast: .2s` for state changes,
  `--t-reveal: .6s` for the blur-up develop, `--t-hero: .85s` for the showcase.
  No duration is written inline.
- **Typefaces:** Archivo is standardized as `--font-sans`, which `--font-heading`
  and `--font-body` both point at — one definition, so the two can never drift — across all
  headings and prose to maintain cohesive editorial geometry. JetBrains Mono is used for
  EXIF, specs, numbering, and counts. The Google Fonts request asks Archivo as one variable
  range `wght@400..700` — display lines set 700, and a subset that stops at 600 makes the
  browser fake the bold. Nothing else may be requested and unused.
- **Accent discipline:** `--accent` (safelight red) appears only on
  active/hover/focus states. Never as decoration.
- **Palette is the palette:** every UI element is built from the token set
  (`--bg`, `--text`, `--frame`, `--meta`, `--accent`) and its own inversion.
  The pill switcher and the archive CTA are ink-on-paper in dark mode and paper-on-ink
  in gallery mode, which is why they need no theme-specific hexes — the borrowed
  reference's zinc scale (`#f4f4f5 / #09090b / #18181b / #d4d4d8`) is not in this system.
- **Structure encodes information, not decoration:** no tracked ALL-CAPS eyebrows,
  no `→`/`↓` appended to link or button text, no drop shadow lifting a print off the
  wall. The breadcrumb and the role line are sentence case; the header wordmark and
  nav stay uppercase because they are the mark.
- **Hero badge tells the truth:** it shows a place only when the library states one
  (a `location:` line in a `photo.txt` sidecar, or a place name literally in a folder
  or filename) — otherwise it names the series the folder holds. Geography is never
  guessed: an unknown place hides the badge rather than asserting "Toronto, Canada".
- **No photo chrome:** no cards, borders, or shadows on grid images. The only
  tile chrome is a unified 8px radius (`--radius: 8px`) and a title-only hover
  scrim (shown on hover-capable devices; never on touch). Full metadata lives on
  the `/photo/<id>` detail page.
- **Layout & Header:**
  - Header is a single compact horizontal bar (`h-14` / 56px) on mobile with 44×44px touch targets;
    on desktop it is a sticky glass bar constrained to the 1320px content grid container.
  - Home: editorial hero whose showcase is decided by the library (see Content
    conventions), a Pause control in the hero bar, featured works wall (9 items,
    balanced 3 columns, excluding every print the showcase is showing), and an
    "Explore the full gallery" (`#full-gallery`) archive portal.
  - Collections: dynamic breadcrumbs (`Gallery / Aircraft / [Subcategory]`, the
    subcategory crumb appears only when a filter is active), single-tier
    subcategory pills, high-contrast solid active pills, and a "Back to gallery"
    capsule at the head of the pill row — the breadcrumb crumb alone was too quiet
    to find. Capsule radius on navigation, 8px on filters, so the two read as
    different kinds of control without adding chrome. On a category page the crumb
    floats in the page-top padding band (`top: calc(var(--page-top) - 2.4rem)`,
    scoped to `.collection .breadcrumb`) instead of sitting in flow, so the
    heading, description, pills and wall start at exactly the same level as on
    `/collections/` — the page never "drops down" to record the filter.
  - Detail: an origin-aware back chip (`.photo-back`: `← Home`, `← Gallery`,
    `← Aircraft`, `← Previous print`) at the head of the breadcrumb line on
    desktop, pointing at the page the click actually came from. Always visible
    (styled as a capsule, elevated with `z-index: 10` above Astro's transition
    overlay layers), with `view-transition-name: none` to keep it outside the
    view transition system. On mobile the existing `← [Series]` link is the
    affordance and takes the same dynamic label. With no recorded origin
    (direct URL, JS off) the chip falls back to the print's own series page.
    `85vh` `object-contain` image, a 340px sticky sidebar with a structured spec
    table, and one quiet line under it — `Previous · F-22 Raptor #04` /
    `Next · F-22 Raptor #06` — walking the series in wall order. It does not
    render for a series of one.
  - Masonry via CSS `columns` (3/2/1 at 1024/640px). The zoom popover is always dark in both themes.
- **The carousel stops.** Inactive hero slides are `inert` and `aria-hidden`, so
  keyboard users never land on an invisible link; the pause button in the hero
  bar carries `aria-pressed`. The showcase is `role="group"` with
  `aria-roledescription="carousel"` — `role="carousel"` is not a real ARIA role.

## Content conventions (teach these to anyone adding photos)
1. Put photos in `src/photos/<category>/` — any folder works, no config.
2. A photo with `main` in the name (e.g. `toronto-skyline-main.jpeg`) becomes
   its category's cover in the index and lands on the home featured wall.
3. Subfolders become subcategories (e.g. `aircraft/F-16 Falcon/`).
4. Files at the `src/photos/` root land in Field Notes.
5. The filename is dynamically normalized into a polished title: underscores/hyphens become spaces,
   model acronyms are standardized (`F-16`, `F-18`, `F-22`, `CMV-22`, `RCAF T-33`, `CN Tower`, `Big Sur`),
   trailing numbers become `#07`, and cover tags are stripped (`f_22_raptor_7.jpg` → "F-22 Raptor #07").
6. A `description.txt` in a category folder: first line shown under the title.
7. Camera settings display automatically in a structured spec table (Camera, Lens, Focal Length, Aperture,
   Shutter, ISO, Captured). To override a caption or add a blurb to the detail page, add a `photo.txt` sidecar
   with `Title: ...`, `Note: ...`, `Location: ...`, and/or `Hero: 1` lines. `Location:` is what puts a
   place on the hero badge — without it, the badge names the series instead. `Hero: N` puts that print
   in the home showcase at rank N; with no sidecars anywhere the showcase is each collection's cover,
   capped at 6. Nobody edits code to change the hero.
8. After adding files: `npm run build` (renditions regenerate only for what's new) and deploy. Nothing else.

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
- **Category pages show one ungrouped wall.** Subcategory pills filter the prints;
  they do not section the page into per-subcategory blocks with headers. The owner
  asked for every photo of the category together, so the sectioned layout is gone —
  `groupsFor` and its `.subcat-*` CSS were deleted, not parked. Same for the "series
  sleeve" (`.series-*`) that was drafted and never built. Do not rebuild either.
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
- **Media queries add no specificity.** A base rule written later in
  `global.css` silently beats an earlier `@media` override — that is how the
  whole mobile block sat inert for a phase. Responsive overrides belong AFTER
  the rules they override; the mobile block lives at the end of the file.
  Breakpoints: 640 and 1024 are the structural ones (they match the `sizes`
  strings in the components and the 360/768/1440 test widths in AGENTS.md);
  840 (about grid) and 480 (portal grid) are component exceptions.
- **`hidden` alone is not enough.** An author-level `display` beats the UA rule
  behind `hidden`, so every element the components toggle — `.ph-frame`,
  `.hero-location-pill`, `.breadcrumb-sub`, the desktop `.photo-back` chip — needs
  its own `[hidden] { display: none }` rule. Setting the attribute and expecting it
  to work is the trap.
- **Header must not have `transition:name`.** It has `data-header` to keep it
  persistent across navigations; adding `transition:name` gives it a
  `view-transition-name` CSS rule that triggers a morph between old and new
  header, causing a flash/fade on every page switch.
- **Under ClientRouter there is no "previous page".** `document.referrer` and
  `window.history` never record an in-site hop (the router keeps one document), so
  the back chip on a detail page can only learn where the click came from from
  `astro:before-swap`'s `from` URL, which `Layout.astro` stashes on
  `window.__fromUrl`. Anything that needs an origin trail has to use that hook.
- **Shared-element transition names on the hero cause a jarring zoom-out** when
  navigating from a detail page back to the home page — the detail image and the
  hero slide share the same `view-transition-name`, so Astro morphs them (detail
  image → hero thumbnail). The hero must NOT have `transition:name`; the masonry
  tiles already provide the forward morph.
- **Elements inside a transitioning wrapper need `z-index: 10; position: relative`**
  to render above Astro's `::view-transition-old/new` overlay layers that hide
  the original DOM during SPA swaps. `.photo-back` uses this pattern.
- **Blur-up needs two passes.** Tiles ship with a 40px `src`, a `data-srcset`,
  and `sizes`. The Layout upgrade step promotes `data-srcset` onto the real
  `srcset` and also touches `src`, which is what guarantees the second `load`
  event; that second pass adds `is-loaded` and ends the blur. The placeholder is
  gated on `[data-js]`, set by the head script — with JS off there is nothing to
  unblur. Every `<img>` carries intrinsic `width`/`height` read from
  `public/renditions/manifest.json`, so the wall cannot reflow as prints develop.
- **`scanPhotos()` is memoized** on a `path:mtime` signature of the images and
  their sidecars, and awaits the scan already in flight rather than starting a
  second one: `getStaticPaths` plus every page render would otherwise parse the
  EXIF of 56 photographs 57 times per build.
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
- Which prints belong in the home showcase? Answer it in the library, not in
  code: `Hero: 1` (then `Hero: 2`, and so on) in a sidecar. Until the owner
  ranks them, the showcase is each collection's cover.
- Caption cleanup: several filenames are raw camera names (`f_16_falcon_2.jpg`)
  — a rename pass or `photo.txt` sidecars would make captions read properly.
