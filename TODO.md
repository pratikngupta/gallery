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
- [x] Lightbox: EXIF line, ←/→/Esc, swipe, focus trap, `#photo/` deep links

## Phase 5 — Real photos ✅
- [x] Library copied from ~/Pictures/photos (56 photos, 4 categories)
- [x] Production build passes (6 pages)

## Phase 6 — Owner QA & launch
- [ ] Owner tests the site (dev server: `npm run dev`)
- [ ] Pick the hero photo (`main_*.jpg` at src/photos root to force it)
- [ ] Mark one `main` cover per category (aircraft and wildlife have none yet)
- [ ] Caption cleanup: rename raw camera filenames or add `photo.txt` sidecars
- [ ] Visual QA pass, both themes, 360/768/1440px
- [ ] Lighthouse performance pass (image sizes, LCP hero)
- [ ] Accessibility audit (screen-reader pass over grid + lightbox)
- [ ] OG image + site metadata (title, description, social card)
- [ ] Domain + deploy (GitHub Pages / Netlify / Cloudflare Pages)

## Later ideas (not scheduled)
- Per-category pages with their own URLs
- Favorites / print-order notes for buyers
- Contact form for commissions
- AVIF renditions if build time stays fast
