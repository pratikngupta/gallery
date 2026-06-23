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
	<link rel="canonical" href="https://pratikgupta.dev" />
	<meta name="robots" content="index, follow" />
	<meta name="format-detection" content="telephone=no" />
	
	<!-- Performance: DNS prefetch for external services -->
	<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
	<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
	
	<!-- Font Preloading for Optimal Performance -->
	<!-- Preconnect to font services -->
	<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	
	<!-- Load fonts with display=swap for non-blocking rendering -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />
	
	<!-- Fallback for font loading -->
	<noscript>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />
	</noscript>
</svelte:head>

<Navbar />
<main id="main">
	{@render children()}
</main>
<Footer />

<style>
	main {
		min-height: 100vh;
	}
</style>
