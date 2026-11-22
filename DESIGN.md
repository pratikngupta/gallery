---
name: Pratik Gupta — Portfolio
description: A darkroom for photographs — clean prints on a near-black wall, hue spent only on state, no chrome on the work.
colors:
  paper: "#090909"
  ink: "#f5f5f5"
  meta: "#a3a3a3"
  frame: "#303030"
  paper-light: "#ffffff"
  ink-light: "#171717"
  meta-light: "#666666"
  frame-light: "#e5e5e5"
  accent-graphite: "#d4d4d4"
  accent-graphite-light: "#404040"
  accent-slate: "#60a5fa"
  accent-stone: "#c4a484"
  accent-sage: "#87a991"
  accent-plum: "#b5a0d0"
  darkroom: "#0e0d0b"
  darkroom-ink: "#ece7df"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
  wordmark:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, monospace"
rounded:
  print: "8px"
  capsule: "9999px"
spacing:
  container: "1320px"
  gutter: "clamp(1.25rem, 5vw, 4rem)"
  page-top: "clamp(4rem, 7vw, 5rem)"
  page-bottom: "clamp(4rem, 8vw, 6rem)"
  column-gap: "1.5rem"
components:
  pill:
    backgroundColor: "color-mix(in srgb, #303030 45%, transparent)"
    textColor: "{colors.meta}"
    typography: "{typography.label}"
    rounded: "{rounded.print}"
    padding: "0.45rem 1.15rem"
  pill-hover:
    backgroundColor: "color-mix(in srgb, #303030 45%, transparent)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.print}"
    padding: "0.45rem 1.15rem"
  pill-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.print}"
    padding: "0.45rem 1.15rem"
  back-capsule:
    backgroundColor: "color-mix(in srgb, #303030 45%, transparent)"
    textColor: "{colors.meta}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0.3rem 0.85rem"
  print-tile:
    rounded: "{rounded.print}"
  hero-location-pill:
    backgroundColor: "{colors.darkroom}"
    textColor: "{colors.darkroom-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "0.4rem 0.95rem"
  palette-dot:
    backgroundColor: "{colors.meta}"
    rounded: "{rounded.capsule}"
    size: "14px"
---

# Design System: Pratik Gupta — Portfolio

## Overview

**Creative North Star: "The Darkroom"**

The site is a darkroom, not a web app. A near-black wall holds clean prints;
the interface is the plaster, never the paint. The voice is measured, dark,
and confident: the work speaks, the interface holds its breath. There is no
urgency, no decoration, no explanation — a print appears the way a print
develops, out of blur, in the safelight of a state accent.

Density is deliberately low. Every page is one wall at a time: a hero
showcase, a masonry of prints, or a single print under the lamp. Chrome is
measured in hairlines (1px frame) and radii (8px), and the only hue on a
screen is the accent, which is spent on state — active, hover, focus — and
on nothing else.

This system implements the owner's binding non-negotiable (PRODUCT.md):
**the photographs are the interface.** No UI element may compete with the
images. Confirmed visual rejections, from the owner: cards/borders/shadows
around prints; navigation animations (page swaps are instant); an accent
used as decoration; an endless single-scroll home; a UI that requires photo
metadata to function.

**Key Characteristics:**

- Clean prints on a near-black wall — no cards, borders, or shadows
- Ink-on-paper inversion carries both themes; no palette-specific component colors
- One hue per palette, spent on state only (active pill, hover, focus ring)
- The work develops in: a 40px placeholder blurs up into the full print
- Capsule radius means navigation; 8px radius means print or filter
- Mono type is the lab readout: EXIF, specs, counts

## Colors

Neutral paper-and-ink base with one quiet hue per palette; every accent and
meta color is measured to AA (≥4.5:1) against its own paper in both themes.

### Primary

The accent family — one hue per palette, and the only hue on the wall. Used
exclusively for state: the active pill's neighbors' hover, focus rings
(2px solid, 3px offset), the selection highlight.

- **Graphite Grey** (accent-graphite): default palette; grey-on-grey keeps the wall monochrome.
- **Slate Blue** (accent-slate): the cool option; the most saturated accent in the set.
- **Stone Ochre** (accent-stone): the warm option, nudged from a 4.2:1 candidate to clear AA.
- **Sage Green** (accent-sage): the muted option; weakest light-mode contrast in the set (5.0:1) — still AA.
- **Plum Violet** (accent-plum): the darkest option's hue; reads quietest against the near-black papers.

