<script>
	let { photo, index = 0, loading = 'lazy', onclick } = $props();
</script>

<div
	class="photo-card"
	role="button"
	tabindex="0"
	aria-label="{photo.title ? 'View photo: ' + photo.title : 'View photo'}"
	onclick={onclick}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick?.(); } }}
>
	<div class="photo-wrapper">
		<img
			src={photo.srcWebp || photo.src}
			srcset={photo.srcsetWebp || undefined}
			sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
			width={photo.width || 800}
			height={photo.height || 533}
			style="aspect-ratio: {photo.width || 800} / {photo.height || 533};"
			alt={photo.title || 'Photo'}
			loading={loading}
			decoding="async"
			class="photo-image"
		/>
		<div class="photo-overlay">
			<div class="photo-info">
				<h3 class="photo-title">{photo.title || ''}</h3>
				{#if photo.location}
					<span class="photo-location">📍 {photo.location}</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.photo-card {
		break-inside: avoid;
		margin-bottom: 0;
		cursor: pointer;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border);
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	.photo-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
		border-color: var(--color-border-accent);
	}

	.photo-wrapper {
		position: relative;
		line-height: 0;
		overflow: hidden;
	}

	.photo-image {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.photo-card:hover .photo-image {
		transform: scale(1.03);
	}

	.photo-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1.5rem;
		background: linear-gradient(
			to top,
			rgba(10, 10, 10, 0.9) 0%,
			rgba(10, 10, 10, 0.4) 60%,
			transparent 100%
		);
		transform: translateY(100%);
		transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.photo-card:hover .photo-overlay,
	.photo-card:focus-visible .photo-overlay {
		transform: translateY(0);
	}

	@media (hover: none) {
		.photo-overlay {
			transform: translateY(0);
			padding: 1rem 1.25rem;
			background: linear-gradient(
				to top,
				rgba(10, 10, 10, 0.85) 0%,
				rgba(10, 10, 10, 0.3) 70%,
				transparent 100%
			);
		}
	}

	.photo-info {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.photo-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.05rem;
		font-weight: 600;
		color: white;
		margin: 0;
		line-height: 1.3;
	}

	.photo-location {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.02em;
	}

	.photo-card:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}
</style>
