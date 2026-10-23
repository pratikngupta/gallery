# Architecture

Static site. Astro builds it; any static host serves it. There is no runtime
server, no database, and no client framework.

```
┌────────────────────────── build time ──────────────────────────┐
│                                                                │
│  src/photos/ (your images, in folders)                         │
│        │                                                       │
│        ▼                                                       │
│  src/lib/photos.mjs  ── walks src/photos, builds the           │
│   • folder → category / subcategory tree                       │
│   • "main" in filename → category cover                        │
│   • description.txt → section subtitle                         │
│   • exifr → EXIF (camera, lens, ƒ, shutter, ISO, date)         │
│   • filename → title; photo.txt sidecar → title, note,         │
│     location, `Hero: N` (the showcase order)                   │
│   • memoized on a path:ctime signature; concurrent callers     │
│     share the scan in flight, so EXIF is parsed once per build │
│        │                                                       │
│        ▼   (npm predev / prebuild)                             │
│  scripts/build-renditions.mjs  ── sharp → public/renditions/   │
│   40w (blur-up thumb)  900w+1600w (grid)                       │
│   2400w (zoom)         2560w (hero)         [webp q80]         │
│   + manifest.json — intrinsic width/height for every photo     │
│   incremental: skips originals whose rendition is newer;       │
│   prunes renditions of deleted photos                          │
│        │                                                       │
│        ▼                                                       │
│  src/pages/  ── index, collections, photo detail, 404          │
│   collections/index  (All, pill switcher)                      │
│   collections/[category]  (getStaticPaths from the scan)       │
│   photo/[...id]  (spec table, prev/next, related wall, zoom)   │
│   404.astro  (missing pages)                                   │
│   grids render PhotoMasonry; tiles link to /photo/<id> with    │
│   transition:name for the shared-element view transition       │
│        │                                                       │
│        ▼                                                       │
│  dist/  (html + public/renditions + vendored js/css)           │
└────────────────────────────────────────────────────────────────┘
                         │
                         ▼  any static host
              GitHub Pages / Netlify / Cloudflare Pages
```

## Key files
| File | Job |
|---|---|
| `src/lib/photos.mjs` | The content model. Filesystem in → `{categories, photos, empty}` out, memoized on a `path:ctime` signature of the images and their sidecars. Normalizes titles, models, and numbers (`F-22 Raptor #07`). No Astro imports, no image processing. |
| `src/lib/render.mjs` | Page-assembly helpers: `withUrls` (rendition URLs), `exifLine`, `heroSlidesFor` (the showcase, decided by the folders), `featuredFor` (the home wall, hero prints excluded), `seriesNeighbours` (prev/next within a series). |
| `scripts/build-renditions.mjs` | sharp-based rendition generator into `public/renditions/` (gitignored). Runs via npm `predev`/`prebuild`. |
| `src/styles/global.css` | All design tokens (`--radius: 8px;`, `--font-heading: Archivo`) + component and responsive styles. Theme = CSS custom properties on `:root[data-theme]`. |
| `src/layouts/Layout.astro` | Head, pre-paint inline theme script, header/footer, site-wide JS (event-delegated theme toggle, `astro:after-swap` theme sync, blur-up) and the origin trail: `astro:before-swap` records the page the navigation came from on `window.__fromUrl`, since ClientRouter keeps one document and referrer/history never record an in-site hop. The header carries only `data-header` (no `transition:name`) to stay persistent across navigations without flashing. |
| `src/components/Hero.astro` | The showcase carousel: slides are `inert` when hidden, and the Pause/Resume control in the hero bar is the keyboard-reachable stop for the 5s auto-advance. |
| `src/components/CollectionView.astro` | Shared shell for all collection pages (breadcrumb, dynamic subcategory chips, masonry) and the series filter JS it drives. |
| `src/components/PillNav.astro` | The switcher: category pills on `/collections/`, series-filter buttons on a category page, and the "Back to gallery" capsule at the head of that row. |
| `src/components/PhotoMasonry.astro` | The grid: tiles take a flat `photos` array, each carrying `src`/`data-srcset`/`sizes`/`width`/`height` and a `transition:name`. |
| `src/pages/photo/[...id].astro` | Per-photo page: 85vh image, an origin-aware back chip (`← Home` / `← Gallery` / `← Aircraft` / `← Previous print`, from `window.__fromUrl`, styled as a capsule, visible on desktop and mobile, falling back to the print's series page) ahead of the breadcrumb path, sticky metadata sidebar with structured spec table, prev/next within the series, related wall, native-popover zoom. |
| `src/pages/404.astro` | Built as `dist/404.html`: dev and preview serve it for any unmatched URL, and GitHub Pages / Netlify / Cloudflare serve the same file for 404s. One sentence and the two ways back. |

## Image pipeline
- Why a script instead of `astro:assets`: Astro 7's `getImage` refuses raw file
  paths, and our photo set is discovered at build time, not imported. The sharp
  script keeps the pipeline explicit and incremental.
- Renditions are WebP q80 in `public/renditions/` (gitignored), so original
  JPEGs are never shipped and `dist/` stays static.
- Grid tiles ship a 40px `src` plus `data-srcset` (900w/1600w) and `sizes`. The
  Layout upgrade step promotes the srcset and touches `src`, which is what
  guarantees the second load event that ends the blur (capture-phase `load`
  listener on `document` + a startup sweep — see gotchas). The placeholder blur
  is gated on `[data-js]`, so a JS-off browser never shows a blurred tile.
- `public/renditions/manifest.json` carries every photo's intrinsic width and
  height, so each `<img>` reserves its own space and the wall cannot reflow as
  prints develop. If the manifest is missing, `readDimensions()` returns an
  empty map and the build still succeeds.
- The zoom popover loads the 2400px rendition on demand.
- Re-runs are cheap: a rendition is only rewritten when its original is newer.
  If the library ever exceeds ~500 photos, move originals off-repo and generate
  renditions in CI or on upload. Not a concern now.

## Theming
`data-theme="dark" | "light"` on `<html>`. A pre-paint inline script in `<head>` resolves it
from `localStorage` → `prefers-color-scheme` → dark default without flash, and hooks
`astro:after-swap` so client-side navigation never resets the theme.
Click interaction is handled via document-level event delegation so theme switching
persists reliably across all Astro View Transitions. The same head script sets
`data-js`, the switch the stylesheet reads for the blur-up placeholder. The zoom
popover ignores the theme — it is always the darkroom
(`color-mix(in srgb, var(--darkroom) 94%, transparent)`).

## URLs
`/` home · `/collections/` all photos · `/collections/<category>` per series ·
`/photo/<id>` per photograph (64 pages built, including the 404).
Photo id = its path under `src/photos/` minus the extension
(e.g. `/photo/aircraft/f-16-falcon/f-16-falcon-1`); the route is a rest param
(`[...id]`) because ids contain slashes.
`/collections` (no slash) resolves to the same directory index on static
hosts; the old meta-refresh stub page was deleted because it collided with
the index route (Astro warns and skips duplicate routes).
Navigation is SPA-style via `ClientRouter` (Astro View Transitions, on by
default in Astro 7); direct URLs still work fully static.

## Why no CMS
Content is files. Git gives versioning, PR review, and free hosting. The cost
of a headless CMS (account, API keys, hosting bill, sync bugs) buys nothing
until there is a need for non-technical upload from a phone — if that day comes,
the `photos.mjs` boundary means swapping the scanner for a CMS fetch is one file.
