/**
 * Gallery Store — Pure utility functions for accessing gallery data
 */

export let galleryData = { site: {}, categories: [] };

export function initGalleryData(data) {
	galleryData = data;
}

/**
 * Flatten all photos across every category and subcategory into a single array.
 * Each photo is enriched with its parent category and subcategory IDs.
 * @returns {Array<Object>} All photos with category context
 */
export function getAllPhotos() {
	const photos = [];

	for (const category of galleryData.categories) {
		for (const subcategory of category.subcategories) {
			for (const photo of subcategory.photos) {
				photos.push({
					...photo,
					categoryId: category.id,
					categoryName: category.name,
					subcategoryId: subcategory.id,
					subcategoryName: subcategory.name
				});
			}
		}
	}

	return photos;
}

/**
 * Find a category by its ID.
 * @param {string} id - The category ID
 * @returns {Object|undefined} The category object, or undefined if not found
 */
export function getCategory(id) {
	return galleryData.categories.find((cat) => cat.id === id);
}

/**
 * Find a subcategory within a specific category.
 * @param {string} categoryId - The parent category ID
 * @param {string} subcategoryId - The subcategory ID
 * @returns {Object|undefined} The subcategory object, or undefined if not found
 */
export function getSubcategory(categoryId, subcategoryId) {
	const category = getCategory(categoryId);
	if (!category) return undefined;
	return category.subcategories.find((sub) => sub.id === subcategoryId);
}

/**
 * Get a curated selection of photos for hero/featured sections.
 * Picks photos spread across different categories for visual variety.
 * @param {number} [count=6] - How many featured photos to return
 * @returns {Array<Object>} Featured photos
 */
export function getFeaturedPhotos(count = 6) {
	const all = getAllPhotos();

	// Pick photos spread across categories for variety
	const byCategory = new Map();
	for (const photo of all) {
		if (!byCategory.has(photo.categoryId)) {
			byCategory.set(photo.categoryId, []);
		}
		byCategory.get(photo.categoryId).push(photo);
	}

	const featured = [];
	const categoryArrays = [...byCategory.values()];
	let index = 0;

	// Round-robin across categories to get variety
	while (featured.length < count && featured.length < all.length) {
		const catPhotos = categoryArrays[index % categoryArrays.length];
		const photoIndex = Math.floor(index / categoryArrays.length);

		if (photoIndex < catPhotos.length) {
			featured.push(catPhotos[photoIndex]);
		}

		index++;

		// Safety: avoid infinite loops if we've exhausted all photos
		if (index > all.length * 2) break;
	}

	return featured.slice(0, count);
}

/**
 * Get the total number of photos in the entire gallery.
 * @returns {number}
 */
export function getTotalPhotoCount() {
	return getAllPhotos().length;
}

/**
 * Get the number of photos within a specific category.
 * @param {string} categoryId - The category ID
 * @returns {number}
 */
export function getCategoryPhotoCount(categoryId) {
	const category = getCategory(categoryId);
	if (!category) return 0;

	let count = 0;
	for (const subcategory of category.subcategories) {
		count += subcategory.photos.length;
	}
	return count;
}
