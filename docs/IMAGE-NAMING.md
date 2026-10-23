# Image Naming Conventions

This document describes how photo files are named, structured, and processed by the website. The system is **folder-driven** — no configuration is needed to add content. You add files, run `npm run build`, and the site updates.

---

## Folder Structure

```
src/photos/
├── aircraft/            ← category: "Aircraft"
│   ├── f_16_falcon.jpg
│   ├── F-16 Falcon/     ← subcategory (optional)
│   │   ├── f_16_falcon_1.jpg
│   │   └── f_16_falcon_2.jpg
│   └── F-18 Hornet/
├── buildings/           ← category: "Buildings"
│   └── modern/
│       └── cn-tower-main.jpg   ← main = category cover
├── landscape/           ← category: "Landscape"
│   ├── coastal/
│   │   └── toronto-skyline-main.jpeg
│   └── mountains/
│       └── yosemite-main.jpeg
├── wildlife/            ← category: "Wildlife"
│   ├── seagulls/
│   │   └── seagulls-flying-1.jpg
│   └── northern-cardinal/
│       └── cover-bird.jpg
└── f_22_raptor_7.jpg    ← root = "Field Notes" category
```

### Rules

| Rule | Detail |
|------|--------|
| **Category = folder name** | The folder name becomes the category slug and display name. Case is preserved. |
| **Subcategory = subfolder** | Any subfolder becomes a subcategory filter on the category page. |
| **Root files = Field Notes** | Photos placed directly in `src/photos/` land in the "field-notes" category. |
| **No config** | Adding or removing folders/changes the site automatically. Never edit code to add content. |

---

## "Main" Photo — Category Cover

A photo with **`main` in the filename** becomes its category's cover. The scanner picks the cover for each category by this priority:

1. Root-level photo in the category folder with `main` in the name (e.g. `f_16_falcon.jpg` in `aircraft/`)
2. Any photo with `main` in the name (from subfolders)
3. **First photo** in scan order (alphabetical path order)

### Naming patterns that match `main`:

```
cn-tower-main.jpg         ✅
toronto-skyline-main.jpg  ✅
main-tower.jpg            ✅
tower-main-view.jpg       ✅
```

### Naming patterns that do NOT match:

```
cn-tower-captain.jpg      ❌ ("main" is a substring of "captain", not a standalone word)
```

> **Note:** The check is `\bmain\b` — a standalone word "main" bounded by word characters. `my-main-character.jpg` DOES match because `main` is surrounded by hyphens (which are word-boundary characters).

---

## Homepage Selection Logic

The homepage has three photo-driven sections. Here's exactly how photos are chosen for each.

### 1. Hero Carousel (top showcase)

**Priority 1: Sidecar ranking**
If any photo has `hero: N` in its `.txt` sidecar, those photos fill the hero in that order. Capped at 6 slides.

**Priority 2: Default (no `hero:` sidecars)**
- One cover photo per category (see "Main Photo" section above)
- Then any additional photos with `main` in the filename (in scan order)
- Capped at 6 total

### 2. Featured Works Wall (9 tiles below the hero)

**Selection order:**
1. Every photo with `main` in the filename — one per category (these are the "main" covers)
2. Category covers (the same photos if no other "main" exists)
3. Remaining photos in scan order (alphabetical folder/file order)

**Excludes:** Any photo already shown in the hero carousel.

**Capped at 9.**

> **Tip:** If a category has only `*-main.jpg` in a subfolder (not at the category root), that photo may appear in the featured wall as a "main" photo AND again as a category cover. The deduplication only removes exact duplicates, so a subfolder "main" and a root cover can both appear.

### 3. Gallery Portal Cards ("Explore the full gallery")

One cover per category card, chosen by the same priority as the category cover (see "Main Photo" above):

1. Root-level `*-main.jpg` in the category folder
2. Any `*-main.jpg` from subfolders
3. First photo in scan order

