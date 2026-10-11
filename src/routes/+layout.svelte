<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initGalleryData } from '$lib/stores/gallery.js';

	let { data, children } = $props();
	
	// Initialize store with server data
	initGalleryData((() => data.gallery)());
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#0a0a0f" />
	<link rel="canonical" href="https://gallery-rho-two.vercel.app/" />
	<meta name="robots" content="index, follow" />
	<meta name="format-detection" content="telephone=no" />
</svelte:head>

<header>
	<Navbar />
</header>
<main id="main">
	{@render children()}
</main>
<Footer />

<style>
	main {
		min-height: 100vh;
	}
</style>
