<script>
	import { onMount } from 'svelte';

	let { 
		title = "Curated Series", 
		subtitle = "Selected frames from across collections", 
		photos = [], 
		onclick 
	} = $props();

	let scrollContainer = $state(null);
	let currentIndex = $state(0);
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	function updateScrollState() {
		if (!scrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
		canScrollLeft = scrollLeft > 10;
		canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;

		// Calculate active index based on scroll position and child item widths
		const items = scrollContainer.querySelectorAll('.carousel-item');
		if (items.length > 0) {
			let closestIdx = 0;
			let minDiff = Infinity;
			items.forEach((item, idx) => {
				const itemLeft = item.offsetLeft - scrollContainer.offsetLeft;
				const diff = Math.abs(itemLeft - scrollLeft);
				if (diff < minDiff) {
					minDiff = diff;
					closestIdx = idx;
				}
			});
			currentIndex = closestIdx;
		}
	}

	function scrollToItem(index) {
		if (!scrollContainer) return;
		const items = scrollContainer.querySelectorAll('.carousel-item');
		if (items[index]) {
			items[index].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			});
		}
	}

	function scrollPrev() {
		if (currentIndex > 0) {
			scrollToItem(currentIndex - 1);
		}
	}

	function scrollNext() {
		if (currentIndex < photos.length - 1) {
			scrollToItem(currentIndex + 1);
		}
	}

	function handleKeydown(e) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			scrollPrev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			scrollNext();
		}
	}

	onMount(() => {
		updateScrollState();
		const el = scrollContainer;
		if (el) {
			el.addEventListener('scroll', updateScrollState, { passive: true });
			window.addEventListener('resize', updateScrollState, { passive: true });
		}
		return () => {
			if (el) el.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', updateScrollState);
		};
	});
</script>

<section 
	class="curated-section" 
	aria-roledescription="carousel" 
	aria-label={title}
