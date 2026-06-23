import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	],
	build: {
		// Optimize bundle splitting
		rollupOptions: {
			output: {
				// Manual code splitting for better caching
				manualChunks: {
					'vendor': ['svelte']
				}
			}
		},
		// Warn if chunks exceed this size
		chunkSizeWarningLimit: 600,
		// Faster build with modern target
		target: 'ES2020',
		// Compress CSS and JS
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: false
			}
		}
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['svelte']
	}
});
