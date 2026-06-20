# Pratik Gupta — Photography Portfolio

A high-performance, statically generated SvelteKit portfolio bridging the gap between software engineering and photography.

## Architecture

This website is built with a **"Zero-Config" File-Based CMS**. There is no database, no JSON files to maintain, and no complex backend setup. The entire content structure is strictly dictated by the file system inside the `static/photos/` directory.

- **Categories**: Create a folder (e.g., `1-wildlife`).
- **Subcategories**: Create a nested folder (e.g., `1-birds`).
- **Photos**: Drop an image file inside. The file name acts as metadata:
  - `bird-10.jpg`: The number `10` represents its sorting rank.
  - `bird-10-hero.jpg`: The `-hero` tag automatically sends it to the massive Exhibition Frame on the homepage.
  - `bird-10-main.jpg`: The `-main` tag sets it as the subcategory cover photo.
  - `bird-10.txt`: Dropping a `.txt` file with the same name automatically attaches a caption to the photo in the lightbox.

## Technologies
- **SvelteKit** (Svelte 5 Runes)
- **Vanilla CSS** with Native Light/Dark CSS Variable Theming
- **SSG** via `@sveltejs/adapter-static` for extreme performance

## Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

For more in-depth architectural details, refer to the [handoff.md](./handoff.md) document.
