<script>
	let { photo, index = 0, onclick } = $props();
</script>

<div
	class="photo-card"
	role="button"
	tabindex="0"
	onclick={onclick}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick?.(); } }}
>
	<div class="photo-wrapper">
		<img
			src={photo.src}
			alt={photo.title || 'Photo'}
			loading="lazy"
			class="photo-image"
		/>
		<div class="photo-overlay">
			<div class="photo-info">
				<h4 class="photo-title">{photo.title || ''}</h4>
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
		margin-bottom: 16px;
		cursor: pointer;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
	}

	.photo-wrapper {
		position: relative;
		line-height: 0;
	}

	.photo-image {
		width: 100%;
		height: auto;
		display: block;
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
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.photo-card:hover .photo-overlay {
		transform: translateY(0);
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
		color: #f0ece2;
		margin: 0;
		line-height: 1.3;
	}

	.photo-location {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		color: #a0998e;
		letter-spacing: 0.02em;
	}

	.photo-card:focus-visible {
		outline: 2px solid #d4a574;
		outline-offset: 2px;
	}
</style>
