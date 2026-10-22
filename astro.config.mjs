import { defineConfig } from 'astro/config';

// Static site. No integrations needed: the photo pipeline is a plain
// build-time scanner (src/lib/photos.mjs) + astro:assets for renditions.
export default defineConfig({});
