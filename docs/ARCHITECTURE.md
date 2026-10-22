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
│   • filename → title; photo.txt sidecar → title override       │
│        │                                                       │
│        ▼   (npm predev / prebuild)                             │
│  scripts/build-renditions.mjs  ── sharp → public/renditions/   │
│   40w (blur-up thumb)  900w+1600w (grid srcset)                │
│   2400w (lightbox)     2560w (hero)         [webp q80]         │
│   incremental: skips originals whose rendition is newer;       │
│   prunes renditions of deleted photos                          │
│        │                                                       │
│        ▼                                                       │
│  src/pages/  ── index (hero + featured + index)                │
│   collections/index  (All, pill switcher)                      │
│   collections/[category]  (getStaticPaths from the scan)       │
│   each renders PhotoMasonry + Lightbox (manifest prop)         │
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
| `src/lib/photos.mjs` | The content model. Pure function: filesystem in → `{categories, photos, hero}` out. No Astro imports, no image processing. |
| `src/lib/render.mjs` | Page-assembly helpers: rendition URLs, masonry groups, lightbox manifests, the featured selection. |
| `scripts/build-renditions.mjs` | sharp-based rendition generator into `public/renditions/` (gitignored). Runs via npm `predev`/`prebuild`. |
| `src/styles/global.css` | All design tokens + component styles. Theme = CSS custom properties on `:root[data-theme]`. |
| `src/layouts/Layout.astro` | Head, theme pre-paint script, header/footer, site-wide JS (toggle, cue fade, index hover-develop, blur-up). |
| `src/components/CollectionView.astro` | Shared shell for all collection pages (title, pills, masonry, lightbox). |
| `src/components/Lightbox.astro` | Viewer dialog + its JS. Receives the manifest as a prop (Astro serializes it). |

## Image pipeline
- Why a script instead of `astro:assets`: Astro 7's `getImage` refuses raw file
  paths, and our photo set is discovered at build time, not imported. The sharp
  script keeps the pipeline explicit and incremental.
- Renditions are WebP q80 in `public/renditions/` (gitignored), so original
  JPEGs are never shipped and `dist/` stays static.
- Grid images load 40px blurred first, then upgrade to the 900/1600 srcset on
  load (capture-phase `load` listener — see KNOWN gotchas).
- The lightbox lazy-loads the 2400px rendition and preloads its two neighbors.
- Re-runs are cheap: a rendition is only rewritten when its original is newer.
  If the library ever exceeds ~500 photos, move originals off-repo and generate
  renditions in CI or on upload. Not a concern now.

## Theming
`data-theme="dark" | "light"` on `<html>`. A pre-paint inline script resolves it
from `localStorage` → `prefers-color-scheme` → dark default, so there is no flash.
The lightbox ignores the theme (always `#0e0d0b`).

## URLs
`/` home · `/collections/` all photos · `/collections/<category>` per series.
Photos are hash routes on the current page (`#photo/<id>`) handled by the
lightbox JS; deep links and the back button work.
Photo id = its path under `src/photos/` minus the extension
(e.g. `aircraft/f-16-falcon/f-16-falcon-1`).
`/collections` (no slash) is a meta-refresh stub pointing at `/collections/`.

## Why no CMS
Content is files. Git gives versioning, PR review, and free hosting. The cost
of a headless CMS (account, API keys, hosting bill, sync bugs) buys nothing
until there is a need for non-technical upload from a phone — if that day comes,
the `photos.mjs` boundary means swapping the scanner for a CMS fetch is one file.
