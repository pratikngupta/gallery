<script>
	import { fly, fade } from 'svelte/transition';

	let { title, subtitle, backgroundImages = [], allPhotos = [] } = $props();

	let mounted = $state(false);

	// Duplicate images to fill the wall if there are too few
	let wallImages = $derived.by(() => {
		const source = allPhotos.length > 8 ? allPhotos.map(p => p.src) : backgroundImages;
		let repeated = [];
		while (repeated.length < 24) {
			repeated = [...repeated, ...source];
		}
		return repeated.slice(0, 24);
	});

	$effect(() => {
		mounted = true;
	});
</script>

<section class="hero-wall-section">
	<div class="wall-background">
		<div class="wall-grid">
			{#each wallImages as img, i}
				<div 
					class="wall-item" 
					style="background-image: url({img}); animation-delay: -{i * 1.5}s;"
				></div>
			{/each}
		</div>
		<div class="wall-gradient-overlay"></div>
	</div>

	<div class="hero-content">
		{#if mounted}
			<div class="glass-card" in:fly={{ y: 30, duration: 1000, delay: 200 }}>
				<div class="hero-code-line">
					<span class="code-comment">// option c: dynamic gallery wall</span>
				</div>
				<h1 class="hero-title">
					{title}
				</h1>
				<p class="hero-subtitle">
					{subtitle}
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.hero-wall-section {
		position: relative;
		width: 100%;
		height: 100vh;
		min-height: 600px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #050508;
	}

	.wall-background {
		position: absolute;
		inset: 0;
		z-index: 1;
		overflow: hidden;
	}

	.wall-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 20px;
		width: 150vw;
		height: 150vh;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-8deg) scale(1.2);
		opacity: 0.85;
		animation: panGrid 40s linear infinite alternate;
	}

	@keyframes panGrid {
		0% { transform: translate(-55%, -55%) rotate(-8deg) scale(1.2); }
		100% { transform: translate(-45%, -45%) rotate(-8deg) scale(1.2); }
	}

	.wall-item {
		background-size: cover;
		background-position: center;
		border-radius: 12px;
		aspect-ratio: 3/4;
		opacity: 0.9;
		transition: opacity 0.5s ease;
		animation: floatItem 8s ease-in-out infinite alternate;
	}

	.wall-item:nth-child(even) {
		aspect-ratio: 4/3;
	}

	.wall-item:nth-child(3n) {
		aspect-ratio: 1/1;
	}

	@keyframes floatItem {
		0% { transform: translateY(0); opacity: 0.5; }
		100% { transform: translateY(-15px); opacity: 1; }
	}

	.wall-gradient-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.85) 100%);
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		width: 100%;
		padding: 0 24px;
		display: flex;
		justify-content: center;
	}

	.glass-card {
		background: rgba(20, 20, 25, 0.4);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 24px;
		padding: 60px 48px;
		text-align: center;
		max-width: 800px;
		box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.hero-code-line {
		margin-bottom: 1.5rem;
	}

	.code-comment {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.75rem, 1.2vw, 0.9rem);
		color: #4fd1c5;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.9;
	}

	.hero-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 700;
		color: #e8e6e1;
		line-height: 1.1;
		margin: 0 0 1.5rem 0;
		letter-spacing: -0.02em;
	}

	.hero-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: clamp(0.95rem, 1.8vw, 1.15rem);
		font-weight: 300;
		color: #c8c8cc;
		line-height: 1.7;
		margin: 0;
		max-width: 500px;
		margin-inline: auto;
	}

	@media (max-width: 768px) {
		.glass-card {
			padding: 40px 24px;
		}
		.wall-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
