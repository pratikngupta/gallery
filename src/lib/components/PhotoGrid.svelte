<script>
	import PhotoCard from './PhotoCard.svelte';
	import Lightbox from './Lightbox.svelte';

	let { photos } = $props();

	let selectedPhotoIndex = $state(0);
	let lightboxOpen = $state(false);

	function openLightbox(index) {
		selectedPhotoIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}
</script>

<div class="photo-grid">
	{#each photos as photo, index (photo.src)}
		<PhotoCard
			{photo}
			{index}
			onclick={() => openLightbox(index)}
		/>
	{/each}
</div>

{#if lightboxOpen}
	<Lightbox
		{photos}
		currentIndex={selectedPhotoIndex}
		onclose={closeLightbox}
	/>
{/if}

<style>
	.photo-grid {
		columns: 4;
		column-gap: 16px;
		padding: 0;
	}

	@media (max-width: 1200px) {
		.photo-grid {
			columns: 3;
		}
	}

	@media (max-width: 768px) {
		.photo-grid {
			columns: 2;
		}
	}

	@media (max-width: 480px) {
		.photo-grid {
			columns: 1;
		}
	}
</style>
