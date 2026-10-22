// Shared page-assembly helpers: rendition URLs, masonry groups, lightbox
// manifests, and the home-page "featured" selection.

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

// A category's photos as masonry blocks: subcategory blocks first, then the
// category's own loose photos.
export function groupsFor(c, byId) {
  if (!c.subcategories?.length) {
    return [{ label: null, photos: c.photos.map((p) => byId.get(p.id)) }];
  }
  const groups = c.subcategories.map((s) => ({
    label: s.name,
    photos: s.photos.map((p) => byId.get(p.id)),
  }));
  const loose = c.photos.filter((p) => !p.subcategory).map((p) => byId.get(p.id));
  if (loose.length) groups.push({ label: null, photos: loose });
  return groups;
}

// Home-page featured: every "main" photo first, then the category covers,
// then the rest of the library in scan order, until the cap. Capped so the
// home page stays short.
export function featuredFor(photos, categories, cap = 8) {
  const mains = photos.filter((p) => p.isMain);
  const seen = new Set(mains.map((p) => p.id));
  const picks = [...mains];
  const topUp = (p) => {
    if (picks.length >= cap || !p || seen.has(p.id)) return;
    seen.add(p.id);
    picks.push(p);
  };
  for (const c of categories) topUp(c.cover);
  for (const p of photos) topUp(p);
  return picks.slice(0, cap);
}
