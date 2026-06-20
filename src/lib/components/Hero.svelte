<script>
	import { fly, fade } from 'svelte/transition';

	let { title, subtitle, backgroundImages = [], backgroundImage, showScrollIndicator = true } = $props();

	let scrollY = $state(0);
	let mounted = $state(false);
	let activeIndex = $state(0);

	let images = $derived(backgroundImages.length > 0 ? backgroundImages : [backgroundImage].filter(Boolean));

	let overlayOpacity = $derived(Math.min(0.6 + scrollY * 0.001, 0.95));

	$effect(() => {
		mounted = true;

		function handleScroll() {
			scrollY = window.scrollY;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });

		let interval;
		if (images.length > 1) {
			interval = setInterval(() => {
				activeIndex = (activeIndex + 1) % images.length;
			}, 6000);
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (interval) clearInterval(interval);
		};
	});
</script>

<section class="hero">
	{#each images as img, i}
		<div class="hero-slide" class:active={i === activeIndex} style="z-index: {i === activeIndex ? 1 : 0};">
			<div class="hero-blur-layer" style="background-image: url({img});"></div>
			<div class="hero-sharp-layer" style="background-image: url({img});"></div>
		</div>
	{/each}
	<div class="hero-overlay" style="opacity: {overlayOpacity}; z-index: 2;"></div>

	<!-- Subtle dot grid overlay -->
	<div class="hero-grid" style="z-index: 3;"></div>

	<div class="hero-content" style="z-index: 4;">
		{#if mounted}
			<div class="hero-code-line" in:fly={{ y: 20, duration: 700, delay: 100 }}>
				<span class="code-comment">// capturing the world through code & lens</span>
			</div>
			<h1 class="hero-title" in:fly={{ y: 40, duration: 900, delay: 300 }}>
				{title}
			</h1>
			<p class="hero-subtitle" in:fly={{ y: 30, duration: 900, delay: 600 }}>
				{subtitle}
			</p>
		{/if}
	</div>

	{#if showScrollIndicator && mounted}
		<div class="scroll-indicator" style="z-index: 4;" in:fade={{ duration: 800, delay: 1400 }}>
			<span class="scroll-text">scroll</span>
			<div class="scroll-line">
				<div class="scroll-line-inner"></div>
			</div>
		</div>
	{/if}

	<!-- Decorative corner brackets -->
	{#if mounted}
		<div class="corner-decor top-left" style="z-index: 4;" in:fade={{ duration: 600, delay: 1000 }}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
				<polyline points="8,2 2,2 2,8"></polyline>
			</svg>
		</div>
		<div class="corner-decor bottom-right" style="z-index: 4;" in:fade={{ duration: 600, delay: 1100 }}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
				<polyline points="16,22 22,22 22,16"></polyline>
			</svg>
		</div>
	{/if}
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		height: 100vh;
		min-height: 600px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-slide {
		position: absolute;
		inset: 0;
		will-change: opacity;
		opacity: 0;
		transition: opacity 1.5s ease-in-out;
	}

	.hero-slide.active {
		opacity: 1;
	}

	.hero-blur-layer {
		position: absolute;
		inset: -5%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		filter: blur(30px) brightness(0.5);
		z-index: 1;
	}

	.hero-sharp-layer {
		position: absolute;
		inset: 0;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 2;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(10, 10, 15, 0.4) 0%,
			rgba(10, 10, 15, 0.15) 35%,
			rgba(10, 10, 15, 0.4) 65%,
			rgba(10, 10, 15, 0.92) 100%
		);
		will-change: opacity;
	}

	.hero-grid {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			circle,
			rgba(79, 209, 197, 0.03) 1px,
			transparent 1px
		);
		background-size: 32px 32px;
		pointer-events: none;
		z-index: 1;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		padding: 0 2rem;
		max-width: 960px;
	}

	.hero-code-line {
		margin-bottom: 1.5rem;
	}

	.code-comment {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.7rem, 1.2vw, 0.85rem);
		color: #4fd1c5;
		letter-spacing: 0.06em;
		opacity: 0.7;
	}

	.hero-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.8rem, 7vw, 5.5rem);
		font-weight: 700;
		color: #e8e6e1;
		line-height: 1.1;
		margin: 0 0 1.5rem 0;
		letter-spacing: -0.02em;
		text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	.hero-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: clamp(0.95rem, 1.8vw, 1.2rem);
		font-weight: 300;
		color: #e8e6e1;
		line-height: 1.7;
		margin: 0;
		letter-spacing: 0.02em;
		max-width: 600px;
		margin-inline: auto;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
	}

	/* Scroll indicator — pulsing line */
	.scroll-indicator {
		position: absolute;
		bottom: 2.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.scroll-text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem;
		color: #8a8a8e;
		text-transform: uppercase;
		letter-spacing: 0.25em;
	}

	.scroll-line {
		width: 1px;
		height: 48px;
		background: rgba(255, 255, 255, 0.08);
		position: relative;
		overflow: hidden;
		border-radius: 1px;
	}

	.scroll-line-inner {
		position: absolute;
		top: -100%;
		left: 0;
		width: 100%;
		height: 50%;
		background: linear-gradient(to bottom, transparent, #4fd1c5);
		animation: scrollPulse 2s ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0% {
			top: -50%;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}

	/* Corner decorations */
	.corner-decor {
		position: absolute;
		z-index: 2;
		color: rgba(79, 209, 197, 0.2);
	}

	.corner-decor.top-left {
		top: 2rem;
		left: 2rem;
	}

	.corner-decor.bottom-right {
		bottom: 2rem;
		right: 2rem;
	}

	@media (max-width: 768px) {
		.hero {
			min-height: 500px;
		}

		.hero-content {
			padding: 0 1.5rem;
		}

		.hero-code-line {
			margin-bottom: 1rem;
		}

		.corner-decor {
			display: none;
		}

		.scroll-indicator {
			bottom: 2rem;
		}
	}
</style>