>
	<div class="container curated-header-wrap">
		<div class="curated-title-group">
			<span class="section-label">curated series</span>
			<h2 class="section-title">{title}</h2>
			<p class="section-subtitle">{subtitle}</p>
		</div>

		<!-- Discoverable Controls and Indicator -->
		<div class="curated-controls">
			<span class="curated-hint" aria-hidden="true">
				<span class="hint-arrow">←</span> Swipe or click arrows <span class="hint-arrow">→</span>
			</span>
			<div class="counter-badge" aria-live="polite">
				<span class="counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
				<span class="counter-slash">/</span>
				<span class="counter-total">{String(photos.length).padStart(2, '0')}</span>
			</div>
			<div class="nav-buttons">
				<button 
					type="button"
					class="nav-arrow-btn" 
					onclick={scrollPrev}
					disabled={!canScrollLeft}
					aria-label="Previous photograph"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>
				<button 
					type="button"
					class="nav-arrow-btn" 
					onclick={scrollNext}
					disabled={!canScrollRight}
					aria-label="Next photograph"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Carousel Track with Partial Next-Image Preview -->
	<div 
		class="carousel-track-wrapper"
		bind:this={scrollContainer}
		role="region"
		aria-label="Curated photographs carousel"
	>
		<div class="carousel-track">
			{#each photos as photo, i}
				<div 
					class="carousel-item"
					class:active={i === currentIndex}
					role="button"
					tabindex="0"
					aria-label="{photo.title ? 'View photograph: ' + photo.title : 'View curated photograph'} ({i + 1} of {photos.length})"
					onclick={() => onclick?.(i)}
					onkeydown={(e) => { 
						if (e.key === 'Enter' || e.key === ' ') { 
							e.preventDefault(); 
							onclick?.(i); 
						} 
					}}
				>
					<div class="carousel-img-wrap">
						<img 
							src={photo.srcWebp || photo.src} 
							srcset={photo.srcsetWebp || undefined}
							sizes="(max-width: 600px) 85vw, (max-width: 1024px) 65vw, 680px"
							width={photo.width || 800}
							height={photo.height || 533}
							style="aspect-ratio: {photo.width || 800} / {photo.height || 533};"
							alt={photo.title || 'Curated Photo'} 
							loading="lazy"
							decoding="async" 
							class="carousel-image"
						/>
						<div class="carousel-overlay">
							<div class="carousel-info">
								{#if photo.title}
									<span class="carousel-item-title">{photo.title}</span>
								{/if}
								{#if photo.location}
									<span class="carousel-item-location">📍 {photo.location}</span>
								{/if}
							</div>
							<span class="view-pill">View Fullscreen</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Pagination Indicator Dots -->
	<div class="carousel-indicators" role="tablist" aria-label="Curated series slides">
		{#each photos as _, i}
			<button 
				type="button"
				class="indicator-dot" 
				class:active={i === currentIndex}
				onclick={() => scrollToItem(i)}
				role="tab"
				aria-selected={i === currentIndex}
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	.curated-section {
		padding: 80px 0 100px;
		background: var(--color-bg-primary);
		position: relative;
		overflow: hidden;
	}

	.curated-header-wrap {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 36px;
		flex-wrap: wrap;
		gap: 24px;
	}

	.curated-title-group {
		max-width: 600px;
	}

	.curated-controls {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.curated-hint {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		display: flex;
		align-items: center;
		gap: 6px;
		letter-spacing: 0.03em;
		opacity: 0.85;
	}

	.hint-arrow {
		color: var(--color-accent);
		font-weight: 600;
	}

	.counter-badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		padding: 6px 14px;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		border-radius: 999px;
		color: var(--color-text-primary);
		display: inline-flex;
		align-items: center;
		gap: 4px;
		letter-spacing: 0.05em;
	}

	.counter-current {
		font-weight: 600;
		color: var(--color-accent);
	}

	.counter-slash {
		color: var(--color-text-secondary);
		opacity: 0.5;
	}

	.counter-total {
		color: var(--color-text-secondary);
	}

	.nav-buttons {
		display: flex;
		gap: 8px;
	}

	.nav-arrow-btn {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nav-arrow-btn:hover:not(:disabled) {
		background: var(--color-accent);
		color: var(--color-text-inverse);
		border-color: var(--color-accent);
		transform: translateY(-1px);
	}

	.nav-arrow-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.nav-arrow-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* ---- Carousel Track ---- */
	.carousel-track-wrapper {
		width: 100%;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none; /* Hide scrollbar for sleek look */
		padding: 10px 0 20px;
	}

	.carousel-track-wrapper::-webkit-scrollbar {
		display: none;
	}

	.carousel-track-wrapper:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
	}

	.carousel-track {
		display: flex;
		gap: 24px;
		/* Padding aligns first card with container, allows partial preview of next */
		padding: 0 calc(max(24px, (100vw - 1200px) / 2));
		width: max-content;
	}

	.carousel-item {
		/* Responsive width ensuring the next image is visibly peeking out */
		width: min(72vw, 680px);
		flex: 0 0 auto;
		scroll-snap-align: start;
		border-radius: 16px;
		overflow: hidden;
		cursor: pointer;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.carousel-item:hover,
	.carousel-item:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
		border-color: var(--color-border-accent);
	}

	.carousel-item:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.carousel-img-wrap {
		position: relative;
		width: 100%;
		overflow: hidden;
		line-height: 0;
	}

	.carousel-image {
		width: 100%;
		height: auto;
		max-height: 60vh;
		object-fit: cover;
		display: block;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.carousel-item:hover .carousel-image {
		transform: scale(1.03);
	}

	.carousel-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 24px 28px;
		opacity: 0.9;
		transition: opacity 0.3s ease;
	}

	.carousel-item:hover .carousel-overlay {
		opacity: 1;
	}

	.carousel-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.carousel-item-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.4rem;
		font-weight: 600;
		color: #ffffff;
		line-height: 1.2;
	}

	.carousel-item-location {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.8);
		letter-spacing: 0.02em;
	}

	.view-pill {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		padding: 5px 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: #ffffff;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
		border: 1px solid rgba(255, 255, 255, 0.25);
	}

	/* ---- Pagination Dots ---- */
	.carousel-indicators {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		margin-top: 24px;
	}

	.indicator-dot {
		position: relative;
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--color-border);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.indicator-dot::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 32px;
		height: 32px;
	}

	.indicator-dot:hover {
		background: var(--color-text-secondary);
	}

	.indicator-dot.active {
		width: 24px;
		background: var(--color-accent);
	}

	@media (max-width: 768px) {
		.curated-section {
			padding: 60px 0 80px;
		}

		.curated-header-wrap {
			margin-bottom: 24px;
		}

		.curated-hint {
			display: none; /* Keep clean on small mobile screens */
		}

		.carousel-item {
			width: 84vw;
		}

		.carousel-image {
			max-height: 48vh;
		}

		.carousel-overlay {
			padding: 16px 20px;
		}

		.carousel-item-title {
			font-size: 1.15rem;
		}

		.view-pill {
			display: none;
		}
	}
</style>