### Neutral

- **Paper** (`paper`): the wall itself. Near-black in dark themes, white or warm-white in light.
- **Ink** (`ink`): text and the active pill's solid fill (the ink/paper inversion).
- **Meta** (`meta`): secondary text, captions, inactive pills, the footer. Always ≥4.6:1 on paper.
- **Frame** (`frame`): hairlines (1px chip borders), the scrollbar, and the 45% wash behind chips.

### Darkroom

- **Darkroom** (`darkroom`) / **Darkroom Ink** (`darkroom-ink`): the
  always-dark surfaces — the hero and print scrims, the zoom popover. They
  do not follow the theme or the palette; they are the room the work was
  developed in.

### Named Rules

**The State-Only Accent Rule.** The accent appears only on active, hover,
and focus. Never as decoration, never in gradients, never in type. Its
rarity is the point.

**The Measured-Contrast Rule.** No color ships without its ratio: every
accent and meta measures at least 4.5:1 against its own paper in every
palette × theme. The weakest values in the set (Sage light 5.0:1, Stone
light 5.2:1) were nudged to clear AA — add no color without doing the same.

**The Always-Dark Room Rule.** Darkroom surfaces stay dark in every palette
and every theme. A light theme never lights the darkroom.

## Typography

**Display Font:** Archivo (with 'Helvetica Neue', Helvetica, sans-serif)
**Body Font:** Archivo — the same variable face; `--font-heading` and
`--font-body` both point at `--font-sans` so the two can never drift
**Label/Mono Font:** JetBrains Mono (EXIF, specs, counts, numbering)

**Character:** One family does everything — display lines at 700, body at
400, labels at 500 — so the geometry stays cohesive instead of editorially
mixed. The mono face is the lab's readout: it appears only where a number
or a measurement is being stated.

### Hierarchy

- **Display** (700, `clamp(2rem, 4vw, 3rem)`, 1.05, −0.025em): collection and page titles only.
- **Body** (400, 1rem, 1.6): prose (About) and descriptions; description lines cap at 44ch.
- **Label** (500, 0.8125rem, 0.06em, uppercase): nav links, pills, menu, badges.
- **Wordmark** (700, 1.0625rem, 0.08em, uppercase): the mark in the header — the only all-caps identity element.
- **Mono** (JetBrains Mono): EXIF values, the spec table, counts. Never for prose.

### Named Rules

**The One Typeface Rule.** Only Archivo (one variable range, 400–700) and
JetBrains Mono. Nothing else may be requested — and the Google Fonts range
must stop at 700, because a subset that stops at 600 makes the browser fake
the bold.

## Layout

A single centered 1320px container on clamped gutters
(`clamp(1.25rem, 5vw, 4rem)`) with clamped page bands
(`clamp(4rem, 7vw, 5rem)` top, `clamp(4rem, 8vw, 6rem)` bottom) — the page
breathes at every width instead of jumping at breakpoints. The wall is CSS
masonry: 3 columns → 2 at 1024px → 1 at 640px, 1.5rem column gap, no
gutter styling on the tiles themselves. The header is one row on every
screen (56px on mobile, 44×44px touch targets). The detail page pairs the
print with a 340px sticky spec sidebar at 1024px+. On collection pages the
breadcrumb floats in the page-top padding band rather than sitting in flow,
so every view starts at exactly the same vertical level. One switcher row
per level: the category row on "All", the active category's series row
otherwise — never stacked.

## Elevation & Depth

No shadows, anywhere. Depth is tonal and photographic: the detail page
darkens the wall by mixing 8–10% darkroom into the paper; the print scrim
is a 72%-darkroom-to-transparent gradient from the bottom edge; the
blur-up itself is the depth cue, a print developing out of a 22px blur.
Nothing lifts off the wall — a shadow on a photograph reads as a card, and
cards are banned.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest and stay flat.
Depth is conveyed by darkening and developing, never by box-shadow.

## Shapes

Two radii, two meanings. **8px** (`print`) is the print and everything
flat on the wall: tiles, chips, the zoom image. **Capsule** (`9999px`) is
navigation: the back chips, "Back to gallery", the hero location pill, the
palette dots. Borders exist only as 1px frame hairlines on chips; prints
carry no border at all. No clipping, no cut corners, no decorative geometry.

