<script>
	let { category } = $props();

	let photoCount = $derived(
		category.subcategories
			? category.subcategories.reduce((sum, sub) => sum + (sub.photos?.length ?? 0), 0)
			: 0
	);

	let isHovered = $state(false);
</script>

<a
	href="/gallery/{category.id}"
	class="category-card"
	data-sveltekit-prefetch="viewport"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<!-- Gradient border effect -->
	<div class="card-border"></div>

	<div class="card-image" style="background-image: url({category.cover});"></div>
	<div class="card-overlay"></div>

	<!-- Dot pattern overlay on hover -->
	<div class="card-dots"></div>

	<div class="card-content">
		<div class="card-meta">
			<span class="photo-count">
				<span class="count-bracket">{`{`}</span>
				<span class="count-number">{photoCount}</span>
				<span class="count-bracket">{`}`}</span>
				<span class="count-label">photos</span>
			</span>
		</div>
		<h3 class="card-title">{category.name}</h3>
		<p class="card-description">{category.description}</p>
	</div>

	<!-- Corner accent -->
	<div class="card-corner">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1">
			<polyline points="1,6 1,1 6,1"></polyline>
		</svg>
	</div>
</a>

<style>
	.category-card {
		position: relative;
		display: block;
		min-height: 420px;
		border-radius: 16px;
		overflow: hidden;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.55s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.category-card:hover {
		transform: scale(1.02);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
			0 0 40px rgba(79, 209, 197, 0.08);
	}

	/* Gradient border effect */
	.card-border {
		position: absolute;
		inset: 0;
		border-radius: 16px;
		padding: 1px;
		background: linear-gradient(
			135deg,
			rgba(79, 209, 197, 0.5),
			transparent 40%,
			transparent 60%,
			rgba(212, 165, 116, 0.3)
		);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
		z-index: 3;
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.category-card:hover .card-border {
		opacity: 1;
	}

	.card-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1),
			filter 0.65s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.category-card:hover .card-image {
		transform: scale(1.08);
		filter: brightness(1.1) saturate(1.1);
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(10, 10, 15, 0.95) 0%,
			rgba(10, 10, 15, 0.6) 35%,
			rgba(10, 10, 15, 0.1) 65%,
			transparent 100%
		);
		transition: background 0.5s ease;
	}

	.category-card:hover .card-overlay {
		background: linear-gradient(
			to top,
			rgba(10, 10, 15, 0.9) 0%,
			rgba(10, 10, 15, 0.4) 35%,
			rgba(10, 10, 15, 0.05) 65%,
			transparent 100%
		);
	}

	/* Subtle dot pattern on hover */
	.card-dots {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			circle,
			rgba(79, 209, 197, 0.04) 1px,
			transparent 1px
		);
		background-size: 20px 20px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.5s ease;
		z-index: 1;
	}

	.category-card:hover .card-dots {
		opacity: 1;
	}

	.card-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2rem;
		z-index: 2;
	}

	.card-meta {
		margin-bottom: 0.75rem;
	}

	/* Photo count: { 42 } photos */
	.photo-count {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		background: rgba(79, 209, 197, 0.12);
		border: 1px solid rgba(79, 209, 197, 0.2);
		padding: 0.3em 0.7em;
		border-radius: 999px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.count-bracket {
		color: #4fd1c5;
		opacity: 0.6;
	}

	.count-number {
		color: #4fd1c5;
		font-weight: 500;
	}

	.count-label {
		color: #8a8a8e;
		margin-left: 0.15em;
	}

	.card-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #e8e6e1;
		margin: 0.25rem 0 0.75rem 0;
		line-height: 1.2;
		transition: color 0.3s ease;
	}

	.category-card:hover .card-title {
		color: #fff;
	}

	.card-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 300;
		color: #8a8a8e;
		line-height: 1.65;
		margin: 0;
		max-height: 0;
		overflow: hidden;
		opacity: 0;
		transform: translateY(8px);
		transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.45s ease 0.05s,
			transform 0.45s ease 0.05s;
	}

	.category-card:hover .card-description {
		max-height: 80px;
		opacity: 1;
		transform: translateY(0);
	}

	/* Corner accent */
	.card-corner {
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		z-index: 2;
		color: rgba(79, 209, 197, 0.25);
		opacity: 0;
		transform: translate(-4px, -4px);
		transition: opacity 0.4s ease, transform 0.4s ease;
	}

	.category-card:hover .card-corner {
		opacity: 1;
		transform: translate(0, 0);
	}

	@media (max-width: 768px) {
		.category-card {
			min-height: 320px;
		}

		.card-title {
			font-size: 1.4rem;
		}

		.card-content {
			padding: 1.5rem;
		}

		.card-description {
			max-height: none;
			opacity: 1;
			transform: translateY(0);
		}

		.card-corner {
			display: none;
		}
	}
</style>
