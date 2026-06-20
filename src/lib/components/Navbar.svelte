<script>
	import { onMount } from 'svelte';
	let scrolled = $state(false);
	let mobileOpen = $state(false);
	let currentTheme = $state('dark');

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Gallery', href: '/gallery' },
		{ label: 'About', href: '/about' }
	];

	$effect(() => {
		function handleScroll() {
			scrolled = window.scrollY > 50;
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	onMount(() => {
		// Initialize theme from document
		currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
	});

	function toggleTheme() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', currentTheme);
		localStorage.setItem('gallery-theme', currentTheme);
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<nav class="navbar" class:scrolled>
	<div class="navbar-inner">
		<a href="/" class="logo">
			<span class="logo-bracket">&lt;</span><span class="logo-text">PG</span>
			<span class="logo-bracket">&nbsp;/&gt;</span>
		</a>

		<ul class="nav-links">
			{#each navLinks as link}
				<li>
					<a href={link.href} class="nav-link">{link.label}</a>
				</li>
			{/each}
		</ul>

		<div class="nav-actions">
			<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
				{#if currentTheme === 'dark'}
					<!-- Sun icon -->
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>
				{:else}
					<!-- Moon icon -->
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
				{/if}
			</button>

			<button
				class="hamburger"
				class:open={mobileOpen}
				onclick={toggleMobile}
				aria-label="Toggle menu"
			>
				<span class="bar bar-1"></span>
				<span class="bar bar-2"></span>
				<span class="bar bar-3"></span>
			</button>
		</div>

	</div>
</nav>

{#if mobileOpen}
	<div class="mobile-backdrop" onclick={closeMobile} role="presentation"></div>
{/if}

<div class="mobile-menu" class:open={mobileOpen}>
	<div class="mobile-menu-header">
		<span class="mobile-logo">
			<span class="logo-bracket">&lt;</span><span class="logo-text">PG</span>
			<span class="logo-bracket">&nbsp;/&gt;</span>
		</span>
	</div>
	<ul>
		{#each navLinks as link, i}
			<li style="transition-delay: {mobileOpen ? (i + 1) * 80 : 0}ms;">
				<a href={link.href} class="mobile-link" onclick={closeMobile}>
					<span class="mobile-link-index code-accent">{String(i).padStart(2, '0')}</span>
					<span class="mobile-link-label">{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="mobile-menu-footer">
		<span class="code-accent mobile-footer-text">// navigate</span>
	</div>
</div>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: background-color 0.4s ease, backdrop-filter 0.4s ease,
			box-shadow 0.4s ease, border-color 0.4s ease;
		background-color: transparent;
		border-bottom: 1px solid transparent;
	}

	.navbar.scrolled {
		background-color: rgba(10, 10, 15, 0.85);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border-bottom-color: rgba(79, 209, 197, 0.08);
		box-shadow: 0 1px 30px rgba(79, 209, 197, 0.04);
	}

	.navbar-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1.25rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* Logo: <PG /> */
	.logo {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.35rem;
		font-weight: 500;
		color: #e8e6e1;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
	}

	.logo:hover {
		filter: drop-shadow(0 0 8px rgba(79, 209, 197, 0.3));
	}

	.logo-bracket {
		color: #4fd1c5;
		transition: color 0.3s ease;
	}

	.logo:hover .logo-bracket {
		color: #81e6d9;
	}

	.logo-text {
		color: #e8e6e1;
	}

	/* Nav links */
	.nav-links {
		display: flex;
		list-style: none;
		gap: 2.5rem;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		font-weight: 400;
		color: #8a8a8e;
		text-decoration: none;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		transition: color 0.3s ease;
		position: relative;
		padding-bottom: 4px;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 1.5px;
		background: linear-gradient(90deg, #4fd1c5, #81e6d9);
		transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 1px;
	}

	.nav-link:hover {
		color: #e8e6e1;
	}

	.nav-link:hover::after {
		width: 100%;
	}

	/* Nav Actions */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: #e8e6e1;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.05);
	}

	.theme-toggle:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #4fd1c5;
		transform: scale(1.05);
	}

	.theme-toggle svg {
		width: 18px;
		height: 18px;
	}

	:global([data-theme="light"]) .theme-toggle {
		color: #1a202c;
		background: rgba(0, 0, 0, 0.05);
	}

	:global([data-theme="light"]) .theme-toggle:hover {
		background: rgba(0, 0, 0, 0.1);
		color: #319795;
	}

	:global([data-theme="light"]) .logo {
		color: #1a202c;
	}

	:global([data-theme="light"]) .logo-text {
		color: #1a202c;
	}

	:global([data-theme="light"]) .logo-bracket {
		color: #319795;
	}

	:global([data-theme="light"]) .navbar.scrolled {
		background-color: rgba(255, 255, 255, 0.85);
		border-bottom-color: rgba(0, 0, 0, 0.08);
		box-shadow: 0 1px 30px rgba(0, 0, 0, 0.04);
	}

	:global([data-theme="light"]) .mobile-menu {
		background-color: rgba(255, 255, 255, 0.97);
		border-left-color: rgba(0, 0, 0, 0.08);
	}

	:global([data-theme="light"]) .nav-link {
		color: #4a5568;
	}

	:global([data-theme="light"]) .nav-link:hover {
		color: #1a202c;
	}

	:global([data-theme="light"]) .bar {
		background-color: #1a202c;
	}

	:global([data-theme="light"]) .hamburger.open .bar {
		background-color: #319795;
	}

	/* Hamburger */
	.hamburger {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		width: 32px;
		height: 24px;
		position: relative;
		z-index: 1100;
	}

	.bar {
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		height: 1.5px;
		background-color: #e8e6e1;
		border-radius: 2px;
		transition: transform 0.35s ease, opacity 0.25s ease, background-color 0.3s ease;
	}

	.bar-1 {
		top: 0;
		width: 100%;
	}

	.bar-2 {
		top: 50%;
		transform: translateY(-50%);
		width: 70%;
	}

	.bar-3 {
		bottom: 0;
		width: 85%;
	}

	.hamburger.open .bar {
		background-color: #4fd1c5;
	}

	.hamburger.open .bar-1 {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
		width: 100%;
	}

	.hamburger.open .bar-2 {
		opacity: 0;
	}

	.hamburger.open .bar-3 {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
		width: 100%;
	}

	/* Mobile backdrop */
	.mobile-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	/* Mobile menu panel */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 320px;
		max-width: 85vw;
		background-color: rgba(10, 10, 15, 0.97);
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
		border-left: 1px solid rgba(79, 209, 197, 0.08);
		z-index: 1050;
		transform: translateX(100%);
		transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 3rem 2.5rem;
	}

	.mobile-menu.open {
		transform: translateX(0);
	}

	.mobile-menu-header {
		position: absolute;
		top: 2rem;
		left: 2.5rem;
	}

	.mobile-logo {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.1rem;
		font-weight: 500;
	}

	.mobile-menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	.mobile-menu li {
		margin-bottom: 0.5rem;
		opacity: 0;
		transform: translateX(20px);
		transition: opacity 0.4s ease, transform 0.4s ease;
	}

	.mobile-menu.open li {
		opacity: 1;
		transform: translateX(0);
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		text-decoration: none;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		transition: all 0.3s ease;
	}

	.mobile-link:hover {
		padding-left: 0.5rem;
		border-bottom-color: rgba(79, 209, 197, 0.15);
	}

	.mobile-link-index {
		font-size: 0.7rem;
		color: #4fd1c5;
		opacity: 0.5;
	}

	.mobile-link-label {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		color: #e8e6e1;
		font-weight: 400;
		transition: color 0.3s ease;
	}

	.mobile-link:hover .mobile-link-label {
		color: #4fd1c5;
	}

	.mobile-menu-footer {
		position: absolute;
		bottom: 2rem;
		left: 2.5rem;
	}

	.mobile-footer-text {
		font-size: 0.7rem;
		color: #5a5a5e;
		letter-spacing: 0.1em;
	}

	.code-accent {
		font-family: 'JetBrains Mono', monospace;
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.hamburger {
			display: block;
		}

		.navbar-inner {
			padding: 1rem 1.5rem;
		}
	}
</style>
