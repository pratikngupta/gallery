<script>
	// A responsive Masonry layout component for Svelte 5
	import { onMount } from 'svelte';

	let { 
		items = [], 
		minColWidth = 300, 
		gap = 16, 
		children 
	} = $props();

	let containerWidth = $state(0);
	
	// Calculate number of columns based on container width and minimum column width
	let numCols = $derived(
		Math.max(1, Math.floor((containerWidth + gap) / (minColWidth + gap))) || 1
	);

	// Distribute items into columns left-to-right
	let columns = $derived(() => {
		const cols = Array.from({ length: numCols }, () => []);
		items.forEach((item, i) => {
			cols[i % numCols].push({ item, originalIndex: i });
		});
		return cols;
	});
</script>

<div 
	class="masonry-container" 
	bind:clientWidth={containerWidth} 
	style="--gap: {gap}px;"
>
	{#if containerWidth > 0}
		{#each columns() as col}
			<div class="masonry-column">
				{#each col as { item, originalIndex }}
					<div class="masonry-item">
						{@render children({ item, index: originalIndex })}
					</div>
				{/each}
			</div>
		{/each}
	{:else}
		<!-- SSR fallback or before hydration: render all items in a single column so they are visible -->
		<div class="masonry-column">
			{#each items as item, index}
				<div class="masonry-item">
					{@render children({ item, index })}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.masonry-container {
		display: flex;
		align-items: flex-start;
		gap: var(--gap, 16px);
		width: 100%;
	}

	.masonry-column {
		display: flex;
		flex-direction: column;
		gap: var(--gap, 16px);
		flex: 1;
		min-width: 0; /* Prevents flex items from overflowing */
	}

	.masonry-item {
		width: 100%;
	}
</style>
