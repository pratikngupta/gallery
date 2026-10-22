# Your photographs live here

The site reads this folder at build time. Nothing else needs editing.

- **A folder = a category.** `birds/` appears in the index as "Birds".
  Make a new folder, add photos, rebuild — done.
- **A subfolder = a subcategory.** `aircraft/civil/` shows as a labeled
  sub-block inside Aircraft.
- **Covers:** name your best photo of a category with `main` in the file name
  (e.g. `main_heron.jpg`) — it becomes that category's image in the index.
- **Titles come from file names.** Underscores and hyphens become spaces.
  Aircraft models (`F-16`, `F-18`, `F-22`, `CMV-22`, `RCAF T-33`), places (`CN Tower`, `Big Sur`),
  and numbered sequences (`f_22_raptor_7.jpg` → "F-22 Raptor #07") normalize automatically.
  Rename the file or add a sidecar to retitle.
- **Camera settings** (camera, lens, aperture, shutter, ISO) are read
  automatically from each JPEG — nothing to type.
- **Overrides:** put a `dusk_formation.txt` next to a photo with a line
  `Title: Whatever you like` to override its caption.
- **Files directly in this folder** (no subfolder) count toward Field Notes.
- After adding or renaming files: `npm run build`.
