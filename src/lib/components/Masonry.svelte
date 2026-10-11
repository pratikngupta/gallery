<script>
	// Responsive CSS-column Masonry for Svelte 5
	// Zero Layout Shift (CLS = 0) during SSR and hydration
	let { 
		items = [], 
		children 
	} = $props();
</script>

<div class="masonry-grid">
	{#each items as item, index}
		<div class="masonry-item">
			{@render children({ item, index })}
		</div>
	{/each}
</div>

<style>
	.masonry-grid {
		column-count: 1;
		column-gap: 20px;
		width: 100%;
	}

	@media (min-width: 640px) {
		.masonry-grid {
			column-count: 2;
			column-gap: 24px;
		}
	}

	@media (min-width: 1024px) {
		.masonry-grid {
			column-count: 3;
			column-gap: 24px;
		}
	}

	@media (min-width: 1440px) {
		.masonry-grid {
			column-count: 4;
			column-gap: 28px;
		}
	}

	.masonry-item {
		break-inside: avoid;
		margin-bottom: 24px;
		display: inline-block;
		width: 100%;
	}
</style>
