import { generateGalleryData } from '$lib/server/gallery.js';

export const prerender = true;

export function load() {
	const gallery = generateGalleryData();
	return {
		gallery
	};
}
