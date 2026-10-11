// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Photo {
		src: string;
		srcWebp?: string;
		src400?: string;
		src800?: string;
		src1400?: string;
		src2048?: string;
		srcsetWebp?: string;
		width?: number;
		height?: number;
		aspectRatio?: number;
		title?: string;
		description?: string;
		rank?: number;
		isMain?: boolean;
		isPortrait?: boolean;
		isHero?: boolean;
		isGalleryCover?: boolean;
		date?: string;
		location?: string;
		categoryId?: string;
		categoryName?: string;
		subcategoryId?: string;
		subcategoryName?: string;
		[key: string]: any;
	}

	interface Subcategory {
		id: string;
		name: string;
		cover: string;
		coverPhoto?: Photo;
		photos: Photo[];
		[key: string]: any;
	}

	interface Category {
		id: string;
		name: string;
		description: string;
		cover: string;
		coverPhoto?: Photo;
		subcategories: Subcategory[];
		[key: string]: any;
	}

	interface GalleryData {
		site: {
			name?: string;
			tagline?: string;
			description?: string;
			photographer?: string;
			[key: string]: any;
		};
		categories: Category[];
		heroImages?: Photo[];
		[key: string]: any;
	}
}

export {};
