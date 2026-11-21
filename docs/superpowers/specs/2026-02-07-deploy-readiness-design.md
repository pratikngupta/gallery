# Deploy-readiness sweep — design

## Intent

The site must be free of bugs before it goes live: it must build
cleanly, every page must render correctly with the owner's real library
(134 photos, 5 collections), and every item in the AGENTS.md
Definition of done must hold. No new features, no visual changes —
the design system is locked by `docs/KNOWLEDGE.md` and AGENTS.md.

## Bugs found in the audit (as of this doc)

1. **Build crashes; all EXIF is silently lost.** `exifr` 7.1.3 calls
   `FileHandle.stat(path)`, which Node 26 no longer accepts
   (`ERR_INVALID_ARG_TYPE`). `readMeta()` swallows the error, so every
   photo loses its EXIF, and the leaked file handle later kills the
   whole process when GC reclaims it ("FileHandle object was closed
   during garbage collection") — currently in `scripts/build-renditions.mjs`,
   nondeterministically. Consequences: build dies; About page camera/lens
   kit is empty; detail pages lose camera specs and capture dates.
   **Fix:** read the file into a Buffer and pass the Buffer to
   `exifr.parse` in `src/lib/photos.mjs` — avoids the broken FileHandle
   code path entirely, works on all Node versions, no dependency change.
2. **Hero slideshow: dots out of sync after random start.**
   `Hero.astro` reorders the DOM for the random opening slide but the
   captured `dots`/`slides` arrays keep the old order, so the active-dot
   highlight and `aria-pressed` mark the wrong dot after navigation.
   **Fix:** rebuild the `slides`/`dots` arrays from the DOM after the
   reorder (the dot buttons keep their `data-index`, so re-indexing is
   by DOM order).
3. **Blur-up can stall after SPA navigation.** The one-time `sweep()` in
   `Layout.astro` only runs at initial load. After a view-transition to a
   page whose 40px thumbnails are already cached (`img.complete` is true
   before the script runs), no `load` event fires and the wall stays
   blurred. **Fix:** also run the sweep on `astro:page-load`.
4. **Hero links omit the trailing slash.** `render.mjs` `heroSlidesFor`
   emits `href: /photo/<id>` while the whole site (masonry tiles, series
   nav, redirects) uses `/photo/<id>/`. Every hero click takes a redirect
   hop. **Fix:** add the slash.
5. **Filenames with a leading space** (`src/photos/aircraft/CF-188A
   Hornet/ CF-188A Hornet 1 featured.jpg` ×3). Titles are trimmed already,
   but the ids start with `-`. **Fix:** trim path segments in the scanner
   so ids and rendition filenames are clean (no photo files renamed).
6. **Repo hygiene.** `localhost_2026-10-25_21-17-22.report.html` (a 700 KB
   Lighthouse report) is committed in the root. **Fix:** delete.

## Flagged for the owner (not changed silently)

- About page sidebar reads "Toronto, Ontario — Western University".
  Western University is in London, ON. Copy left as-is; owner decides.
- Hero subhead "Architecture, landscapes, wildlife, and aircraft." is
  hand-written copy and does not track the folders; left as-is.

## Scope

**Do:** items 1–6 above, then a full verification pass against the
AGENTS.md Definition of done: `npm run build` passes; preview server
served and every page checked (home, /collections/, each collection,
sample photo detail pages, /about/, 404) — no broken internal links,
every rendition URL referenced in markup exists in `dist/`; keyboard
reachability and focus rings; `prefers-reduced-motion`; both themes.
Plus a light polish pass inside the locked design system (small
correctness/robustness fixes only, e.g. hero timer on hidden tabs).

**Don't:** no new features, colors, fonts, or layout changes; no renaming
of the owner's photo files; no host/provider configuration (the owner
clarified "deployment ready" = bug-free); no copy changes beyond what is
flagged above.

## Approaches considered

- **Audit → fix in place → verify** (chosen): the smallest change that
  gets a bug-free site; AGENTS.md forbids most alternatives.
- Rebuild/restructure (Vite + framework, CMS, etc.): ruled out by
  AGENTS.md non-negotials (no framework JS, folder structure is the
  content model) and by prior owner rejections.
- Pin an older Node instead of fixing the exifr path: hides the bug,
  keeps EXIF broken on any modern Node, and Node 26 is what the owner
  runs.

## What's left to the builder

Fix ordering (1 first — nothing can be verified until the build passes),
exact verification commands, and the Definition-of-done evidence to
report back.
