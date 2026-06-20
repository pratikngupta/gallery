# Project Handoff

Welcome to the Gallery project! This document contains all the essential information you need to take over, run, and maintain this codebase.

## Project Identity
This is a photography portfolio tailored for a software engineer. The design language actively blends the two disciplines:
- **Photography**: Large imagery, edge-to-edge lightboxes, Playfair Display typography for editorial elegance.
- **Engineering**: Monospace typography (JetBrains Mono), syntax highlighting accents, terminal-style windows, and `// code comment` section headers.

## Tech Stack
- **Framework**: SvelteKit
- **Reactivity**: Svelte 5 (using Runes: `$state`, `$derived`, `$effect`, `$props`)
- **Styling**: Vanilla CSS with modern features (Custom Properties, CSS masonry, backdrop-filter)
- **Theming**: Native CSS variable-based Light/Dark mode with `localStorage` persistence and FOUT-prevention script.
- **Deployment Strategy**: Static Site Generation (SSG) via `@sveltejs/adapter-static`

## Core Mechanics

### The "Zero-Config" Content System
The most important technical feature of this site is how it handles data. **There is no database or JSON configuration file.** 

Content is managed purely via the file system inside `static/photos/`:
1. **Drop a folder**: Creates a new Category or Subcategory.
2. **Drop an image**: Automatically adds it to the gallery.
3. **Name it smartly**: Naming an image `bird-10.jpg` gives it a sort rank of 10 (higher numbers appear first).
4. **Use Tags**: You can add specific keywords to the filename to dictate where the photo appears:
   - `-hero` or `-coverart`: Adds the photo to the homepage's massive exhibition frame slider.
   - `-gallerycover` or `-categorycover`: Sets the cover photo for the entire Category page (e.g. Wildlife).
   - `-main` or `-cover`: Sets the main cover photo for a Subcategory/collection (e.g. Birds).
   - `-portrait`: Optional tag to define orientation (for future masonry layouts).
5. **Drop a text file**: Placing `bird-10.txt` next to the image automatically attaches the text file's contents as the image description in the lightbox.

*Note: The server-side script (`src/lib/server/gallery.js`) scans this directory during the build process and generates the routing data statically.*

## Getting Started

### Prerequisites
- Node.js (v22.x recommended)
- npm

### Installation
```bash
# Install dependencies
npm install
```

### Local Development
```bash
# Start the Vite development server with Hot Module Replacement
npm run dev
```

### Production Build
```bash
# Generate the static HTML/CSS/JS bundles into the /build directory
npm run build

# Preview the built static site locally
npm run preview
```

## Deployment
Because the app uses `adapter-static`, the output of `npm run build` is a standard directory of static files (`/build`).
You can deploy this directory to any static hosting provider:
- GitHub Pages
- Vercel (Static)
- Netlify
- Cloudflare Pages
- AWS S3 / CloudFront

*Remember: You must run `npm run build` whenever you add new photos, as the file scanning happens at build time.*
