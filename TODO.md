# TODO

## Phase 1 — Skeleton ✅
- [x] Astro scaffold, git repo, design tokens (dark + light)
- [x] Layout, header, footer, theme toggle with pre-paint resolution

## Phase 2 — Content model ✅
- [x] Folder walk → categories / subcategories / covers / hero
- [x] EXIF via exifr, filename titles, `photo.txt` + `description.txt` support
- [x] Graceful empty state for `src/photos/`

## Phase 3 — Image pipeline ✅
- [x] Incremental sharp rendition script (40/900/1600/2400/2560 WebP)
- [x] Blur-up loading (40px `src` → 900/1600 srcset), placeholder gated on `[data-js]` so it never applies without JS

## Phase 4 — Pages ✅
- [x] Home: hero (slow zoom + scroll cue), featured wall, hover-develop index
- [x] Collection pages: /collections/ (All) + per-category, pill switcher
- [x] Masonry with subcategory blocks

## Phase 5 — Real photos ✅
- [x] Library copied from ~/Pictures/photos (56 photos, 4 categories)
- [x] Production build passes

## Phase 6 — Photo detail pages (frame-shift IA) ✅
- [x] /photo/<id> pages (56): large image + sticky metadata (Series/Date/Camera/Settings)
- [x] Related wall ranked by subseries/series match (8)
- [x] Native-popover zoom to 2400px (replaces the old hash lightbox)
- [x] View Transitions: ClientRouter + shared-element tile→detail morphs
- [x] photo.txt sidecars now support a Note: line (shown on the detail page)

## Phase 7 — Owner QA & Polish ✅
- [x] Visual QA pass across both themes at 360px, 768px, and 1440px
- [x] Typography standardization: unified Archivo across all headings and body
- [x] WCAG AA contrast compliance for `--meta` sub-labels (`#a8a29e` / `#57534e`)
- [x] Title normalization: dynamic model, place, and pass formatting (`F-22 Raptor #07`)
- [x] Mobile header optimization: single compact bar (`h-14` / 56px) with 44×44px touch targets
- [x] Hero photo deduplication from `Featured works` wall
- [x] Detail view: structured spec table, 85vh object-contain framing, 340px sticky sidebar
- [x] Detail view: responsive breadcrumb (`← Back` on mobile, full path on desktop)
- [x] Main page: "Explore the full gallery" archive portal (`#full-gallery`) with collection covers and CTA
- [x] Theme toggle: event delegation on document + `astro:after-swap` persistence across View Transitions
- [x] Design polish pass: pills and the archive CTA rebuilt on the token set (zinc scale dropped), sentence-case role line and breadcrumb, no arrows appended to links, hero print separated by tone instead of a shadow, portal row length from the collection count, Archivo requested as `400..700` with the unused Fraunces dropped, hero badge states a place only when the library states one
- [x] Accent hover text on dark: measured 3.65:1 for `#d03a2b` on `#1a1815` (below AA for 13–15px text) — resolved with a derived `--accent-text` (`#e0604f`, 5.02:1) for text hovers; `--accent` stays on focus rings and the nav underline, where the 3:1 graphical-object threshold applies. Light theme `#b23225` on `#f6f3ee` is 5.62:1, so `--accent-text` there is just `var(--accent)`
- [x] Polish pass: dead CSS and unused tokens deleted, every literal folded into the token set, responsive block moved to the end of `global.css` with breakpoints unified to 640/1024, hero showcase made folder-driven (`Hero: N` sidecar) and its prints excluded from the featured wall, grid given srcset + intrinsic dimensions, prev/next within a series, header and footer held still across navigations, carousel pause control, skip link, "Back to gallery" capsule at the head of the series pill row, 404 page, docs resynced
- [x] Navigation polish: detail pages get an origin-aware back chip (`← Home` / `← Gallery` / `← Aircraft` / `← Previous print`) from `window.__fromUrl`, set by `Layout.astro` on `astro:before-swap` because referrer and history are empty under ClientRouter; chip is always visible on desktop (elevated with `z-index: 10` above Astro's view-transition overlay layers) and relabels the mobile `← [Series]` link; category-page breadcrumbs moved out of flow into the page-top padding band (`.collection .breadcrumb`, `top: calc(var(--page-top) - 2.4rem)`) so every collection page opens at the same level as `/collections/`; header flicker fixed by removing `transition:name` so only `data-header` keeps it persistent across navigations; hero zoom-out fixed by removing `transition:name` from slides (masonry tiles provide the forward morph); gallery origin no longer hides the desktop back chip.

## Phase 8 — Launch & Deployment
- [ ] Final owner acceptance test (dev server: `npm run dev`)
- [ ] OG image + social metadata (title, description, Twitter card)
- [ ] Domain configuration + deploy (GitHub Pages / Netlify / Cloudflare Pages)

## Later ideas (not scheduled)
- Favorites / print-order notes for buyers
- Contact form for commissions
- AVIF renditions if build time stays fast
