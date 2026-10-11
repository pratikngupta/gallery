import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = path.join(process.cwd(), 'static', 'photos');
const MANIFEST_PATH = path.join(process.cwd(), 'static', 'photos-opt', 'manifest.json');

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
		return { site: { name: "Gallery", tagline: "", description: "", photographer: "" }, categories: [], heroImages: [] };
	}

	let manifest = {};
	if (fs.existsSync(MANIFEST_PATH)) {
		try {
			manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
		} catch (e) {
			console.warn('Could not read photos-opt manifest:', e);
		}
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
				const relKey = `${catFolder.name}/${subFolder.name}/${imgFile.name}`;
				const opt = manifest[relKey] || {};
				const src = opt.src || `/photos/${encodeURIComponent(catFolder.name)}/${encodeURIComponent(subFolder.name)}/${encodeURIComponent(imgFile.name)}`;
				
				// Check for companion text file
				let description = "";
				const txtPath = path.join(subPath, `${nameWithoutExt}.txt`);
				if (fs.existsSync(txtPath)) {
					description = fs.readFileSync(txtPath, 'utf-8').trim();
				}

				const photoObj = {
					src,
					srcWebp: opt.srcWebp || src,
					src400: opt.src400 || src,
					src800: opt.src800 || src,
					src1400: opt.src1400 || src,
					src2048: opt.src2048 || src,
					srcsetWebp: opt.srcsetWebp || '',
					width: opt.width || 2048,
					height: opt.height || 1365,
					aspectRatio: opt.aspectRatio || 1.5,
					title,
					description,
					rank,
					isMain,
					isPortrait,
					isHero,
					isGalleryCover,
					date: undefined, 
					location: undefined
				};

				if (isGalleryCover) {
					explicitCategoryCover = photoObj;
				}

				if (isHero) {
					if (!heroImages.some(p => p.src === src)) {
						heroImages.push(photoObj);
					}
				}

				photos.push(photoObj);
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
					coverPhoto,
					photos: photos.map(({ rank, isHero, isGalleryCover, ...rest }) => rest) // Clean up internal props
				});
			}
		}

		if (subcategories.length > 0) {
			// Category cover is the explicitly marked coverart, or fallback to first subcategory's cover
			const coverPhoto = explicitCategoryCover || subcategories[0].coverPhoto;
			const cover = coverPhoto ? coverPhoto.src : subcategories[0].cover;
			const categoryDescriptions = {
				buildings: 'Architecture and geometry',
				landscape: 'Nature and atmosphere',
				wildlife: 'Life in the natural world'
			};

			categories.push({
				id: catFolder.name,
				name: catFolder.name.split('-').map(capitalize).join(' '),
				description: categoryDescriptions[catFolder.name.toLowerCase()] || `Explore the ${catFolder.name} collection.`,
				cover,
				coverPhoto,
				subcategories
			});
		}
	}

	const site = {
		name: "Gallery",
		tagline: "The logic of software. The art of the lens.",
		description: "Where engineering precision meets artistic vision. A photography portfolio by Pratik Gupta.",
		photographer: "Pratik Gupta"
	};

	// Fallback: if no coverart specified, use category covers
	if (heroImages.length === 0) {
		for (const c of categories) {
			if (c.coverPhoto) {
				heroImages.push(c.coverPhoto);
			}
		}
	}

	return { site, categories, heroImages };
}
