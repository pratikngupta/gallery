<script>
	let currentYear = $derived(new Date().getFullYear());

	const quickLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Gallery', href: '/gallery' },
		{ label: 'About', href: '/about' }
	];

	const socialLinks = [
		{
			label: 'GitHub',
			href: 'https://github.com/pratikngupta',
			icon: 'github'
		},
		{
			label: 'LinkedIn',
			href: 'https://linkedin.com/in/pratikngupta',
			icon: 'linkedin'
		},
		{
			label: 'Instagram',
			href: 'https://instagram.com/pratikngupta',
			icon: 'instagram'
		},
		{
			label: 'Email',
			href: 'mailto:hello@pratikgupta.dev',
			icon: 'email'
		}
	];
</script>

<footer class="footer dot-pattern">
	<div class="footer-gradient-border"></div>

	<div class="footer-inner">
		<div class="footer-grid">
			<!-- Left column: Logo + tagline -->
			<div class="footer-col footer-brand">
				<a href="/" class="footer-logo">
					<span class="bracket">&lt;</span><span class="logo-text">PG</span><span class="bracket">&nbsp;/&gt;</span>
				</a>
				<p class="footer-tagline">Software engineer who sees the world<br />through code and a camera lens.</p>
			</div>

			<!-- Center column: Quick links -->
			<div class="footer-col footer-links-col">
				<span class="footer-col-label section-label">Navigate</span>
				<ul class="footer-nav">
					{#each quickLinks as link}
						<li>
							<a href={link.href} class="footer-link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Right column: Social links -->
			<div class="footer-col footer-social-col">
				<span class="footer-col-label section-label">Connect</span>
				<div class="footer-socials">
					{#each socialLinks as link}
						<a
							href={link.href}
							class="social-link"
							aria-label={link.label}
							target="_blank"
							rel="noopener noreferrer"
						>
							{#if link.icon === 'github'}
								<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
							{:else if link.icon === 'linkedin'}
								<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
							{:else if link.icon === 'instagram'}
								<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
								</svg>
							{:else if link.icon === 'email'}
								<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
									<rect x="2" y="4" width="20" height="16" rx="2"></rect>
									<polyline points="22,4 12,13 2,4"></polyline>
								</svg>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="footer-bottom">
			<p class="copyright">© {currentYear} Pratik Gupta. All rights reserved.</p>
			<p class="built-with">
				<span class="code-line">Engineered with</span>
				<span class="code-tag">&lt;code /&gt;</span>
				<span class="code-line">&amp;</span>
				<span class="heart">♥</span>
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		background: var(--color-bg-secondary);
	}

	.footer-gradient-border {
		height: 1px;
		background: linear-gradient(
			to right,
			transparent 0%,
			rgba(79, 209, 197, 0.4) 20%,
			rgba(79, 209, 197, 0.6) 50%,
			rgba(79, 209, 197, 0.4) 80%,
			transparent 100%
		);
	}

	.footer-inner {
		position: relative;
		z-index: 1;
		max-width: 1400px;
		margin: 0 auto;
		padding: 3.5rem 2rem 2rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr 1fr;
		gap: 3rem;
		margin-bottom: 3rem;
	}

	.footer-col {
		display: flex;
		flex-direction: column;
	}

	/* Logo */
	.footer-logo {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.2rem;
		font-weight: 500;
		color: #e8e6e1;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: all 0.3s ease;
		margin-bottom: 1rem;
		width: fit-content;
	}

	.footer-logo:hover {
		filter: drop-shadow(0 0 8px rgba(var(--color-accent-rgb), 0.3));
	}

	.bracket {
		color: var(--color-accent);
	}

	.logo-text {
		color: var(--color-text-primary);
	}

	.footer-tagline {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin: 0;
	}

	/* Column labels */
	.footer-col-label {
		margin-bottom: 1.25rem;
		font-size: 0.65rem;
	}

	/* Quick links */
	.footer-nav {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.footer-link {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.3s ease, padding-left 0.3s ease;
		display: inline-block;
	}

	.footer-link:hover {
		color: var(--color-accent);
		padding-left: 4px;
	}

	/* Social links */
	.footer-socials {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.social-link:hover {
		color: var(--color-accent);
		border-color: rgba(var(--color-accent-rgb), 0.3);
		background: rgba(var(--color-accent-rgb), 0.08);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(var(--color-accent-rgb), 0.15);
	}

	/* Bottom bar */
	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.04);
	}

	.copyright {
		font-family: 'Inter', sans-serif;
		font-size: 0.72rem;
		color: var(--color-text-muted);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.built-with {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.68rem;
		color: var(--color-text-muted);
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
	}

	.code-tag {
		color: var(--color-accent);
		opacity: 0.7;
	}

	.code-line {
		color: var(--color-text-muted);
	}

	.heart {
		color: var(--color-secondary);
		font-size: 0.8rem;
	}

	.dot-pattern {
		position: relative;
	}

	.section-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #4fd1c5;
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
	}

	.section-label::before {
		content: '//';
		opacity: 0.6;
	}

	@media (max-width: 768px) {
		.footer-inner {
			padding: 2.5rem 1.5rem 1.5rem;
		}

		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-bottom: 2rem;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 0.75rem;
			text-align: center;
		}
	}
</style>
