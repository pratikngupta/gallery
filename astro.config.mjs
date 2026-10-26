import { defineConfig } from 'astro/config';

// Static site. View Transitions are on by default in Astro 7; the layout adds
// <ClientRouter /> for SPA-style navigation between pages.
export default defineConfig({
  prefetch: { defaultStrategy: 'viewport' },
});
