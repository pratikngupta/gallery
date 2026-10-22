// The content model. Pure filesystem → data, no Astro imports.
//
//   folder          → category
//   subfolder       → subcategory
//   "main" in name  → category cover
//   filename        → title
//   the JPEG itself → EXIF (via exifr)
//
// Everything the site shows is derived here; nothing hardcodes a category.

import fs from 'node:fs/promises';
import path from 'node:path';
import exifr from 'exifr';

// Resolved from the project root, not import.meta.url: Vite bundles this
// module for the page build and rewrites import.meta.url, which would send
// the scanner looking in the wrong place. Astro always runs from the root.
export const PHOTOS_DIR = path.resolve(process.cwd(), 'src/photos');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const CATCH_ALL = 'field-notes';

async function imageFiles(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return []; // dir does not exist yet → empty library, not an error
  }
  const out = [];
  for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await imageFiles(full)));
    } else if (IMAGE_EXT.has(path.extname(e.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function titleFromName(name) {
  // Underscores separate words; hyphens and spaces stay as-is ("F-16",
  // "squirrel-eating-2" keep their character, "f_16_falcon" gets spaces).
  return name
    .replace(/_+/g, ' ')
    .replace(/\bmain\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function prettyKey(key) {
  // Folder names are often already nicely cased ("F-18 Hornet") — keep that.
  // Only tidy names that are fully lowercase ("northern cardinal").
  if (/[A-Z]/.test(key)) return key;
  return key
    .split(/[\s\-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// A category (or subcategory) folder may carry a one-line description.txt.
async function readDescription(dir) {
  try {
    const t = (await fs.readFile(path.join(dir, 'description.txt'), 'utf8')).trim();
    return t.split('\n')[0] || null;
  } catch {
    return null;
  }
}

function inferLocation(id, title, category, subcategory) {
  const text = `${id} ${title} ${category} ${subcategory || ''}`.toLowerCase();
  if (text.includes('cn-tower') || text.includes('toronto')) return 'Toronto, Canada';
  if (text.includes('chicago')) return 'Chicago, USA';
  if (text.includes('yosemite')) return 'Yosemite National Park, USA';
  if (text.includes('port-stanley') || text.includes('port stanley')) return 'Port Stanley, Canada';
  if (text.includes('big-surf') || text.includes('big sur')) return 'Big Sur, USA';
  if (text.includes('raptor') || text.includes('falcon') || text.includes('hornet') || text.includes('osprey') || text.includes('t33') || text.includes('aircraft')) return 'Toronto Air Show';
  if (text.includes('seagull') || text.includes('goat') || text.includes('chipmunk') || text.includes('squirrel') || text.includes('wildlife')) return 'Ontario, Canada';
  return 'Toronto, Canada';
}

// EXIF + optional sidecar override. A bad file must never kill the build.
async function readMeta(file, title) {
  const meta = { title, isMain: /\bmain\b/i.test(path.basename(file)), exif: null, location: null };

  try {
    const sidecar = await fs.readFile(file + '.txt', 'utf8');
    const m = sidecar.match(/title:\s*(.+)/i);
    if (m) meta.title = m[1].trim();
    const n = sidecar.match(/note:\s*(.+)/i);
    if (n) meta.note = n[1].trim();
    const l = sidecar.match(/location:\s*(.+)/i);
    if (l) meta.location = l[1].trim();
  } catch {
    // no sidecar — fine
  }

  try {
    const ex = await exifr.parse(file, {
      pick: ['Make', 'Model', 'LensModel', 'FNumber', 'ExposureTime', 'FocalLength', 'ISO', 'DateTimeOriginal'],
    });
    if (ex) {
      const exif = {};
      if (ex.Make || ex.Model) exif.camera = [ex.Make, ex.Model].filter(Boolean).join(' ');
      if (ex.LensModel) exif.lens = ex.LensModel;
      if (ex.FocalLength) {
        const f = Array.isArray(ex.FocalLength) ? ex.FocalLength[0] : ex.FocalLength;
        exif.focal = `${Math.round(f)}mm`;
      }
      if (ex.FNumber) exif.aperture = `ƒ/${ex.FNumber}`;
      if (ex.ExposureTime) exif.shutter = ex.ExposureTime >= 1 ? `${ex.ExposureTime}s` : `1/${Math.round(1 / ex.ExposureTime)}`;
      if (ex.ISO && ex.ISO !== 0) exif.iso = `ISO ${ex.ISO}`;
      if (ex.DateTimeOriginal) exif.date = new Date(ex.DateTimeOriginal);
      meta.exif = Object.keys(exif).length ? exif : null;
    }
  } catch {
    // container exifr can't read (HEIC etc.) — title-only it is
  }
  return meta;
}

export async function scanPhotos() {
  const files = await imageFiles(PHOTOS_DIR);
  const photos = [];

  for (const file of files) {
    const rel = path.relative(PHOTOS_DIR, file);
    const segments = rel.split(path.sep);
    const base = path.basename(file, path.extname(file));
    const atRoot = segments.length === 1;
    const category = atRoot ? CATCH_ALL : segments[0];
    const subcategory = segments.length > 2 ? segments[1] : null;

    const meta = await readMeta(file, titleFromName(base));
    const st = await fs.stat(file);
    const year = meta.exif?.date ? meta.exif.date.getFullYear() : st.mtime.getFullYear();
    const location = meta.location || inferLocation(rel, meta.title, category, subcategory);

    photos.push({
      id: rel.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9/_-]/g, '-'),
      src: path.relative(process.cwd(), file).split(path.sep).join('/'), // for the rendition script
      title: meta.title,
      note: meta.note,
      location,
      category,
      subcategory,
      atRoot,
      isMain: meta.isMain,
      year,
      exif: meta.exif,
    });
  }

  const byCat = new Map();
  for (const p of photos) {
    if (!byCat.has(p.category)) {
      byCat.set(p.category, {
        key: p.category,
        name: prettyKey(p.category),
        photos: [],
        subs: new Map(),
      });
    }
    const c = byCat.get(p.category);
    c.photos.push(p);
    if (p.subcategory) {
      if (!c.subs.has(p.subcategory)) {
        c.subs.set(p.subcategory, { key: p.subcategory, name: prettyKey(p.subcategory), photos: [] });
      }
      c.subs.get(p.subcategory).photos.push(p);
    }
  }

  const categories = [...byCat.values()].sort(
    (a, b) =>
      (a.key === CATCH_ALL ? 1 : 0) - (b.key === CATCH_ALL ? 1 : 0) ||
      a.name.localeCompare(b.name)
  );

  for (const c of categories) {
    c.subcategories = [...c.subs.values()].sort((a, b) => a.name.localeCompare(b.name));
    c.subs = undefined;
    // Cover: a root "main" first, then any "main", then the first photo.
    c.cover =
      c.photos.find((p) => !p.subcategory && p.isMain) ??
      c.photos.find((p) => p.isMain) ??
      c.photos[0];
    c.count = c.photos.length;
  }

  // One-line descriptions, if the folders carry them (root files have no dir).
  await Promise.all(
    categories.map(async (c) => {
      c.description = c.key === CATCH_ALL && !byCat.has(c.key)
        ? null
        : await readDescription(path.join(PHOTOS_DIR, c.key));
      for (const s of c.subcategories) {
        s.description = await readDescription(path.join(PHOTOS_DIR, c.key, s.key));
      }
    })
  );

  // Hero: a root-level "main" wins, else the first category cover that is a "main".
  const hero =
    photos.find((p) => p.atRoot && p.isMain) ??
    categories.find((c) => c.cover?.isMain)?.cover ??
    photos[0];

  return { categories, photos, hero, empty: photos.length === 0 };
}
