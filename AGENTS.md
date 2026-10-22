# AGENTS.md — working agreement for AI agents in this repo

## What this project is
A static photography portfolio for Pratik Gupta. Home (hero → featured wall →
category index) plus per-collection pages (`/collections/`,
`/collections/<category>`) with a pill switcher and a full-page lightbox.
No framework JS, no CMS, no server. Pages are kept short on purpose — the
owner rejected the single endless-scroll version.

## Non-negotiables
1. **The photographs are the interface.** No UI element may compete with the images. No cards, borders, shadows, or rounded corners on photos.
2. **Design system is fixed** (see `docs/KNOWLEDGE.md`). Tokens live in `src/styles/global.css`. Do not introduce new colors, fonts, or type treatments without updating the knowledge doc.
3. **Folder structure IS the content model.** Categories come from folders under `src/photos/`, subcategories from subfolders, covers from `main` in the filename. Nothing in the site hardcodes a category name. Adding photos = adding files. Never edit a config to add content.
4. **Zero required metadata.** EXIF is parsed from the file at build time (`exifr`). Titles fall back to the filename. A `photo.txt` sidecar is the only optional override.
5. **The accent (safelight red) is spent on state only**: active category row, hover, focus rings. Never as decoration.
6. **The lightbox is always dark**, in both themes — it is the darkroom.

## Commands
```
npm run dev      # local dev server (regenerates renditions first)
npm run build    # production build (regenerates only missing/stale renditions)
npm run preview  # serve the production build
```

## Conventions
- Astro single-file components (`.astro`); vanilla JS in `<script>` tags. No React, no client frameworks.
- Image renditions are generated at build time via `astro:assets` (`getImage`). Never commit generated renditions; they live in `dist/`.
- Commit per phase or logical unit. Messages: imperative, one line, with the Co-Authored-By footer.
- Before changing layout/spacing/type: read the design plan in `docs/PLAN.md` and check the change against the "avoid" list there.
- Keep the site working with an empty `src/photos/` directory (graceful empty states).

## Definition of done for any change
- `npm run build` passes
- No horizontal scroll at 360px, 768px, and 1440px
- Keyboard: Tab reaches every interactive element; focus rings visible; Esc closes the lightbox; ←/→ navigate
- `prefers-reduced-motion` respected
- Both themes (dark + light) checked
