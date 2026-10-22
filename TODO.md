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
- [x] Blur-up loading (40px → 900/1600 srcset), noscript fallback

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

## Phase 8 — Launch & Deployment
- [ ] Final owner acceptance test (dev server: `npm run dev`)
- [ ] OG image + social metadata (title, description, Twitter card)
- [ ] Domain configuration + deploy (GitHub Pages / Netlify / Cloudflare Pages)

## Later ideas (not scheduled)
- Favorites / print-order notes for buyers
- Contact form for commissions
- AVIF renditions if build time stays fast
