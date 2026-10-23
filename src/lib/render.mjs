// Shared page-assembly helpers: rendition URLs, the home hero showcase, the
// featured selection, and prev/next within a series.

import { prettyKey } from './photos.mjs';

const R = (p, w) => `/renditions/${p.id.replace(/\//g, '-')}-${w}.webp`;

export function withUrls(p) {
  return {
    ...p,
    thumb: R(p, 40),
    gridSrc: R(p, 1600),
    gridSrcset: `${R(p, 900)} 900w, ${R(p, 1600)} 1600w`,
    full: R(p, 2400),
  };
}

export const exifLine = (ex) =>
  ex ? [ex.lens, ex.focal, ex.aperture, ex.shutter, ex.iso].filter(Boolean) : [];

// The hero showcase is decided by the library, not by the code: a `Hero: 1`
// line in a photo.txt sidecar puts that print in the showcase, in that order.
// With no sidecars, the showcase is each collection's cover, in collection
// order — the same covers the archive portal shows. Capped so the home page
// stays short.
export function heroSlidesFor(photos, categories) {
  const curated = photos
    .filter((p) => Number.isFinite(p.heroRank))
    .sort((a, b) => a.heroRank - b.heroRank);

  const candidates = curated.length
    ? curated
    : [...categories.map((c) => c.cover), ...photos.filter((p) => p.isMain)].filter(Boolean);

  const seen = new Set();
  const picked = [];
  for (const p of candidates) {
    if (picked.length >= 6 || seen.has(p.id)) continue;
    seen.add(p.id);
    picked.push(p);
  }

  // Graceful fallback for a sparse library.
  if (picked.length === 0) picked.push(...photos.slice(0, 4));

  return picked.map((p) => ({
    id: p.id,
    title: p.title,
    // A place only when the library states one; the folder is always known.
    location: p.location,
    series: prettyKey(p.subcategory || p.category.replace(/-/g, ' ')),
    src: R(p, 1600),
    srcset: `${R(p, 900)} 900w, ${R(p, 1600)} 1600w, ${R(p, 2560)} 2560w`,
    href: `/photo/${p.id}`,
    alt: p.title,
    width: p.width,
    height: p.height,
  }));
}

// Home-page featured: every "main" photo first, then the collection covers,
// then the rest of the library in scan order. Hero prints are left out so the
// wall never repeats what the showcase is already showing.
export function featuredFor(photos, categories, cap = 9, excludeIds = []) {
  const exclude = new Set(excludeIds);
  const seen = new Set(exclude);
  const picks = [];
  const add = (p) => {
    if (picks.length >= cap || !p || seen.has(p.id)) return;
    seen.add(p.id);
    picks.push(p);
  };
  for (const p of photos) if (p.isMain) add(p);
  for (const c of categories) add(c.cover);
  for (const p of photos) add(p);
  return picks;
}

// Prev/next within the same series, in the order the wall renders them (scan
// order), so "4 of 9" is the print the viewer just scrolled past.
export function seriesNeighbours(photo, photos) {
  const series = photos.filter(
    (p) => p.category === photo.category && (p.subcategory || null) === (photo.subcategory || null)
  );
  const index = series.findIndex((p) => p.id === photo.id);
  return {
    index,
    total: series.length,
    prev: index > 0 ? series[index - 1] : null,
    next: index >= 0 && index < series.length - 1 ? series[index + 1] : null,
  };
}
