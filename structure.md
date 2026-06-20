# Project Structure

This document outlines the architecture and file structure of the Gallery project, built with SvelteKit and Svelte 5.

## High-Level Architecture

The project is a statically generated site (SSG) tailored for a software engineer who is also a photographer. It features a zero-configuration automated file scanner that reads the `static/photos/` directory at build time to generate the entire gallery data structure.

### Key Directories

```text
/
├── static/
│   └── photos/                 // The source of truth for all content
│       ├── {category}/         // Top-level categories (e.g., 'landscape', 'wildlife')
│       │   └── {subcategory}/  // Nested subcategories (e.g., 'mountains', 'goose')
│       │       ├── image.jpg   // Photo files. Naming convention controls title and sort order
│       │       └── image.txt   // Optional companion text file for photo descriptions
│       └── favicon.png
├── src/
│   ├── lib/
│   │   ├── components/         // Svelte 5 UI components
│   │   ├── server/             // Server-side logic (build-time only)
│   │   │   └── gallery.js      // Automated file system scanner
│   │   └── stores/             // Client-side state and utilities
│   │       └── gallery.js      // Data access functions (initialized by layout)
│   ├── routes/                 // SvelteKit routing
│   │   ├── +layout.svelte      // Root layout (Navbar, Footer, store initialization)
│   │   ├── +layout.server.js   // Calls the scanner during SSG build to pass data to frontend
│   │   ├── +page.svelte        // Homepage (Hero, Featured, About Teaser)
│   │   ├── about/              // About page
│   │   └── gallery/            // Dynamic gallery routing
│   │       ├── +page.svelte    // All collections overview
│   │       ├── [category]/     // Category overview + subcategory filter
│   │       └── [subcategory]/  // Specific subcategory photo grid
│   ├── app.css                 // Core design system (colors, typography, animations)
│   └── app.html                // HTML template and font imports
└── package.json
```

## Core Systems

### 1. Automated Photo Discovery (`src/lib/server/gallery.js`)
Instead of a manual JSON file, the gallery relies on the file system. During the `npm run build` process, `gallery.js` uses Node's `fs` module to crawl the `static/photos/` directory.
- It parses directory names into Capitalized Titles.
- It parses filenames (e.g., `goose-10.jpg`) to extract the title ("Goose") and the sort rank (`10`).
- It checks for companion `.txt` files with the same base name to extract descriptions.

### 2. Data Flow
1. Build starts (`adapter-static`).
2. `src/routes/+layout.server.js` executes its `load()` function.
3. `load()` calls the file scanner.
4. The generated JSON tree is passed as `data.gallery` to `src/routes/+layout.svelte`.
5. The layout calls `initGalleryData(data.gallery)` to populate the client-side store (`src/lib/stores/gallery.js`).
6. All pages and components use helper functions from the store (e.g., `getCategory()`, `getFeaturedPhotos()`).

### 3. Design System (`src/app.css`)
The site uses a custom "Engineer × Photographer" aesthetic:
- **Fonts**: JetBrains Mono (tech/code), Playfair Display (editorial/artistic), Inter (UI).
- **Colors**: Deep dark background (`#0a0a0f`), Teal accent (`#4fd1c5`), Amber secondary (`#d4a574`).
- **Features**: Glassmorphism (`.glass`), CSS masonry grids, scroll-triggered animations, and code-syntax decorators (e.g., `//`, `{}`).
