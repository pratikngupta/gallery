<script>
	let { photos = [], speed = 40, direction = 'left', onclick } = $props();

	// We duplicate the photos array to create a seamless infinite loop.
	let marqueeItems = $derived([...photos, ...photos]);
</script>

<div 
	class="marquee-container" 
	style="--marquee-speed: {speed}s; --marquee-direction: {direction === 'left' ? 'normal' : 'reverse'};"
>
	<div class="marquee-track">
		{#each marqueeItems as photo, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div 
				class="marquee-item"
				onclick={() => onclick?.(i % photos.length)}
			>
				<img src={photo.src} alt={photo.title || 'Gallery image'} loading="lazy" />
				<div class="marquee-overlay">
					{#if photo.title}
						<span class="marquee-title">{photo.title}</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.marquee-container {
		width: 100%;
		overflow: hidden;
		position: relative;
		padding: 40px 0;
		/* Gradient masks for fading edges */
		-webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
	}

	.marquee-track {
		display: inline-flex;
		gap: 24px;
		/* The track translates left by exactly half its width (minus half a gap) */
		animation: marquee-scroll var(--marquee-speed) linear infinite var(--marquee-direction);
		will-change: transform;
	}

	.marquee-track:hover {
		animation-play-state: paused;
	}

	.marquee-item {
		flex: 0 0 auto;
		width: 340px;
		height: 240px;
		border-radius: 16px;
		overflow: hidden;
		position: relative;
		cursor: pointer;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
	}

	.marquee-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.marquee-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
		opacity: 0;
		transition: opacity 0.3s ease;
		display: flex;
		align-items: flex-end;
		padding: 1.5rem;
	}

	.marquee-title {
		color: #fff;
		font-family: 'Playfair Display', serif;
		font-size: 1.1rem;
		transform: translateY(10px);
		transition: transform 0.3s ease;
	}

	/* Hover Effects */
	.marquee-item:hover {
		transform: scale(1.05);
		z-index: 2;
	}

	.marquee-item:hover img {
		transform: scale(1.1);
	}

	.marquee-item:hover .marquee-overlay {
		opacity: 1;
	}

	.marquee-item:hover .marquee-title {
		transform: translateY(0);
	}

	/* Dim all other items when one is hovered */
	.marquee-track:hover .marquee-item:not(:hover) {
		filter: brightness(0.4) saturate(0.5);
	}

	@keyframes marquee-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-50% - 12px));
		}
	}

	@media (max-width: 768px) {
		.marquee-item {
			width: 240px;
			height: 160px;
		}
	}
</style>
