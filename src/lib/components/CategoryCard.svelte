<script>
	let { category } = $props();

	let photoCount = $derived(
		category.subcategories
			? category.subcategories.reduce((sum, sub) => sum + (sub.photos?.length ?? 0), 0)
			: 0
	);

</script>

<a
	href="/gallery/{category.id}"
	class="category-card"
>
	<img class="card-image" src={category.cover} alt={category.name} loading="lazy" decoding="async" />
	<div class="card-overlay"></div>

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
	}

	.card-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.85) 0%,
			rgba(0, 0, 0, 0.4) 40%,
			transparent 100%
		);
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
		background: var(--color-accent-subtle);
		border: 1px solid var(--color-border-accent);
		padding: 0.3em 0.7em;
		border-radius: 999px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.count-bracket {
		color: var(--color-accent);
		opacity: 0.8;
	}

	.count-number {
		color: var(--color-accent);
		font-weight: 500;
	}

	.count-label {
		color: rgba(255, 255, 255, 0.7);
		margin-left: 0.15em;
	}

	.card-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #ffffff;
		margin: 0.25rem 0 0.75rem 0;
		line-height: 1.2;
		transition: color 0.3s ease;
	}

	.category-card:hover .card-title {
		color: var(--color-accent);
	}

	.card-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.65;
		margin: 0;
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
	}
</style>
