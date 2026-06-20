import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = path.join(process.cwd(), 'static', 'photos');

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseFilename(filename) {
	const ext = path.extname(filename);
	const nameWithoutExt = path.basename(filename, ext);
	let parts = nameWithoutExt.split('-');
	
	let rank = 0;
	let isHero = false;
	let isGalleryCover = false;
	let isMain = false;
	let isPortrait = false;
	
	// Check if last part is a number (for ranking)
	if (parts.length > 1 && !isNaN(parseInt(parts[parts.length - 1], 10))) {
		rank = parseInt(parts.pop(), 10);
	}
	
	// Filter out modifiers from any position to clean the title
	parts = parts.filter(p => {
		const pLower = p.toLowerCase();
		if (pLower === 'hero' || pLower === 'coverart') { isHero = true; return false; }
		if (pLower === 'gallerycover' || pLower === 'categorycover') { isGalleryCover = true; return false; }
		if (pLower === 'main' || pLower === 'cover') { isMain = true; return false; }
		if (pLower === 'portrait') { isPortrait = true; return false; }
		return true;
	});
	
	// The rest is the title
	const title = parts.map(p => capitalize(p)).join(' ');
	
	return { title, rank, isHero, isGalleryCover, isMain, isPortrait, nameWithoutExt };
}

export function generateGalleryData() {
	if (!fs.existsSync(PHOTOS_DIR)) {
		return { categories: [] };
	}

	const categories = [];
	const heroImages = [];
	const categoryFolders = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory());

	for (const catFolder of categoryFolders) {
		const catPath = path.join(PHOTOS_DIR, catFolder.name);
		const subcategoryFolders = fs.readdirSync(catPath, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory());

		const subcategories = [];
		let explicitCategoryCover = null;

		for (const subFolder of subcategoryFolders) {
			const subPath = path.join(catPath, subFolder.name);
			const files = fs.readdirSync(subPath, { withFileTypes: true })
				.filter(dirent => dirent.isFile());

			const imageFiles = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f.name));
			const photos = [];

			for (const imgFile of imageFiles) {
				const { title, rank, isHero, isGalleryCover, isMain, isPortrait, nameWithoutExt } = parseFilename(imgFile.name);
				const src = `/photos/${catFolder.name}/${subFolder.name}/${imgFile.name}`;
				
				if (isGalleryCover) {
					explicitCategoryCover = src;
				}

				if (isHero) {
					if (!heroImages.includes(src)) {
						heroImages.push(src);
					}
				}
				
				// Check for companion text file
				let description = "";
				const txtPath = path.join(subPath, `${nameWithoutExt}.txt`);
				if (fs.existsSync(txtPath)) {
					description = fs.readFileSync(txtPath, 'utf-8').trim();
				}

				photos.push({
					src,
					title,
					description,
					rank,
					isMain,
					isPortrait,
					// Optional: derive date from file creation or just leave empty
					date: undefined, 
					location: undefined
				});
			}

			// Sort photos by rank descending
			photos.sort((a, b) => b.rank - a.rank);

			if (photos.length > 0) {
				// Find cover photo: either marked isMain, or the first one
				const coverPhoto = photos.find(p => p.isMain) || photos[0];
				
				subcategories.push({
					id: subFolder.name,
					name: subFolder.name.split('-').map(capitalize).join(' '),
					cover: coverPhoto.src,
					photos: photos.map(({ rank, isHero, isGalleryCover, ...rest }) => rest) // Clean up internal props
				});
			}
		}

		if (subcategories.length > 0) {
			// Category cover is the explicitly marked coverart, or fallback to first subcategory's cover
			const cover = explicitCategoryCover || subcategories[0].cover;
			
			categories.push({
				id: catFolder.name,
				name: catFolder.name.split('-').map(capitalize).join(' '),
				description: `Explore the ${catFolder.name} collection.`,
				cover,
				subcategories
			});
		}
	}

	// Basic site metadata
	const site = {
		name: "Gallery",
		tagline: "Capturing Moments in Light",
		description: "A photography portfolio showcasing landscapes, architecture, and wildlife from around the world.",
		photographer: "Pratik Gupta"
	};

	// Fallback: if no coverart specified, use category covers
	if (heroImages.length === 0) {
		heroImages.push(...categories.map(c => c.cover).filter(Boolean));
	}

	return { site, categories, heroImages };
}
