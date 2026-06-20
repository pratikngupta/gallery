<script>
	let { subcategories, activeId = 'all', onchange } = $props();

	let totalPhotos = $derived(
		subcategories.reduce((sum, sub) => sum + (sub.photos?.length ?? 0), 0)
	);
</script>

<div class="filter-container">
	<div class="filter-scroll">
		<button
			class="filter-chip"
			class:active={activeId === 'all'}
			onclick={() => onchange?.('all')}
		>
			All
			<span class="chip-count">{totalPhotos}</span>
		</button>
		{#each subcategories as sub}
			<button
				class="filter-chip"
				class:active={activeId === sub.id}
				onclick={() => onchange?.(sub.id)}
			>
				{sub.name}
				<span class="chip-count">{sub.photos?.length ?? 0}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.filter-container {
		width: 100%;
		overflow: hidden;
	}

	.filter-scroll {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		padding: 0.5rem 0;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.filter-scroll::-webkit-scrollbar {
		display: none;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1.25rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: #8a8a8e;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		font-weight: 400;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.3s ease;
		flex-shrink: 0;
	}

	.filter-chip:hover:not(.active) {
		background: rgba(79, 209, 197, 0.08);
		color: #e8e6e1;
		border-color: rgba(79, 209, 197, 0.3);
	}

	.filter-chip.active {
		background: rgba(79, 209, 197, 0.15);
		color: #4fd1c5;
		border-color: #4fd1c5;
		font-weight: 500;
	}

	.chip-count {
		font-size: 0.7rem;
		font-weight: 500;
		opacity: 0.7;
		min-width: 1.25rem;
		text-align: center;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.15);
	}

	.filter-chip.active .chip-count {
		background: rgba(0, 0, 0, 0.2);
		opacity: 0.85;
	}
</style>
