<script>
	import { fade, fly } from 'svelte/transition';

	let { photos, currentIndex = 0, onclose } = $props();

	let internalIndex = $state(currentIndex);
	$effect(() => {
		internalIndex = currentIndex;
	});
	let direction = $state(1);
	let touchStartX = $state(0);
	let touchEndX = $state(0);

	let currentPhoto = $derived(photos[internalIndex]);
	let counter = $derived(`${internalIndex + 1} / ${photos.length}`);
	let hasPrev = $derived(internalIndex > 0);
	let hasNext = $derived(internalIndex < photos.length - 1);

	function goNext() {
		if (hasNext) {
			direction = 1;
			internalIndex++;
		}
	}

	function goPrev() {
		if (hasPrev) {
			direction = -1;
			internalIndex--;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'ArrowRight') goNext();
		else if (e.key === 'ArrowLeft') goPrev();
		else if (e.key === 'Escape') onclose?.();
	}

	function handleTouchStart(e) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e) {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 60) {
			if (diff > 0) goNext();
			else goPrev();
		}
	}

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			onclose?.();
		}
	}

	$effect(() => {
		document.addEventListener('keydown', handleKeydown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

<div
	class="lightbox-overlay"
	role="dialog"
	aria-modal="true"
	aria-label="Photo viewer"
	tabindex="-1"
	onclick={handleBackdropClick}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBackdropClick(e); }}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	transition:fade={{ duration: 250 }}
>
	<button class="close-btn" onclick={() => onclose?.()} aria-label="Close lightbox">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	</button>

	<div class="counter">{counter}</div>

	{#if hasPrev}
		<button class="nav-btn nav-prev" onclick={goPrev} aria-label="Previous photo">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>
	{/if}

	{#if hasNext}
		<button class="nav-btn nav-next" onclick={goNext} aria-label="Next photo">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	{/if}

	<div class="image-container">
		{#key internalIndex}
			<img
				src={currentPhoto.src}
				alt={currentPhoto.title || 'Photo'}
				class="lightbox-image"
				in:fly={{ x: direction * 60, duration: 350, delay: 50 }}
				out:fade={{ duration: 150 }}
			/>
		{/key}
	</div>

	<div class="info-panel">
		{#key internalIndex}
			<div class="info-content" in:fly={{ y: 10, duration: 350, delay: 150 }}>
				{#if currentPhoto.title}
					<h3 class="info-title">{currentPhoto.title}</h3>
				{/if}
				<div class="info-meta">
					{#if currentPhoto.location}
						<span class="info-location">📍 {currentPhoto.location}</span>
					{/if}
					{#if currentPhoto.date}
						<span class="info-date">{currentPhoto.date}</span>
					{/if}
				</div>
				{#if currentPhoto.description}
					<p class="info-description">{currentPhoto.description}</p>
				{/if}
			</div>
		{/key}
	</div>
</div>

<style>
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		z-index: 2000;
		background-color: rgba(0, 0, 0, 0.95);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.close-btn {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 10;
		width: 44px;
		height: 44px;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: #f0ece2;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: rotate(90deg);
	}

	.counter {
		position: absolute;
		top: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: #a0998e;
		letter-spacing: 0.1em;
		z-index: 10;
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		width: 48px;
		height: 48px;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: #f0ece2;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.nav-btn:hover {
		background: rgba(255, 255, 255, 0.18);
	}

	.nav-prev {
		left: 1.25rem;
	}

	.nav-prev:hover {
		transform: translateY(-50%) translateX(-2px);
	}

	.nav-next {
		right: 1.25rem;
	}

	.nav-next:hover {
		transform: translateY(-50%) translateX(2px);
	}

	.image-container {
		position: relative;
		max-width: 90vw;
		max-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-image {
		max-width: 90vw;
		max-height: 70vh;
		object-fit: contain;
		border-radius: 4px;
	}

	.info-panel {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1.5rem 2rem 2rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
		text-align: center;
	}

	.info-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.info-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		font-weight: 600;
		color: #f0ece2;
		margin: 0 0 0.5rem 0;
	}

	.info-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.info-location,
	.info-date {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: #a0998e;
	}

	.info-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 300;
		color: #a0998e;
		line-height: 1.6;
		margin: 0.25rem 0 0 0;
	}

	@media (max-width: 768px) {
		.nav-btn {
			width: 40px;
			height: 40px;
		}

		.nav-prev {
			left: 0.75rem;
		}

		.nav-next {
			right: 0.75rem;
		}

		.image-container {
			max-height: 60vh;
		}

		.lightbox-image {
			max-height: 60vh;
		}

		.info-panel {
			padding: 1rem 1.5rem 1.5rem;
		}

		.info-title {
			font-size: 1.1rem;
		}
	}
</style>
