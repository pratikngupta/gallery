<script>
	let { photos = [], onclick } = $props();
</script>

<div class="bento-grid">
	{#each photos as photo, i}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="bento-item bento-{i % 6}"
			onclick={() => onclick?.(i)}
		>
			<img src={photo.src} alt={photo.title || 'Featured Photograph'} loading="lazy" />
			<div class="bento-overlay">
				<span class="bento-title">{photo.title || ''}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.bento-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-auto-rows: 280px;
		gap: 20px;
		width: 100%;
	}

	.bento-item {
		position: relative;
		border-radius: 20px;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
		background: var(--color-bg-secondary);
	}

	.bento-item:hover {
		transform: translateY(-8px);
		box-shadow: var(--shadow-xl, 0 20px 40px rgba(0, 0, 0, 0.4));
		z-index: 2;
	}

	.bento-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.bento-item:hover img {
		transform: scale(1.05);
	}

	.bento-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
		opacity: 0;
		transition: opacity 0.3s ease;
		display: flex;
		align-items: flex-end;
		padding: 2rem;
	}

	.bento-title {
		color: #fff;
		font-family: 'Playfair Display', serif;
		font-size: 1.4rem;
		transform: translateY(15px);
		transition: transform 0.3s ease;
	}

	.bento-item:hover .bento-overlay {
		opacity: 1;
	}

	.bento-item:hover .bento-title {
		transform: translateY(0);
	}

	/* Asymmetric layout classes (pattern repeats every 6 items) */
	.bento-0 { grid-column: span 2; grid-row: span 2; }
	.bento-1 { grid-column: span 2; grid-row: span 1; }
	.bento-2 { grid-column: span 1; grid-row: span 1; }
	.bento-3 { grid-column: span 1; grid-row: span 1; }
	.bento-4 { grid-column: span 2; grid-row: span 1; }
	.bento-5 { grid-column: span 2; grid-row: span 1; }

	@media (max-width: 1024px) {
		.bento-grid {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 240px;
		}
		.bento-0 { grid-column: span 2; grid-row: span 2; }
		.bento-1 { grid-column: span 2; grid-row: span 1; }
		.bento-2 { grid-column: span 1; grid-row: span 1; }
		.bento-3 { grid-column: span 1; grid-row: span 1; }
		.bento-4 { grid-column: span 2; grid-row: span 1; }
		.bento-5 { grid-column: span 2; grid-row: span 1; }
	}

	@media (max-width: 600px) {
		.bento-grid {
			grid-template-columns: 1fr;
			grid-auto-rows: 300px;
		}
		.bento-item { grid-column: span 1 !important; grid-row: span 1 !important; }
	}
</style>
