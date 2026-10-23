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

A photo with **`main` in the filename** becomes its category's cover. It appears:

- As the hero slide on the homepage (when no `Hero:` sidecar ranks are set)
- In the "Explore the full gallery" cards on the homepage
- At the top of the category page wall

The scanner prefers a root-level "main" photo over a subfolder "main" photo.

### Naming patterns that match `main`:

```
cn-tower-main.jpg         ✅
toronto-skyline-main.jpg  ✅
main-tower.jpg            ✅
tower-main-view.jpg       ✅
```

### Patterns that do NOT match:

```
cn-tower-captain.jpg      ❌ (contains "main" as substring of another word — this IS matched, see note)
my-main-character.jpg     ✅ (matched)
```

> **Note:** The check is `\bmain\b` — a standalone word "main" bounded by word characters. So `captain` does NOT match (no word boundary before/after "main"), but `main-capture` DOES match.

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
| `hero: N` | Ranks the photo in the homepage hero showcase (1 = first) |

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
   ├─ Hero slides: ranked by `hero: N` in sidecars, else covers
   ├─ Featured wall: main photos, then covers, then rest (capped at 9)
   ├─ Masonry wall: all photos in the collection
   └─ Gallery portal: category cards with cover thumbnails
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

Add `hero: N` to a sidecar:

```
hero: 1    ← first slide in the hero showcase
hero: 2    ← second slide
hero: 3    ← third slide
```

With no sidecars, the showcase defaults to each category's cover.

---

## Gotchas

- **No spaces in filenames** — use hyphens or underscores. The scanner lowercases and slugifies, but spaces can cause edge cases with glob patterns.
- **Extension matters** — only `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif` are recognized.
- **Sidecar must be next to the photo** — `photo.jpg.txt` must be in the same directory as `photo.jpg`.
- **Moving files changes URLs** — the photo ID is the filesystem path. Moving a file creates a new URL; the old one 404s.
- **`.DS_Store` files are ignored** — macOS metadata files won't show up as photos.
- **HEIC files** — if EXIF parsing fails on a HEIC, the photo still appears with a generated title, just no EXIF metadata.
