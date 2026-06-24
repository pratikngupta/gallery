<script>
	import { onMount } from 'svelte';
	let { title = "Curated Series", subtitle = "Swipe through selected works", photos = [], isHero = false, onclick } = $props();

	let sectionEl = $state();
	let trackEl = $state();
	let scrollProgress = $state(0);
	let trackWidth = $state(0);
	let windowWidth = $state(0);

	onMount(() => {
		const updateDimensions = () => {
			if (trackEl) trackWidth = trackEl.scrollWidth;
			windowWidth = window.innerWidth;
		};

		const handleScroll = () => {
			if (!sectionEl) return;
			const rect = sectionEl.getBoundingClientRect();
			// The total distance we can scroll within the section
			const totalScroll = rect.height - window.innerHeight;
			
			if (totalScroll <= 0) return;

			// Calculate progress from 0 to 1 as the section scrolls through the viewport
			let progress = -rect.top / totalScroll;
			progress = Math.max(0, Math.min(1, progress));
			scrollProgress = progress;
		};

		// Initial setup
		setTimeout(updateDimensions, 100);
		handleScroll();

		window.addEventListener('resize', updateDimensions);
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('resize', updateDimensions);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Calculate the actual pixel translation
	let translateX = $derived(scrollProgress * Math.max(0, trackWidth - windowWidth + (windowWidth * 0.1))); // adding a bit of buffer
</script>

<div class="hs-section" class:is-hero={isHero} bind:this={sectionEl}>
	<div class="hs-sticky">
		<div class="hs-header">
			<span class="hs-label">// {isHero ? 'home' : 'cinematic scroll'}</span>
			<h2 class="hs-title">{title}</h2>
			<p class="hs-subtitle">{subtitle}</p>
		</div>
		
		<div 
			class="hs-track" 
			bind:this={trackEl} 
			style="transform: translate3d(-{translateX}px, 0, 0);"
		>
			{#each photos as photo, i}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="hs-item" onclick={() => onclick?.(i)}>
					<img src={photo.src || photo} alt={photo.title || 'Curated Photo'} loading="lazy" />
					<div class="hs-overlay">
						{#if photo.title}
							<span class="hs-item-title">{photo.title}</span>
						{/if}
						{#if photo.location}
							<span class="hs-item-location">{photo.location}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.hs-section {
		/* The height determines how long it takes to scroll through. 
		   350vh means it takes 2.5 full screen scrolls to get from start to end */
		height: 350vh; 
		position: relative;
		background: var(--color-bg-primary);
		margin: 100px 0;
	}

	.hs-section.is-hero {
		margin-top: 0;
	}

	.hs-sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.hs-header {
		padding: 0 5vw;
		margin-bottom: 40px;
		transform: translateY(-20px);
	}

	.hs-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		display: block;
		margin-bottom: 12px;
	}

	.hs-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		color: var(--color-text-primary);
		margin: 0 0 10px 0;
		line-height: 1.1;
	}

	.hs-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: 1.1rem;
		color: var(--color-text-secondary);
		font-weight: 300;
		margin: 0;
	}

	.hs-track {
		display: flex;
		gap: 6vw;
		padding: 0 5vw;
		width: max-content;
		will-change: transform;
		transition: transform 0.1s ease-out; /* Smooths out scroll wheel steps */
	}

	.hs-item {
		height: 70vh;
		width: auto;
		flex: 0 0 auto;
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		cursor: pointer;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
		transition: transform 0.4s ease, filter 0.4s ease;
	}

	.hs-item img {
		height: 100%;
		width: auto;
		object-fit: contain;
		display: block;
		transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.hs-item:hover img {
		transform: scale(1.05);
	}

	.hs-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 3rem;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.hs-item:hover .hs-overlay {
		opacity: 1;
	}

	.hs-item-title {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		color: #fff;
		margin-bottom: 8px;
		transform: translateY(20px);
		transition: transform 0.4s ease;
	}

	.hs-item-location {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.9rem;
		color: #a0998e;
		letter-spacing: 0.05em;
		transform: translateY(20px);
		transition: transform 0.4s ease 0.05s;
	}

	.hs-item:hover .hs-item-title,
	.hs-item:hover .hs-item-location {
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.hs-item {
			height: 50vh;
		}
		.hs-header {
			margin-bottom: 24px;
		}
		.hs-overlay {
			padding: 2rem;
			opacity: 1; /* Always show text on mobile */
			background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
		}
		.hs-item-title, .hs-item-location {
			transform: translateY(0);
		}
	}
</style>
