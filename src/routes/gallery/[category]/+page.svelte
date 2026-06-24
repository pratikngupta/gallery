<script>
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import SubcategoryFilter from '$lib/components/SubcategoryFilter.svelte';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import { getCategory } from '$lib/stores/gallery.js';

	const categoryId = $derived(page.params.category);
	const category = $derived(getCategory(categoryId));
	
	let activeSubcategory = $state('all');

	const allPhotos = $derived(
		category ? category.subcategories.flatMap(sub =>
			sub.photos.map(p => ({ ...p, subcategoryId: sub.id, subcategoryName: sub.name }))
		) : []
	);

	const filteredPhotos = $derived(
		activeSubcategory === 'all'
			? allPhotos
			: allPhotos.filter(p => p.subcategoryId === activeSubcategory)
	);

	function handleFilterChange(id) {
		activeSubcategory = id;
	}

	// Reset filter when category changes
	$effect(() => {
		categoryId;
		activeSubcategory = 'all';
	});
</script>

<svelte:head>
	{#if category}
		<title>{category.name} | Gallery</title>
		<meta name="description" content="{category.description} — Browse {allPhotos.length} photographs." />
	{/if}
</svelte:head>

{#if category}
	<div class="category-page">
		<!-- Category Header -->
		<div class="page-header">
			<div class="container">
				<nav class="breadcrumb" aria-label="Breadcrumb" in:fly={{ y: 20, duration: 700, delay: 100 }}>
					<a href="/">Home</a>
					<span class="separator">›</span>
					<a href="/gallery">Gallery</a>
					<span class="separator">›</span>
					<span class="current">{category.name}</span>
				</nav>
				<div class="hero-code-line" in:fly={{ y: 20, duration: 700, delay: 200 }}>
					<span class="code-comment">// {category.id}</span>
				</div>
				<h1 class="hero-title" in:fly={{ y: 40, duration: 900, delay: 300 }}>{category.name}</h1>
				<p class="hero-description" in:fly={{ y: 30, duration: 900, delay: 500 }}>{category.description}</p>
			</div>
		</div>

		<!-- Filter + Grid -->
		<div class="container">
			<div class="filter-section">
				<SubcategoryFilter
					subcategories={category.subcategories}
					activeId={activeSubcategory}
					onchange={handleFilterChange}
				/>
			</div>

			<div class="grid-section">
				{#key activeSubcategory}
					<PhotoGrid photos={filteredPhotos} />
				{/key}
			</div>
		</div>
	</div>
{:else}
	<div class="not-found">
		<div class="container">
			<h1>Category Not Found</h1>
			<p>The category you're looking for doesn't exist.</p>
			<a href="/gallery" class="btn btn-primary">Back to Gallery</a>
		</div>
	</div>
{/if}

<style>
	.category-page {
		padding-top: 100px;
	}

	.page-header {
		text-align: center;
		padding: 60px 0;
		margin-bottom: 40px;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		margin-bottom: 40px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.breadcrumb a {
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb .current {
		color: var(--color-text-primary);
	}

	.breadcrumb .separator {
		color: rgba(255, 255, 255, 0.2);
	}

	.hero-code-line {
		margin-bottom: 12px;
	}

	.code-comment {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.hero-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 6vw, 4rem);
		margin-bottom: 12px;
		font-weight: 400;
	}

	.hero-description {
		color: var(--color-accent);
		font-size: 1.2rem;
		margin-bottom: 8px;
		font-weight: 300;
		font-style: italic;
	}

	.hero-count {
		color: var(--color-text-secondary);
		font-size: 0.85rem;
		font-family: 'JetBrains Mono', monospace;
	}

	.filter-section {
		padding: 32px 0 16px;
		position: sticky;
		top: 70px;
		z-index: 10;
		background: linear-gradient(180deg, var(--color-bg-primary) 60%, transparent 100%);
	}

	.grid-section {
		padding-bottom: 100px;
	}

	.not-found {
		padding: 200px 0;
		text-align: center;
	}

	.not-found h1 {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		color: #e8e6e1;
		margin-bottom: 16px;
	}

	.not-found p {
		color: #8a8a8e;
		margin-bottom: 32px;
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.filter-section {
			top: 60px;
		}
	}
</style>
