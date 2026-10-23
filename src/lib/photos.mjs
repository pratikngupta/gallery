// The content model. Pure filesystem → data, no Astro imports.
//
//   folder          → category
//   subfolder       → subcategory
//   "featured" in name → category cover
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
  let s = name
    .replace(/\bcoverart\b/gi, ' ')
    .replace(/\bcover\b/gi, ' ')
    .replace(/\bfeatured\b/gi, ' ')
    .trim();

  // Replace underscores and hyphens with spaces
  s = s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

  // Standardize known models, acronyms, and places
  s = s
    .replace(/\bf\s*16\b/gi, 'F-16')
    .replace(/\bf\s*18\b/gi, 'F-18')
    .replace(/\bf\s*22\b/gi, 'F-22')
    .replace(/\bcmv\s*22\b/gi, 'CMV-22')
    .replace(/\brca\s*f\s*t\s*33\b/gi, 'RCAF T-33')
    .replace(/\bcn\s*tower\b/gi, 'CN Tower')
    .replace(/\bbig\s*surf?\b/gi, 'Big Sur')
    .replace(/\bcostline\b/gi, 'Coastline');

  const words = s.split(' ').map((word) => {
    if (/^[Ff]-\d+/.test(word) || (/^[A-Z0-9-]+$/.test(word) && word.length > 1 && !/^\d+$/.test(word))) {
      return word.toUpperCase();
    }
    if (/^#\d+/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  if (words.length > 1) {
    const last = words[words.length - 1];
    if (/^\d+$/.test(last)) {
      const num = last.length < 2 ? last.padStart(2, '0') : last;
      words[words.length - 1] = `#${num}`;
    }
  }

  return words.join(' ');
}

export function slug(str) {
  // One shape for ids, data attributes, and filter keys.
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export function prettyKey(key) {
  // Folder names are often already nicely cased ("F-18 Hornet") — keep that.
  // Only tidy names that are fully lowercase ("northern cardinal").
  if (/[A-Z]/.test(key)) return key;
  return key
    .split(/[\s\-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Rendition dimensions, written by scripts/build-renditions.mjs, so every
// <img> can carry width/height and the wall reserves its space before a print
// arrives. No manifest (e.g. `astro build` without the prebuild) just means no
// dimensions — the page still renders.
async function readDimensions() {
  try {
    const manifest = JSON.parse(
      await fs.readFile(path.resolve(process.cwd(), 'public/renditions/manifest.json'), 'utf8')
    );
    return new Map(manifest.map((d) => [d.id, d]));
  } catch {
    return new Map();
  }
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
  // Only names that are literally in a folder or a filename count. A jet is
  // not evidence of an air show, so this returns nothing rather than a
  // plausible guess — the badge would otherwise state a place as fact.
  return null;
}

// EXIF + optional sidecar override. A bad file must never kill the build.
async function readMeta(file, title) {
  const meta = {
    title,
    isFeatured: /\bfeatured\b/i.test(path.basename(file)),
    isHero: /\bhero\b/i.test(path.basename(file)),
    exif: null,
    location: null,
  };

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
      if (ex.Make || ex.Model) {
        const m = (ex.Model || '').trim();
        const make = (ex.Make || '').trim();
        exif.camera = m.toLowerCase().startsWith(make.toLowerCase()) ? m : [make, m].filter(Boolean).join(' ');
      }
      if (ex.LensModel) exif.lens = ex.LensModel;
      if (ex.FocalLength) {
        const f = Array.isArray(ex.FocalLength) ? ex.FocalLength[0] : ex.FocalLength;
        exif.focal = `${Math.round(f)}mm`;
      }
      if (ex.FNumber) exif.aperture = `ƒ/${ex.FNumber}`;
      if (ex.ExposureTime) exif.shutter = ex.ExposureTime >= 1 ? `${ex.ExposureTime}s` : `1/${Math.round(1 / ex.ExposureTime)}s`;
      if (ex.ISO && ex.ISO !== 0) exif.iso = `ISO ${ex.ISO}`;
      if (ex.DateTimeOriginal) exif.date = new Date(ex.DateTimeOriginal);
      meta.exif = Object.keys(exif).length ? exif : null;
    }
  } catch {
    // container exifr can't read (HEIC etc.) — title-only it is
  }
  return meta;
}

// getStaticPaths and every page render call this, so without a cache a build
// parses the EXIF of every photograph 57 times. The cache is keyed on the
// library's actual signature — every image path plus its mtime, plus any
// sidecar — so dropping a new photo in dev is picked up on the next page load.
let cache = null;
let cacheSignature = null;
let building = null;

async function librarySignature(files) {
  const parts = [];
  for (const file of files) {
    const st = await fs.stat(file);
    parts.push(`${file}:${st.mtimeMs}`);
    try {
      parts.push(`${file}.txt:${(await fs.stat(file + '.txt')).mtimeMs}`);
    } catch {
      // no sidecar
    }
  }
  return parts.join('|');
}

export async function scanPhotos() {
  const files = await imageFiles(PHOTOS_DIR);
  const signature = await librarySignature(files);

  // Callers arrive together — getStaticPaths, then every page render — so the
  // scan in flight is awaited rather than started again for each of them.
  if (signature === cacheSignature) return cache ?? await building;

  cacheSignature = signature;
  building = scanLibrary(files);
  cache = await building;
  building = null;
  return cache;
}

async function scanLibrary(files) {
  const dimensions = await readDimensions();
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

    const id = rel.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9/_-]/g, '-');
    const dims = dimensions.get(id);
    photos.push({
      id,
      src: path.relative(process.cwd(), file).split(path.sep).join('/'), // for the rendition script
      title: meta.title,
      note: meta.note,
      location,
      category,
      subcategory,
      atRoot,
      isFeatured: meta.isFeatured,
      isHero: meta.isHero,
      year,
      exif: meta.exif,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
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
    // Cover: a root "featured" first, then any "featured", then the first photo.
    c.cover =
      c.photos.find((p) => !p.subcategory && p.isFeatured) ??
      c.photos.find((p) => p.isFeatured) ??
      c.photos[0];
    c.count = c.photos.length;
  }

  // One-line descriptions, if the folders carry them (root files have no dir).
  await Promise.all(
    categories.map(async (c) => {
      // Root-level photographs have no folder, so there is nothing to read.
      c.description = c.key === CATCH_ALL ? null : await readDescription(path.join(PHOTOS_DIR, c.key));
      for (const s of c.subcategories) {
        s.description = await readDescription(path.join(PHOTOS_DIR, c.key, s.key));
      }
    })
  );

  return { categories, photos, empty: photos.length === 0 };
}
