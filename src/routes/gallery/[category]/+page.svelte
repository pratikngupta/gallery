<script>
	import { page } from '$app/state';
	import SubcategoryFilter from '$lib/components/SubcategoryFilter.svelte';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import { getCategory, galleryData } from '$lib/stores/gallery.js';

	const categoryId = $derived(page.params.category);
	const category = $derived(getCategory(categoryId));
	const allCategories = $derived(galleryData.categories);
	
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
		<title>{category.name} | Collections | Pratik Gupta</title>
		<meta name="description" content="{category.description} — Browse {allPhotos.length} photographs." />
		<link rel="canonical" href="https://gallery-rho-two.vercel.app/gallery/{categoryId}" />
		<meta property="og:title" content="{category.name} | Collections" />
		<meta property="og:description" content="{category.description}" />
		<meta property="og:url" content="https://gallery-rho-two.vercel.app/gallery/{categoryId}" />
	{/if}
</svelte:head>

{#if category}
	<div class="category-page">
		<!-- Collection Header & Navigation -->
		<div class="page-header">
			<div class="dot-pattern" aria-hidden="true"></div>
			<div class="container">
				<!-- Intuitive Navigation Back -->
				<div class="nav-breadcrumbs">
					<a href="/gallery" class="back-link">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						All Collections
					</a>
					<span class="crumb-separator" aria-hidden="true">/</span>
					<span class="current-crumb">{category.name}</span>
				</div>

				<div class="header-main">
					<div class="header-text-group">
						<h1 class="hero-title">{category.name}</h1>
						<p class="hero-description">{category.description}</p>
					</div>

					<div class="photo-count-badge" aria-label="{allPhotos.length} photographs in this collection">
						<span class="count-num">{allPhotos.length}</span>
						<span class="count-lbl">photographs</span>
					</div>
				</div>

				<!-- Collection Switcher -->
				<div class="collection-nav-bar">
					<span class="nav-label">Collections:</span>
					<div class="collection-pills" role="navigation" aria-label="Switch collection">
						{#each allCategories as cat}
							<a 
								href="/gallery/{cat.id}" 
								class="collection-pill" 
								class:active={cat.id === categoryId}
								aria-current={cat.id === categoryId ? 'page' : undefined}
							>
								{cat.name}
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Filter + Gallery Grid -->
		<div class="container">
			{#if category.subcategories && category.subcategories.length > 1}
				<div class="filter-section">
					<SubcategoryFilter
						subcategories={category.subcategories}
						activeId={activeSubcategory}
						onchange={handleFilterChange}
					/>
				</div>
			{/if}

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
			<h1>Collection Not Found</h1>
			<p>The collection you're looking for doesn't exist.</p>
			<a href="/gallery" class="btn btn-primary">Back to All Collections</a>
		</div>
	</div>
{/if}

<style>
	.category-page {
		padding-top: calc(var(--nav-height, 72px) + 20px);
		min-height: 100vh;
	}

	.page-header {
		position: relative;
		padding: 40px 0 36px;
		margin-bottom: 24px;
		background: var(--color-bg-primary);
		border-bottom: 1px solid var(--color-border);
		overflow: hidden;
	}

	.dot-pattern {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(var(--color-text-muted) 0.5px, transparent 0.5px);
		background-size: 24px 24px;
		opacity: 0.12;
		pointer-events: none;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
		position: relative;
		z-index: 1;
	}

	/* ---- Breadcrumbs ---- */
	.nav-breadcrumbs {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 24px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-accent);
	}

	.crumb-separator {
		color: var(--color-border);
	}

	.current-crumb {
		color: var(--color-accent);
		font-weight: 500;
	}

	/* ---- Header Main ---- */
	.header-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		flex-wrap: wrap;
		margin-bottom: 28px;
	}

	.header-text-group {
		max-width: 700px;
	}

	.hero-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.4rem, 5vw, 3.8rem);
		margin-bottom: 12px;
		font-weight: 400;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
		line-height: 1.15;
	}

	.hero-description {
		font-family: 'Inter', sans-serif;
		font-size: 1.1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		font-weight: 300;
	}

	.photo-count-badge {
		font-family: 'JetBrains Mono', monospace;
		padding: 10px 18px;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		border-radius: 999px;
		display: inline-flex;
		align-items: baseline;
		gap: 6px;
		letter-spacing: 0.05em;
	}

	.count-num {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-accent);
	}

	.count-lbl {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
	}

	/* ---- Collection Navigation Pills ---- */
	.collection-nav-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 16px;
		border-top: 1px solid var(--color-border);
		flex-wrap: wrap;
	}

	.nav-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.collection-pills {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.collection-pill {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.collection-pill:hover {
		color: var(--color-text-primary);
		border-color: var(--color-border-accent);
		background: var(--color-bg-secondary);
	}

	.collection-pill.active {
		color: var(--color-text-inverse);
		background: var(--color-accent);
		border-color: var(--color-accent);
		font-weight: 500;
	}

	/* ---- Filter & Grid ---- */
	.filter-section {
		padding: 24px 0 16px;
		position: sticky;
		top: var(--nav-height, 72px);
		z-index: 10;
		background: linear-gradient(180deg, var(--color-bg-primary) 70%, transparent 100%);
	}

	.grid-section {
		padding-bottom: 100px;
	}

	.not-found {
		padding: 160px 0;
		text-align: center;
	}

	.not-found h1 {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		color: var(--color-text-primary);
		margin-bottom: 16px;
	}

	.not-found p {
		color: var(--color-text-secondary);
		margin-bottom: 32px;
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.header-main {
			flex-direction: column;
		}

		.photo-count-badge {
			padding: 6px 14px;
		}

		.filter-section {
			top: 60px;
		}
	}
</style>
