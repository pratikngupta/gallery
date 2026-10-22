// Generates every image rendition the site needs into public/renditions/,
// from the folder-driven photo scan (src/lib/photos.mjs). Runs before both
// `dev` and `build` (npm pre-hooks). Files whose original hasn't changed are
// skipped, so a re-run is cheap.
//
// Renditions per photo:
//   40    blur-up thumbnail in the grid
//   900   grid srcset (mobile/tablet)
//   1600  grid srcset (desktop) + category-index cover
//   2400  zoom popover
//   2560  hero (retina)

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { scanPhotos } from '../src/lib/photos.mjs';

const OUT = path.resolve(process.cwd(), 'public/renditions');
const WIDTHS = [40, 900, 1600, 2400, 2560];
const fileBase = (id) => id.replace(/\//g, '-');

const { photos } = await scanPhotos();
await fs.mkdir(OUT, { recursive: true });

let written = 0;
let skipped = 0;
for (const p of photos) {
  const file = path.resolve(process.cwd(), p.src);
  const stat = await fs.stat(file);
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${fileBase(p.id)}-${w}.webp`);
    try {
      const outStat = await fs.stat(out);
      if (outStat.mtimeMs >= stat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      // rendition missing — fall through and write it
    }
    await sharp(file)
      .webp({ quality: 80 })
      .resize({ width: w, withoutEnlargement: true })
      .toFile(out);
    written++;
  }
}

// Drop renditions for photos that no longer exist (renames/moves/deletes).
const keep = new Set(photos.flatMap((p) => WIDTHS.map((w) => `${fileBase(p.id)}-${w}.webp`)));
for (const f of await fs.readdir(OUT)) {
  if (!keep.has(f)) {
    await fs.rm(path.join(OUT, f), { force: true });
  }
}

console.log(`renditions: ${written} written, ${skipped} up to date (${photos.length} photos)`);