> These are **always** chosen by the file system — never affected by `hero:` ranks.

---

## Title Generation

The filename (without extension) is automatically converted into a display title. This happens in `src/lib/photos.mjs`:

### Step 1: Strip cover tags
The words `coverart`, `cover`, `main` are removed from the filename.

```
cover-bird.jpg → "bird"
cn-tower-main.jpg → "cn-tower"
```

### Step 2: Normalize separators
Underscores and hyphens become spaces, multiple spaces collapse.

```
cn-tower → "cn tower"
f_16_falcon_1 → "f 16 falcon 1"
```

### Step 3: Standardize known models, acronyms, and places

| Pattern | Becomes |
|---------|---------|
| `f\s*16` | `F-16` |
| `f\s*18` | `F-18` |
| `f\s*22` | `F-22` |
| `cmv\s*22` | `CMV-22` |
| `rca\s*f\s*t\s*33` | `RCAF T-33` |
| `cn\s*tower` | `CN Tower` |
| `big\s*surf?` | `Big Sur` |
| `costline` | `Coastline` |

### Step 4: Capitalization
- Alphanumeric strings longer than 1 character stay uppercase (`F-16`, `CMV-22`)
- All other words are title-cased
- Trailing numbers become `#01`, `#02`, etc.

### Examples:

| Filename | Display Title |
|----------|---------------|
| `f_16_falcon_1.jpg` | `F-16 Falcon #01` |
| `f_16_falcon_2.jpg` | `F-16 Falcon #02` |
| `f_16_falcon.jpg` | `F-16 Falcon` |
| `cn-tower-main.jpg` | `CN Tower` |
| `yosemite-main.jpeg` | `Yosemite` |
| `seagulls-flying-1.jpg` | `Seagulls Flying #01` |
| `cover-bird.jpg` | `Bird` |
| `toronto-skyline-main.jpeg` | `Toronto Skyline` |
| `f_22_raptor_7.jpg` | `F-22 Raptor #07` |
| `chicago-John-Hancock-Center.jpeg` | `Chicago John Hancock Center` |

### Override with sidecar

Add a `filename.jpg.txt` next to the photo:

```
title: Toronto Skyline & CN Tower
location: Toronto, Canada
note: Evening light over Lake Ontario
hero: 1
```

| Field | Effect |
|-------|--------|
| `title:` | Overrides the auto-generated title |
| `location:` | Sets the place shown on the hero badge |
| `note:` | Added to the photo detail page as a blurb |
| `hero: N` | Ranks the photo in the homepage hero carousel. `1` = first slide, `2` = second, etc. Capped at 6 slides total. Only active when sidecars exist — without any `hero:` sidecars, the hero falls back to category covers. |

---

## Image IDs and URLs

Each photo gets a canonical ID from its filesystem path:

1. Relative path from `src/photos/`
2. Lowercased
3. File extension removed
4. Non-`a-z0-9/_-` characters replaced with `-`

| Path | ID |
|------|----|
| `src/photos/buildings/modern/cn-tower-main.jpg` | `buildings/modern/cn-tower-main` |
| `src/photos/aircraft/F-16 Falcon/f_16_falcon_1.jpg` | `aircraft/f-16-falcon/f-16-falcon-1` |
| `src/photos/landscape/mountains/yosemite-main.jpeg` | `landscape/mountains/yosemite-main` |

The photo detail page URL is `/photo/<id>/`:

- `/photo/buildings/modern/cn-tower-main/`
- `/photo/aircraft/f-16-falcon/f-16-falcon-1/`

**Important:** Moving or renaming a photo file changes its URL. Old links will 404.

---

## Renditions

At build time, `scripts/build-renditions.mjs` generates 7 resized renditions per photo using `sharp`:

