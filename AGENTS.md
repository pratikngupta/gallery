# AGENTS.md — working agreement for AI agents in this repo

## What this project is
A static photography portfolio for Pratik Gupta. Home (hero → featured wall)
plus per-collection pages (`/collections/`,
`/collections/<category>` with a pill switcher) and per-photo detail pages
(`/photo/<id>`: metadata, related wall, native-popover zoom, origin-aware back chip). SPA-style
navigation via Astro View Transitions; page swaps are instant (navigation animation was
rejected by the owner — the only motion is the blur-up and the hero showcase).
No framework JS, no CMS, no server. Pages are kept short on purpose — the
owner rejected the single endless-scroll version.

## Non-negotiables
1. **The photographs are the interface.** No UI element may compete with the images. Grid tiles are clean prints — no cards, borders, or shadows; the only permitted chrome is an 8px tile radius (`--radius: 8px`) and a title-only hover scrim (owner-approved).
2. **Design system is fixed** (see `docs/KNOWLEDGE.md`). Tokens live in `src/styles/global.css`. `--font-heading` and `--font-body` are unified as Archivo; do not introduce new colors, fonts, or type treatments without updating the knowledge doc.
3. **Folder structure IS the content model.** Categories come from folders under `src/photos/`, subcategories from subfolders, covers from `main` in the filename. Nothing in the site hardcodes a category name. Adding photos = adding files. Never edit a config to add content.
4. **Zero required metadata.** EXIF is parsed from the file at build time (`exifr`). Titles fall back to
   the filename — or the containing folder when the filename is a camera default (`IMG_9092` → "Squirrel").
   A `photo.txt` sidecar is the only optional override.
5. **The accent (safelight red) is spent on state only**: active pill, hover, focus rings. Never as decoration.
6. **The zoom popover is always dark**, in both themes — it is the darkroom.

## Commands
```
npm run dev      # local dev server (regenerates renditions first)
npm run build    # production build (regenerates only missing/stale renditions)
npm run preview  # serve the production build
```

## Conventions
- Astro single-file components (`.astro`); vanilla JS in `<script>` tags. No React, no client frameworks.
- Image renditions are generated at build time via `scripts/build-renditions.mjs` using `sharp`, written to `public/renditions/`.
- Commit per phase or logical unit. Messages: imperative, one line, with the Co-Authored-By footer.
- Before changing layout/spacing/type: read the design plan in `docs/PLAN.md` and check the change against the "avoid" list there.
- Keep the site working with an empty `src/photos/` directory (graceful empty states).

## Definition of done for any change
- `npm run build` passes
- No horizontal scroll at 360px, 768px, and 1440px
- Keyboard: Tab reaches every interactive element; focus rings visible;
  the zoom popover opens/closes by click and is reachable without a mouse
- `prefers-reduced-motion` respected
- Both themes (dark + light) checked
