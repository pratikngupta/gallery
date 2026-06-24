<script>
	import { onMount } from 'svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import { galleryData, getTotalPhotoCount } from '$lib/stores/gallery.js';

	const categories = galleryData.categories;
	const totalPhotos = getTotalPhotoCount();
	const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
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
	<!-- Header -->
	<div class="page-header">
		<div class="dot-pattern"></div>
		<div class="container">
			<h1 class="page-title" class:visible={mounted}>Gallery</h1>

			<!-- Stats Bar -->
			<div class="stats-bar" class:visible={mounted}>
				<div class="stat">
					<span class="stat-value">{totalPhotos}</span>
					<span class="stat-label">photographs</span>
				</div>
				<span class="stat-divider"></span>
				<div class="stat">
					<span class="stat-value">{categories.length}</span>
					<span class="stat-label">collections</span>
				</div>
				<span class="stat-divider"></span>
				<div class="stat">
					<span class="stat-value">{totalSubcategories}</span>
					<span class="stat-label">subcategories</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Cards -->
	<div class="container">
		<div class="gallery-grid">
			{#each categories as category, i}
				<div
					class="card-wrapper"
					class:featured={i === 0}
					class:visible={mounted}
					style="transition-delay: {(i + 1) * 120}ms"
				>
					<CategoryCard {category} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.gallery-page {
		padding-top: 80px;
		min-height: 100vh;
	}

	/* ---- Header ---- */
	.page-header {
		position: relative;
		padding: 72px 0 48px;
		overflow: hidden;
	}

	.dot-pattern {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(var(--color-text-muted) 0.5px, transparent 0.5px);
		background-size: 24px 24px;
		opacity: 0.15;
		pointer-events: none;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
		position: relative;
		z-index: 1;
	}

	.page-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(3rem, 6vw, 4.5rem);
		color: var(--color-text-primary);
		margin-bottom: 28px;
		font-weight: 400;
		letter-spacing: -0.02em;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	.page-title.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ---- Stats Bar ---- */
	.stats-bar {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 16px 24px;
		background: var(--color-surface-glass);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		width: fit-content;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
	}

	.stats-bar.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.stat-value {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-accent);
	}

	.stat-label {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		font-weight: 400;
		text-transform: lowercase;
	}

	.stat-divider {
		width: 1px;
		height: 20px;
		background: var(--color-border);
	}

	/* ---- Gallery Grid ---- */
	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		padding: 48px 0 100px;
	}

	.card-wrapper {
		opacity: 0;
		transform: translateY(32px);
		transition: opacity 0.7s ease, transform 0.7s ease;
	}

	.card-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Featured first card spans full width */
	.card-wrapper.featured {
		grid-column: 1 / -1;
	}

	/* Make featured card taller */
	.card-wrapper.featured :global(.category-card) {
		min-height: 520px;
	}

	@media (max-width: 768px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.card-wrapper.featured :global(.category-card) {
			min-height: 380px;
		}

		.stats-bar {
			gap: 14px;
			padding: 12px 18px;
			flex-wrap: wrap;
		}

		.stat-value {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 480px) {
		.page-header {
			padding: 48px 0 32px;
		}

		.stats-bar {
			width: 100%;
			justify-content: center;
		}
	}
</style>