| Width | Use | Display Size |
|-------|-----|-------------|
| 40 | Blur-up placeholder thumbnail | Shown as the `src`, upgraded by JS |
| 750 | Gallery card srcset, mobile hero | ~310–580px (cards), ~576px (mobile) |
| 900 | Legacy grid srcset (mobile/tablet) | ~576px (mobile) |
| 1280 | Hero `src`, card srcset fallback | ~1080px (hero desktop), ~446px (cards) |
| 1600 | Legacy grid srcset (desktop), category cover | ~920px (desktop) |
| 2400 | Zoom popover | Up to 85vh |
| 2560 | Hero srcset (retina) | Retina hero |

### Rendition file naming

```
{photo-id}-{width}.webp
```

Examples:

```
public/renditions/buildings-modern-cn-tower-main-40.webp
public/renditions/buildings-modern-cn-tower-main-750.webp
public/renditions/buildings-modern-cn-tower-main-1280.webp
public/renditions/buildings-modern-cn-tower-main-2560.webp
```

Each rendition is WebP at quality 80, resized to the target width (maintaining aspect ratio, no upscaling).

### Rendition manifest

`public/renditions/manifest.json` stores the original dimensions of every photo, so the site can set `width` and `height` attributes on every `<img>`. This prevents layout shift as prints load.

---

## Build Pipeline

```
1. scanPhotos() reads src/photos/ recursively
   └─→ categories from folders, subcategories from subfolders

2. For each photo file:
   ├─ Parse EXIF (camera, lens, focal, aperture, shutter, ISO, date)
   ├─ Read sidecar (title, location, note, hero rank) — if exists
   ├─ Generate title from filename
   ├─ Compute photo ID from path
   └─ Store dimensions from manifest.json (if available)

3. build-renditions.mjs generates 7 WebP renditions per photo

4. Pages assemble:
   ├─ Hero carousel: `hero: N` sidecars (ranked, capped at 6), else one cover per category + any `main` photos
   ├─ Featured wall: `main` photos, then category covers, then scan order (excludes hero photos, capped at 9)
   ├─ Masonry wall: all photos in the collection
   └─ Gallery portal: one cover per category card (by cover priority, unaffected by `hero:` ranks)
```

---

## Quick Reference

### To add a new photo:

```bash
# 1. Copy into the right folder
cp ~/Pictures/photos/dsc_0001.jpg src/photos/aircraft/F-16\ Falcon/

# 2. (Optional) Add a sidecar for title/overrides
cat > src/photos/aircraft/F-16\ Falcon/dsc_0001.jpg.txt << 'EOF'
title: F-16 Falcon at Airshow
location: London International Airshow
note: Low pass at sunset
EOF

# 3. Rebuild
npm run build
```

### To set a category cover:

Name any photo with `main` in the filename:

```
cn-tower-main.jpg    ← covers the "Buildings" category
```

### To set the hero showcase:

Add `hero: N` to a sidecar on any photo:

```
hero: 1    ← first slide in the hero showcase
hero: 2    ← second slide
hero: 3    ← third slide
```

Up to 6 slides. Photos are sorted by rank number.

**Fallback:** If no `hero:` sidecars exist anywhere, the hero carousel defaults to one cover photo per category (the same photos shown in the gallery portal cards). If no sidecars exist at all, the feature wall fills from scan order after excluding hero photos.

---

## Gotchas

- **No spaces in filenames** — use hyphens or underscores. The scanner lowercases and slugifies, but spaces can cause edge cases with glob patterns.
- **Extension matters** — only `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif` are recognized.
- **Sidecar must be next to the photo** — `photo.jpg.txt` must be in the same directory as `photo.jpg`.
- **Moving files changes URLs** — the photo ID is the filesystem path. Moving a file creates a new URL; the old one 404s.
- **`.DS_Store` files are ignored** — macOS metadata files won't show up as photos.
- **HEIC files** — if EXIF parsing fails on a HEIC, the photo still appears with a generated title, just no EXIF metadata.