### Named Rules

**The Capsule-Means-Go Rule.** Capsule radius means navigation; 8px means
print or filter. The two must not be mixed — the radius is how a visitor
tells a door from a switch.

## Components

### Pills (switchers & filters)

- **Character:** quiet ink-on-paper chips; the active one is the only solid object on the wall.
- **Shape:** 8px radius (`print`), 1px frame hairline, 45%-frame wash behind.
- **Rest:** meta text on the wash; **Hover:** ink text, meta border; **Active:** full inversion — ink fill, paper text, weight 600.
- **States are keyboard-equal:** `aria-pressed` on filters, focus ring 2px accent / 3px offset.

### Back Capsules (navigation)

- **Character:** the capsule is the door — origin-aware, it names the page you came from, not just your position in the tree.
- **Shape:** capsule radius, same 45% wash, tighter padding (0.3rem 0.85rem).
- **Hover:** accent text + accent border — the accent's only door-related spend.

### Print Tile (the wall)

- **Character:** a clean print. The only permitted chrome: 8px radius and a title-only hover scrim.
- **Load:** a 40px placeholder is already in the browser when the wall paints; the full rendition develops out of it — `blur(22px) saturate(0.75) scale(1.04)` resolving over 0.6s, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- **Scrim:** bottom-edge 72%-darkroom gradient, title in darkroom-ink; hover-capable devices only — never on touch.
- **No** border, shadow, or caption at rest.

### Hero (showcase)

- **Character:** the work leads from the first viewport; the interface recedes.
- **Behavior:** full-bleed, 5s auto-advance, one print at a time; inactive slides are `inert` and `aria-hidden`; a Pause control (aria-pressed) in the hero bar is the keyboard stop.
- **Location pill:** darkroom capsule, bottom-left — it states a place only when the library states one (a `location:` sidecar or a place name literally in the folder/filename); otherwise it names the series. Geography is never guessed.

### Zoom Popover (the darkroom)

- **Character:** one print under the lamp, in the room where it was developed.
- **Behavior:** native popover, always darkroom in both themes, 85vh `object-contain`, 8px radius; opens and closes by click and is fully keyboard-operable.

### Navigation

- **Header:** one compact row on every screen — wordmark (700, 0.08em, uppercase) · nav · appearance controls (palette dots + theme toggle) inline on desktop; a MENU popover carrying the nav links and appearance controls on mobile.
- **Links:** 13px label, meta at rest, ink on hover, a 1.5px underline that grows from the left.
- **Palette dots:** 14px, the five accent hues — the only place hue reads as content rather than state.

### Spec Table (detail sidebar)

- **Character:** the lab's readout — mono type, hairline rows, 340px sticky on desktop.
- **Content:** EXIF from the file (camera, lens, focal, aperture, shutter, ISO) — real data only; nothing invented for missing fields.

## Do's and Don'ts

### Do:

- **Do** keep the photographs the interface: no cards, borders, or shadows on grid images; the only tile chrome is the 8px radius and the title-only hover scrim.
- **Do** spend the accent on state only — active pill, hover, focus ring (2px solid, 3px offset).
- **Do** let the wall develop: 40px placeholder → blur-up over 0.6s with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- **Do** keep the zoom popover dark in every palette and theme.
- **Do** reserve uppercase for the wordmark and nav labels; everything else is sentence case.
- **Do** check both themes and all five palettes, and `prefers-reduced-motion`, before anything ships.
- **Do** measure contrast (≥4.5:1) before adding any color to the set.

### Don't:

- **Don't** put a shadow, border, or card on a photograph — depth is tonal, not graphical.
- **Don't** animate navigation: page swaps are instant; the only motion in the system is the blur-up develop and the hero showcase.
- **Don't** use the accent as decoration, in gradients, or in text color at rest.
- **Don't** add tracked all-caps eyebrows or `→`/`↓` glyphs to link and button text.
- **Don't** request fonts or weights beyond the Archivo 400–700 variable range and JetBrains Mono.
- **Don't** assert geography the library doesn't state — the hero badge hides rather than guesses.
- **Don't** build commerce, booking, or social-follow UI — the site is showcase only (PRODUCT.md); email is the only call to action.
