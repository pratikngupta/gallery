<script>
	import { fly, fade } from 'svelte/transition';

	let { title, subtitle, label = "option a: exhibition frame", backgroundImages = [], backgroundImage, header } = $props();

	let mounted = $state(false);
	let activeIndex = $state(0);

	let images = $derived(backgroundImages.length > 0 ? backgroundImages : [backgroundImage].filter(Boolean));

	function nextSlide() {
		activeIndex = (activeIndex + 1) % images.length;
	}

	function prevSlide() {
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	function setSlide(index) {
		activeIndex = index;
	}

	$effect(() => {
		mounted = true;

		let interval;
		if (images.length > 1) {
			interval = setInterval(() => {
				nextSlide();
			}, 6000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<section class="hero-frame-section">
	<div class="hero-header">
		{#if mounted}
			{#if header}
				{@render header()}
			{:else}
				<div class="hero-code-line" in:fly={{ y: 20, duration: 700, delay: 100 }}>
					<span class="code-comment">// {label}</span>
				</div>
				{#if title}
					<h1 class="hero-title" in:fly={{ y: 40, duration: 900, delay: 300 }}>
						{title}
					</h1>
				{/if}
				{#if subtitle}
					<p class="hero-subtitle" in:fly={{ y: 30, duration: 900, delay: 600 }}>
						{subtitle}
					</p>
				{/if}
			{/if}
		{/if}
	</div>

	<div class="frame-container">
		{#if mounted}
			<div class="exhibition-frame" in:fade={{ duration: 1200, delay: 800 }}>
				{#each images as img, i}
					<div
						class="slide-wrapper"
						class:active={i === activeIndex}
						style="z-index: {i === activeIndex ? 1 : 0};"
					>
						<div class="slide-bg" style="background-image: url({img})"></div>
						<div class="frame-img" style="background-image: url({img})"></div>
					</div>
				{/each}

				{#if images.length > 1}
					<div class="frame-controls">
						<button class="ctrl-btn prev" onclick={prevSlide} aria-label="Previous image">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
						</button>
						<button class="ctrl-btn next" onclick={nextSlide} aria-label="Next image">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
						</button>
					</div>

					<div class="frame-indicators">
						{#each images as _, i}
							<button 
								class="indicator-dot" 
								class:active={i === activeIndex}
								onclick={() => setSlide(i)}
								aria-label="Go to slide {i + 1}"
							></button>
						{/each}
					</div>
				{/if}
			</div>
			
			<div class="frame-reflection" in:fade={{ duration: 2000, delay: 1200 }}></div>
		{/if}
	</div>
</section>

<style>
	.hero-frame-section {
		width: 100%;
		min-height: 100vh;
		background: var(--color-bg-primary);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120px 24px 60px;
		position: relative;
		transition: background-color 0.4s ease;
	}

	.hero-header {
		text-align: center;
		margin-bottom: 40px;
		max-width: 800px;
		z-index: 2;
	}

	.hero-code-line {
		margin-bottom: 1rem;
	}

	.code-comment {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.75rem, 1.2vw, 0.9rem);
		color: var(--color-accent);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.hero-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 700;
		color: var(--color-text-primary);
		line-height: 1.1;
		margin: 0 0 1rem 0;
		letter-spacing: -0.02em;
	}

	.hero-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: clamp(0.95rem, 1.8vw, 1.15rem);
		font-weight: 300;
		color: #8a8a8e;
		line-height: 1.7;
		margin: 0;
	}

	.frame-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
		position: relative;
	}

	.exhibition-frame {
		width: 100%;
		max-width: 1400px;
		height: 65vh;
		min-height: 400px;
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--color-border);
		background: var(--color-bg-secondary);
	}

	.frame-reflection {
		display: none;
	}

	.slide-wrapper {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 1s ease-in-out;
	}

	.slide-wrapper.active {
		opacity: 1;
	}

	.slide-bg {
		position: absolute;
		inset: -30px;
		background-size: cover;
		background-position: center;
		filter: blur(20px) brightness(0.3);
	}

	.frame-img {
		position: absolute;
		inset: 0;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* Controls */
	.frame-controls {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24px;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 10;
		pointer-events: none;
	}

	.exhibition-frame:hover .frame-controls {
		opacity: 1;
	}

	.ctrl-btn {
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--color-text-primary);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		pointer-events: auto;
	}

	.ctrl-btn:hover {
		background: rgba(0, 0, 0, 0.7);
	}

	.ctrl-btn svg {
		width: 24px;
		height: 24px;
	}

	.frame-indicators {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		padding: 8px 12px;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.indicator-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		padding: 0;
	}

	.indicator-dot:hover {
		background: rgba(255, 255, 255, 0.6);
	}

	.indicator-dot.active {
		background: var(--color-text-primary);
		transform: scale(1.2);
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 768px) {
		.hero-frame-section {
			padding: 100px 16px 40px;
		}
		.exhibition-frame {
			height: 50vh;
			border-radius: 16px;
		}
	}
</style>
