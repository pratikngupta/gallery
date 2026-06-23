<script>
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import { galleryData, getTotalPhotoCount } from '$lib/stores/gallery.js';

	const categories = galleryData.categories;
	const totalPhotos = getTotalPhotoCount();
</script>

<svelte:head>
	<title>Gallery | All Collections</title>
	<meta name="description" content="Browse all photography collections — landscapes, buildings, and wildlife." />
	
	<!-- Open Graph Tags -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Gallery | Pratik Gupta" />
	<meta property="og:description" content="Browse all photography collections — landscapes, buildings, and wildlife." />
	<meta property="og:url" content="https://pratikngupta.github.io/gallery/gallery" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://pratikngupta.github.io/gallery/gallery" />
</svelte:head>

<div class="gallery-page">
	<div class="page-header">
		<div class="container">
			<nav class="breadcrumb" aria-label="Breadcrumb">
				<a href="/">Home</a>
				<span class="separator">/</span>
				<span class="current">Gallery</span>
			</nav>
			<p class="section-label">// all collections</p>
			<h1 class="page-title">Gallery</h1>
			<p class="page-subtitle">{totalPhotos} photographs across {categories.length} collections</p>
		</div>
	</div>

	<div class="container">
		<div class="gallery-grid">
			{#each categories as category, i}
				<div class="card-wrapper" style="animation-delay: {i * 150}ms">
					<CategoryCard {category} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.gallery-page {
		padding-top: 80px;
	}

	.page-header {
		padding: 60px 0 40px;
		background: linear-gradient(180deg, rgba(20, 20, 30, 0.4) 0%, transparent 100%);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		font-size: 0.85rem;
		font-family: 'JetBrains Mono', monospace;
	}

	.breadcrumb a {
		color: #8a8a8e;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.breadcrumb a:hover {
		color: #4fd1c5;
	}

	.separator {
		color: #8a8a8e;
		opacity: 0.5;
	}

	.current {
		color: #e8e6e1;
	}

	.section-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: #4fd1c5;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 12px;
	}

	.page-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		color: #e8e6e1;
		margin-bottom: 12px;
		font-weight: 400;
	}

	.page-subtitle {
		color: #8a8a8e;
		font-size: 1rem;
		font-weight: 300;
		font-family: 'JetBrains Mono', monospace;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 24px;
		padding: 40px 0 100px;
	}

	.card-wrapper {
		animation: fadeInUp 0.8s ease-out both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
