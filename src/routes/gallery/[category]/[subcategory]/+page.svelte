<script>
	import { page } from '$app/state';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import { getCategory, getSubcategory } from '$lib/stores/gallery.js';

	const categoryId = $derived(page.params.category);
	const subcategoryId = $derived(page.params.subcategory);
	const category = $derived(getCategory(categoryId));
	const subcategory = $derived(getSubcategory(categoryId, subcategoryId));
</script>

<svelte:head>
	{#if subcategory && category}
		<title>{subcategory.name} — {category.name} | Gallery</title>
		<meta name="description" content="Browse {subcategory.photos.length} {subcategory.name} photographs in the {category.name} collection." />
	{/if}
</svelte:head>

{#if subcategory && category}
	<div class="subcategory-page">
		<div class="page-header" style="background-image: url('{subcategory.cover}')">
			<div class="header-overlay">
				<div class="container">

					<h1 class="page-title">{subcategory.name}</h1>
					<p class="page-count">{subcategory.photos.length} photograph{subcategory.photos.length !== 1 ? 's' : ''}</p>
				</div>
			</div>
		</div>

		<div class="container">
			<div class="grid-section">
				<PhotoGrid photos={subcategory.photos} />
			</div>

			<div class="back-link">
				<a href="/gallery/{categoryId}" class="btn btn-ghost">
					← Back to {category.name}
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="not-found">
		<div class="container">
			<h1>Not Found</h1>
			<p>This subcategory doesn't exist.</p>
			<a href="/gallery" class="btn btn-primary">Back to Gallery</a>
		</div>
	</div>
{/if}

<style>
	.subcategory-page {
		padding-top: 70px;
	}

	.page-header {
		position: relative;
		min-height: 40vh;
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: flex-end;
	}

	.header-overlay {
		width: 100%;
		padding: 100px 0 50px;
		background: linear-gradient(
			to bottom,
			rgba(10, 10, 15, 0.1) 0%,
			rgba(10, 10, 15, 0.6) 40%,
			rgba(10, 10, 15, 0.95) 100%
		);
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
		flex-wrap: wrap;
		font-family: 'JetBrains Mono', monospace;
	}

	.breadcrumb a {
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.separator {
		color: var(--color-text-secondary);
		opacity: 0.5;
	}

	.current {
		color: var(--color-text-primary);
	}

	.page-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		color: var(--color-text-primary);
		margin-bottom: 8px;
		font-weight: 400;
	}

	.page-count {
		color: var(--color-text-secondary);
		font-size: 0.85rem;
		font-family: 'JetBrains Mono', monospace;
	}

	.grid-section {
		padding: 40px 0 60px;
	}

	.back-link {
		padding-bottom: 80px;
	}

	.not-found {
		padding: 200px 0;
		text-align: center;
	}

	.not-found h1 {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		color: var(--color-text-primary);
		margin-bottom: 16px;
	}

	.not-found p {
		color: #8a8a8e;
		margin-bottom: 32px;
	}
</style>
