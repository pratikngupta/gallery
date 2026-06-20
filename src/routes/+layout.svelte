<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initGalleryData } from '$lib/stores/gallery.js';

	let { data, children } = $props();
	
	// Initialize store with server data
	initGalleryData(data.gallery);
</script>

<Navbar />
<main>
	{@render children()}
</main>
<Footer />

<style>
	main {
		min-height: 100vh;
	}
</style>
