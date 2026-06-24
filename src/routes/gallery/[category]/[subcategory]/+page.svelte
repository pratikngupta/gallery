<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import { getCategory, getSubcategory } from '$lib/stores/gallery.js';

	const categoryId = $derived(page.params.category);
	const subcategoryId = $derived(page.params.subcategory);
	const category = $derived(getCategory(categoryId));
	const subcategory = $derived(getSubcategory(categoryId, subcategoryId));

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	{#if subcategory && category}
		<title>{subcategory.name} — {category.name} | Gallery</title>
		<meta name="description" content="Browse {subcategory.photos.length} {subcategory.name} photographs in the {category.name} collection." />
	{/if}
</svelte:head>

{#if subcategory && category}
	<div class="subcategory-page">
		<!-- Header -->
		<div class="page-header">
			<div class="dot-pattern"></div>
			<div class="container">
				<div class="header-content" class:visible={mounted}>
					<h1 class="page-title">{subcategory.name}</h1>
					<div class="header-meta">
						<span class="photo-badge">
							<span class="badge-bracket">{"{"}</span>
							<span class="badge-count">{subcategory.photos.length}</span>
							<span class="badge-bracket">{"}"}</span>
							<span class="badge-label">photograph{subcategory.photos.length !== 1 ? 's' : ''}</span>
						</span>
						<span class="meta-divider"></span>
						<span class="category-link">
							<a href="/gallery/{categoryId}">{category.name}</a>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Photo Grid -->
		<div class="container">
			<div class="grid-section" class:visible={mounted}>
				<PhotoGrid photos={subcategory.photos} />
			</div>

			<!-- Back Link -->
			<div class="back-section" class:visible={mounted}>
				<a href="/gallery/{categoryId}" class="back-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					Back to {category.name}
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="not-found">
		<div class="container">
			<h1>Not Found</h1>
			<p>This subcategory doesn't exist.</p>
			<a href="/gallery" class="back-link">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
				Back to Gallery
			</a>
		</div>
	</div>
{/if}

<style>
	.subcategory-page {
		padding-top: 80px;
		min-height: 100vh;
	}

	/* ---- Header ---- */
	.page-header {
		position: relative;
		padding: 64px 0 48px;
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

	.header-content {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	.header-content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.page-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		color: var(--color-text-primary);
		margin-bottom: 20px;
		font-weight: 400;
		letter-spacing: -0.02em;
	}

	/* ---- Header Meta ---- */
	.header-meta {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	.photo-badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		background: var(--color-accent-subtle);
		border: 1px solid var(--color-border-accent);
		padding: 0.4em 0.85em;
		border-radius: 999px;
		letter-spacing: 0.05em;
	}

	.badge-bracket {
		color: var(--color-accent);
		opacity: 0.8;
	}

	.badge-count {
		color: var(--color-accent);
		font-weight: 600;
	}

	.badge-label {
		color: var(--color-text-secondary);
		margin-left: 0.15em;
	}

	.meta-divider {
		width: 1px;
		height: 18px;
		background: var(--color-border);
	}

	.category-link a {
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.category-link a:hover {
		color: var(--color-accent);
	}

	/* ---- Grid ---- */
	.grid-section {
		padding: 40px 0 60px;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
	}

	.grid-section.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ---- Back Link ---- */
	.back-section {
		padding-bottom: 80px;
		opacity: 0;
		transition: opacity 0.6s ease 0.4s;
	}

	.back-section.visible {
		opacity: 1;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 24px;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-glass);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: var(--color-text-secondary);
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		font-weight: 400;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.back-link:hover {
		color: var(--color-accent);
		border-color: var(--color-border-accent);
		background: var(--color-accent-subtle);
		transform: translateX(-4px);
	}

	/* ---- Not Found ---- */
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
		color: var(--color-text-secondary);
		margin-bottom: 32px;
	}

	.not-found .back-link {
		margin: 0 auto;
	}

	@media (max-width: 480px) {
		.page-header {
			padding: 48px 0 32px;
		}
	}
</style>
