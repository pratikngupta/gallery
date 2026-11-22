# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Followers and the photography community: people who come to see the work and
stay for it, then drift to Instagram (@pratik_ngupta) and the rest of the
online presence. They arrive with no agenda beyond the photographs; contact
by email is a secondary, quiet exit. A secondary audience is the occasional
visitor who also wants to know the person behind the work — the About page
carries the engineer side (software-engineering graduate researcher at
Western University, mission architecture for autonomous VTOLs at Western
Aero Design) as context, not as the product.

## Product Purpose
A static photography portfolio for Pratik Gupta: landscapes, wildlife, urban
architecture, and astrophotography, organized as collections of series with
a per-print detail view. It exists so the body of work can be seen as a body
of work — quickly, cleanly, without UI in the way. Success means the
visitor sees the work the way it was made to be seen and leaves knowing who
to follow. The site is **showcase only** (owner-confirmed): no sales, no
commissions, no store or booking path of any kind; email is the only call
to action.

## Positioning
The photographs are the interface. The site is a darkroom, not a web app:
prints hang as clean prints — no cards, borders, or chrome — accent color is
spent on state only, and the only motion is the blur-up develop and the hero
showcase. A neighboring site that presents its work as a grid of cards or a
captioned feed cannot truthfully copy this, because the work itself is the
product and every pixel of interface is budgeted against it.

## Operating Context
- **Folder structure is the content model.** Categories come from folders
  under `src/photos/`, series from subfolders, and covers are marked in the
  filename (`-featured` / `main`). Adding a photograph means adding a file —
  no CMS, no config edits, nothing hardcoded per category.
- **EXIF is parsed at build time** (`exifr`). No metadata is required:
  titles fall back to the filename, or the containing folder when the
  filename is a camera default; an optional `photo.txt` sidecar overrides
  (title, `location:`, etc.).
- **Local commands:** `npm run dev`, `npm run build`, `npm run preview`.
  The build regenerates WebP renditions via `sharp` into
  `public/renditions/` (gitignored).
- **Deployment:** GitHub (`github.com/pratikngupta/gallery`), static
  hosting; `dist/404.html` serves unmatched URLs on GitHub Pages, Netlify,
  and Cloudflare alike.
- **The About page doubles as a short professional bio** — the engineering
  work (multi-agent visual-language reasoning research, autonomous VTOL
  mission architecture) is the owner's other world; the photography is the
  product.

## Capabilities and Constraints
- Static Astro 7 site; SPA-style navigation via `ClientRouter` + View
  Transitions; no framework JS, no server, no CMS.
- **The design contract lives in `docs/KNOWLEDGE.md`** (tokens, five
  palettes × dark/light, accent discipline, motion budget, accessibility)
  with `docs/PLAN.md` carrying the avoid list. Any layout/spacing/type
  change must be checked against them before it ships.
- **Canonical contact is `pratikngupta@outlook.com`** (owner-confirmed
  2026-02). `hello@pratikgupta.com`, formerly in the footer, is the wrong
  address and has been corrected.
- **Instagram `@pratik_ngupta`** is the reach; the site is the depth.
- The site must keep working with an empty `src/photos/` directory (graceful
  empty states) and with zero-metadata files.
- `prefers-reduced-motion` and both themes are part of the contract, not
  optional polish.
- Undecided product facts: none recorded.

## Brand Commitments
- Wordmark is **PRATIK GUPTA** (uppercase — the mark).
- Voice, in the owner's own words on About: dry, first-person,
  engineer-precise — "I debug compositions the way I debug code. The camera
  is where I learn to let go."
- The "photographs are the interface" stance is an owner-approved
  non-negotiable (AGENTS.md) and binds all future work.
- Contact: `pratikngupta@outlook.com`; handle `@pratik_ngupta`.

## Evidence on Hand
- 119 photographs across five collections (aircraft, birds, buildings,
  landscape, wildlife) with real EXIF metadata, in `src/photos/`.
- An About page in the owner's own words, with the camera/lens kit derived
  from the prints themselves.
- **No testimonials, clients, awards, press, pricing, or licensing —
  future work must not invent any of these.**

## Product Principles
1. **The photographs are the interface.** No UI element may compete with the
   work; the work leads from the first viewport and the interface recedes.
2. **The work is organized the way it was made.** Collections and series
   come from the folder structure, never from editorial configuration.
3. **Nothing is required of the photographer.** Zero mandatory metadata, no
   CMS; dropping a file in is the entire publishing flow.
4. **Showcase, not shop.** No commerce, no bookings, no claims beyond the
   work itself (owner-confirmed).
5. **Quiet contact.** The site is for people to enjoy and follow the work;
   email is a quiet exit and Instagram is where the community is.

## Accessibility & Inclusion
- Contrast is measured, not assumed: every accent and meta color meets AA
  (≥4.5:1) on its own background in every palette and mode.
- Keyboard: Tab reaches every interactive element; focus rings are visible;
  the zoom popover is operable without a mouse.
- `prefers-reduced-motion` is respected in both CSS and JS.
- Both themes (dark and light) are first-class in all five palettes.
