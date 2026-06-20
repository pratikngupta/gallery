# Future To-Do List

This document tracks potential enhancements, optimizations, and features that could be added to the Gallery project in the future.

## Feature Enhancements

- [ ] **EXIF Data Parsing**: Enhance `src/lib/server/gallery.js` to read actual EXIF data from the image files (using a library like `exif-parser` or `exifr`). This would allow the site to automatically display camera settings (f-stop, shutter speed, ISO, lens info) in the lightbox.
- [ ] **Search Functionality**: Implement a client-side search bar (perhaps powered by a fuzzy search library like `Fuse.js`) that allows users to quickly find photos by title, category, or description.
- [ ] **Contact Form Backend**: The current "Contact Me" button on the About page is a simple `mailto:` link. Add a proper contact form utilizing a service like Formspree, Netlify Forms, or a custom serverless endpoint.
- [ ] **Tagging System**: Extend the file parsing to support arbitrary tags (perhaps via the companion `.txt` files or filename structure) to allow cross-category filtering.

## Performance Optimizations

- [ ] **Image Optimization Pipeline**: Currently, the site relies on the raw images placed in `static/photos/`. Integrate a Vite image plugin (like `vite-imagetools` or `@sveltejs/enhanced-img`) to automatically generate WebP/AVIF versions, responsive sizes (`srcset`), and blurred placeholders during the build process.
- [ ] **Lazy Loading Enhancements**: While the grid uses native `<img loading="lazy">`, integrating an IntersectionObserver-based lazy loader with blur-up or fade-in transitions would make the initial page load feel smoother, especially on slower connections.
- [ ] **Pagination/Infinite Scroll**: If the photo collections grow significantly large, implement pagination or infinite scrolling on the category and subcategory pages to prevent rendering thousands of DOM nodes simultaneously.

## UI / UX Polish

- [ ] **Keyboard Navigation Improvements**: Ensure full accessibility compliance by tightening up keyboard trap logic in the Lightbox component and ensuring all interactive elements have visible focus states.
- [ ] **Page Transitions**: Utilize SvelteKit's built-in transition capabilities or the View Transitions API to create seamless page routing (e.g., smoothly expanding a category card into the category page hero).
- [ ] **Dynamic Color Extraction**: Extract dominant colors from the cover photos at build time and use them to tint the gradient backgrounds on the category pages for a highly cohesive visual experience.
