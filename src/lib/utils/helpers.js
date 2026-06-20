/**
 * Utility Helpers — Pure utility functions for the gallery
 */

/**
 * Format a date string into a human-readable format.
 * @param {string} dateString - ISO date string (e.g. "2025-06-15")
 * @returns {string} Formatted date (e.g. "June 15, 2025")
 */
export function formatDate(dateString) {
	if (!dateString) return '';

	const date = new Date(dateString + 'T00:00:00');
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Convert a text string to a URL-friendly slug.
 * @param {string} text - The text to slugify
 * @returns {string} URL-safe slug
 */
export function slugify(text) {
	if (!text) return '';

	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/&/g, '-and-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

/**
 * Load an image and return its natural dimensions.
 * @param {string} src - Image source URL
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export function getImageDimensions(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight
			});
		};
		img.onerror = () => {
			reject(new Error(`Failed to load image: ${src}`));
		};
		img.src = src;
	});
}

/**
 * Create a debounced version of a function.
 * @param {Function} fn - The function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Function} Debounced function with a .cancel() method
 */
export function debounce(fn, delay = 300) {
	let timeoutId;

	const debounced = (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};

	debounced.cancel = () => {
		clearTimeout(timeoutId);
	};

	return debounced;
}

/**
 * Linear interpolation between two values.
 * Useful for smooth animations and transitions.
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} factor - Interpolation factor (0 = start, 1 = end)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, factor) {
	return start + (end - start) * factor;
}
