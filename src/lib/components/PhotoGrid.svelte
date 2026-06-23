<script>
	import PhotoCard from './PhotoCard.svelte';
	import Lightbox from './Lightbox.svelte';
	import Masonry from './Masonry.svelte';

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

<div class="photo-grid-wrapper">
	<Masonry items={photos} minColWidth={280} gap={16}>
		{#snippet children({ item: photo, index })}
			<PhotoCard
				{photo}
				{index}
				onclick={() => openLightbox(index)}
			/>
		{/snippet}
	</Masonry>
</div>

{#if lightboxOpen}
	<Lightbox
		{photos}
		currentIndex={selectedPhotoIndex}
		onclose={closeLightbox}
	/>
{/if}

<style>
	.photo-grid-wrapper {
		width: 100%;
		padding: 0;
	}
</style>
