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

export function toManifest(photos) {
  return photos.map((p) => ({
    id: p.id,
    title: p.title,
    full: p.full,
    exif: p.exif
      ? [p.exif.camera, p.exif.lens, p.exif.focal, p.exif.aperture, p.exif.shutter, p.exif.iso].filter(Boolean)
      : [],
  }));
}

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

// Home-page featured: every "main" photo first, topped up with the covers of
// categories that have no "main" yet. Capped so the home page stays short.
export function featuredFor(photos, categories, cap = 8) {
  const mains = photos.filter((p) => p.isMain);
  const seen = new Set(mains.map((p) => p.id));
  const picks = [...mains];
  for (const c of categories) {
    if (picks.length >= cap) break;
    if (c.cover && !seen.has(c.cover.id)) {
      seen.add(c.cover.id);
      picks.push(c.cover);
    }
  }
  return picks.slice(0, cap);
}
