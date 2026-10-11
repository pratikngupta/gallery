import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = path.join(process.cwd(), 'static', 'photos');
const OPT_DIR = path.join(process.cwd(), 'static', 'photos-opt');

const SIZES = [360, 600, 900, 1400, 2048];
const WEBP_QUALITY = 78;

function getAllImageFiles(dir) {
	let results = [];
	if (!fs.existsSync(dir)) return results;
	const list = fs.readdirSync(dir, { withFileTypes: true });
	for (const dirent of list) {
		const fullPath = path.join(dir, dirent.name);
		if (dirent.isDirectory()) {
			results = results.concat(getAllImageFiles(fullPath));
		} else if (/\.(jpe?g|png|webp)$/i.test(dirent.name)) {
			results.push(fullPath);
		}
	}
	return results;
}

export async function processAllImages() {
	console.log('🖼️  Optimizing gallery images...');
	const start = Date.now();
	const imageFiles = getAllImageFiles(PHOTOS_DIR);
	const manifest = {};

	for (const imgPath of imageFiles) {
		const relPath = path.relative(PHOTOS_DIR, imgPath);
		const parsed = path.parse(relPath);
		const outSubdir = path.join(OPT_DIR, parsed.dir);
		fs.mkdirSync(outSubdir, { recursive: true });

		const img = sharp(imgPath).rotate();
		const meta = await img.metadata();
		const width = meta.width || 2048;
		const height = meta.height || 1365;
		const aspectRatio = Number((width / height).toFixed(4));

		const name = parsed.name;
		const srcKey = relPath.replace(/\\/g, '/');

		const cleanDir = parsed.dir
			? parsed.dir.split(/[/\\]/).map(encodeURIComponent).join('/') + '/'
			: '';

		const variants = {};
		for (const w of SIZES) {
			const targetWidth = Math.min(w, width);
			const outFileName = `${name}-${w}w.webp`;
			const outFilePath = path.join(outSubdir, outFileName);

			const srcUrl = `/photos-opt/${cleanDir}${encodeURIComponent(outFileName)}`;
			variants[w] = srcUrl;

			// Check if output exists and is newer than source
			let needsBuild = true;
			if (fs.existsSync(outFilePath)) {
				const srcStat = fs.statSync(imgPath);
				const outStat = fs.statSync(outFilePath);
				if (outStat.mtimeMs >= srcStat.mtimeMs && outStat.size > 0) {
					needsBuild = false;
				}
			}

			if (needsBuild) {
				await sharp(imgPath)
					.rotate()
					.resize({ width: targetWidth, withoutEnlargement: true })
					.webp({ quality: WEBP_QUALITY, effort: 4 })
					.toFile(outFilePath);
			}
		}

		const srcsetWebp = SIZES
			.map(w => `${variants[w]} ${w}w`)
			.join(', ');

		const cleanSrc = '/photos/' + relPath.split(/[/\\]/).map(encodeURIComponent).join('/');

		manifest[srcKey] = {
			width,
			height,
			aspectRatio,
			src: cleanSrc,
			srcWebp: variants[600] || variants[360] || cleanSrc,
			src360: variants[360],
			src600: variants[600],
			src900: variants[900],
			src1400: variants[1400],
			src2048: variants[2048],
			srcsetWebp
		};
	}

	fs.writeFileSync(path.join(OPT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
	const elapsed = ((Date.now() - start) / 1000).toFixed(2);
	console.log(`✅ Optimized ${imageFiles.length} images in ${elapsed}s (manifest saved to static/photos-opt/manifest.json)`);
	return manifest;
}

if (process.argv[1] && process.argv[1].endsWith('optimize-images.mjs')) {
	processAllImages().catch(err => {
		console.error('Failed to optimize images:', err);
		process.exit(1);
	});
}
