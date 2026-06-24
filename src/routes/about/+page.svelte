<script>
	import { galleryData, getTotalPhotoCount } from '$lib/stores/gallery.js';

	const categories = galleryData.categories;
	const totalPhotos = getTotalPhotoCount();
	const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

	const skills = [
		{
			num: '01',
			name: 'Composition',
			description:
				'Finding order in chaos — the rule of thirds, leading lines, negative space. Every frame is a system designed to guide the eye.'
		},
		{
			num: '02',
			name: 'Natural Light',
			description:
				'Chasing golden hours and reading cloud cover like parsing data. The best illumination is never artificial.'
		},
		{
			num: '03',
			name: 'Post Processing',
			description:
				'Minimal, intentional edits. Like clean code: remove what doesn\'t serve the image, enhance what does.'
		},
		{
			num: '04',
			name: 'Patience',
			description:
				'The willingness to wait for the moment — whether a build finishes or a bird lands on the perfect branch.'
		}
	];
</script>

<svelte:head>
	<title>About | Pratik Gupta — Engineer × Photographer</title>
	<meta
		name="description"
		content="About Pratik Gupta — a software engineer and photographer based in Ontario, Canada. The intersection of engineering precision and artistic vision."
	/>
	
	<!-- Open Graph Tags -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="About | Pratik Gupta" />
	<meta property="og:description" content="A software engineer and photographer capturing the world through code and a lens." />
	<meta property="og:url" content="https://pratikngupta.github.io/gallery/about" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://pratikngupta.github.io/gallery/about" />
</svelte:head>

<div class="about-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="container">

			<h1 class="page-title">About Me</h1>
		</div>
	</div>

	<div class="container">
		<div class="about-layout">
			<!-- Main Content -->
			<div class="about-main">
				<!-- Identity Section: Code Bio Card -->
				<section class="about-section">
					<span class="section-label">identity</span>
					<div class="bio-card">
						<div class="bio-header">
							<span class="bio-dot bio-dot-red"></span>
							<span class="bio-dot bio-dot-yellow"></span>
							<span class="bio-dot bio-dot-green"></span>
							<span class="bio-filename">about.ts</span>
						</div>
						<div class="bio-code">
							<div class="code-line">
								<span class="code-keyword">const</span>
								<span class="code-var">aboutMe</span>
								<span class="code-punct">=</span>
								<span class="code-bracket">{'{'}</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">name</span><span class="code-punct">:</span>
								<span class="code-string">'Pratik Gupta'</span><span class="code-punct">,</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">title</span><span class="code-punct">:</span>
								<span class="code-string">'Software Engineering Student & Photographer'</span><span class="code-punct">,</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">focus</span><span class="code-punct">:</span>
								<span class="code-string">'AI, Robotics & Cloud-native Infrastructure'</span><span class="code-punct">,</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">stack</span><span class="code-punct">:</span>
								<span class="code-bracket">[</span><span class="code-string">'Python'</span><span class="code-punct">,</span>
								<span class="code-string">'C++'</span><span class="code-punct">,</span>
								<span class="code-string">'TypeScript'</span><span class="code-bracket">]</span><span class="code-punct">,</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">camera</span><span class="code-punct">:</span>
								<span class="code-string">'Mirrorless'</span><span class="code-punct">,</span>
							</div>
							<div class="code-line code-indent">
								<span class="code-key">subjects</span><span class="code-punct">:</span>
								<span class="code-bracket">[</span><span class="code-string">'Landscapes'</span><span class="code-punct">,</span>
								<span class="code-string">'Architecture'</span><span class="code-punct">,</span>
								<span class="code-string">'Wildlife'</span><span class="code-bracket">]</span>
							</div>
							<div class="code-line">
								<span class="code-bracket">{'}'}</span><span class="code-punct">;</span>
							</div>
						</div>
					</div>
				</section>

				<!-- The Story -->
				<section class="about-section">
					<span class="section-label">the story</span>
					<h2 class="section-heading">Where Precision Meets Vision</h2>
					<p class="story-text">
						As a Software Engineering student at Western University, I spend my days building resilient, high-performance systems at the intersection of AI, robotics, and cloud-native infrastructure. I thrive in deep technical challenges — from PX4 firmware and LoRa telemetry to CNN/Transformer architectures.
					</p>
					<p class="story-text">
						My engineering mindset shapes how I approach a photograph: I debug compositions,
						refactor framing, and optimize for the moment. But the camera demands something code
						never does — surrender to imperfection. The best shots happen when the plan fails
						and the light does something no function could predict.
					</p>
				</section>

				<!-- Two Worlds Section -->
				<section class="about-section">
					<span class="section-label">two worlds</span>
					<div class="worlds-grid">
						<div class="world-card world-engineer">
							<div class="world-icon">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="16 18 22 12 16 6"></polyline>
									<polyline points="8 6 2 12 8 18"></polyline>
								</svg>
							</div>
							<h3 class="world-title">The Engineer</h3>
							<p class="world-text">
								I design and build software systems — whether leading autonomous VTOL mission systems at Western Aero Design or architecting computer vision platforms. I think in types, interfaces, and data flows.
								This analytical lens follows me everywhere, including into the field with a camera.
							</p>
						</div>
						<div class="world-card world-photographer">
							<div class="world-icon">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
									<circle cx="12" cy="13" r="4"></circle>
								</svg>
							</div>
							<h3 class="world-title">The Photographer</h3>
							<p class="world-text">
								Behind the lens, the engineer quiets down and instinct takes over. I chase
								light across landscapes, study the geometry of buildings, and wait — sometimes
								for hours — for a creature to reveal itself. This is where logic meets wonder.
							</p>
						</div>
					</div>
				</section>

				<!-- Skills Grid
				<section class="about-section">
					<span class="section-label">craft</span>
					<h2 class="section-heading">What I Bring to Every Frame</h2>
					<div class="skills-grid">
						{#each skills as skill}
							<div class="skill-card">
								<span class="skill-num">{skill.num}</span>
								<h3 class="skill-name">{skill.name}</h3>
								<p class="skill-desc">{skill.description}</p>
							</div>
						{/each}
					</div>
				</section> -->
			</div>

			<!-- Sidebar -->
			<aside class="about-sidebar">
				<div class="sidebar-card">
					<h3 class="sidebar-heading">Portfolio Stats</h3>
					<div class="stats-list">
						<div class="stat-row">
							<span class="stat-row-label">Photographs</span>
							<span class="stat-row-value">{totalPhotos}</span>
						</div>
						<div class="stat-row">
							<span class="stat-row-label">Collections</span>
							<span class="stat-row-value">{categories.length}</span>
						</div>
						<div class="stat-row">
							<span class="stat-row-label">Categories</span>
							<span class="stat-row-value">{totalSubcategories}</span>
						</div>
					</div>
				</div>

				<div class="sidebar-card">
					<h3 class="sidebar-heading">Subjects</h3>
					<div class="tags">
						{#each categories as cat}
							<a href="/gallery/{cat.id}" class="tag">{cat.name}</a>
							{#each cat.subcategories as sub}
								<a href="/gallery/{cat.id}/{sub.id}" class="tag tag-small">{sub.name}</a>
							{/each}
						{/each}
					</div>
				</div>

				<div class="sidebar-card sidebar-cta">
					<div class="cta-decorator">&lt;/&gt;</div>
					<h3 class="sidebar-heading">Get in Touch</h3>
					<p class="contact-text">
						Interested in prints, licensing, or collaborations? Let's connect.
					</p>
					<a href="mailto:pratikngupta@outlook.com" class="btn btn-primary contact-btn">Contact Me</a>
				</div>
			</aside>
		</div>
	</div>
</div>

<style>
	/* ---- Page Layout ---- */
	.about-page {
		padding-top: 80px;
	}

	.page-header {
		padding: 60px 0 20px;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
	}



	.page-title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		color: var(--color-text-primary);
		font-weight: 400;
	}

	/* ---- Main Layout ---- */
	.about-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 60px;
		padding: 48px 0 120px;
	}

	.about-section {
		margin-bottom: 56px;
	}

	.section-heading {
		font-family: 'Playfair Display', serif;
		font-size: clamp(1.6rem, 3vw, 2rem);
		color: var(--color-text-primary);
		margin-bottom: 24px;
		font-weight: 400;
	}

	/* ---- Bio Card ---- */
	.bio-card {
		background: var(--color-surface-glass-strong);
		border: 1px solid var(--color-border-accent);
		border-radius: 12px;
		overflow: hidden;
		margin-top: 8px;
	}

	.bio-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		background: var(--color-surface-glass);
		border-bottom: 1px solid var(--color-border);
	}

	.bio-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.bio-dot-red {
		background: #ff5f57;
	}

	.bio-dot-yellow {
		background: #febc2e;
	}

	.bio-dot-green {
		background: #28c840;
	}

	.bio-filename {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		margin-left: 8px;
	}

	.bio-code {
		padding: 24px 28px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		line-height: 2;
	}

	.code-line {
		white-space: nowrap;
	}

	.code-indent {
		padding-left: 2em;
	}

	.code-keyword {
		color: var(--color-secondary);
		font-weight: 500;
	}

	.code-var {
		color: var(--color-text-primary);
		margin-left: 0.5em;
	}

	.code-punct {
		color: var(--color-text-secondary);
		margin: 0 0.2em;
	}

	.code-bracket {
		color: var(--color-text-primary);
		margin: 0 0.1em;
	}

	.code-key {
		color: var(--color-accent);
	}

	.code-string {
		color: var(--color-secondary);
	}

	/* ---- Story ---- */
	.story-text {
		color: var(--color-text-secondary);
		font-size: 1.05rem;
		line-height: 1.8;
		margin-bottom: 16px;
		font-weight: 300;
	}

	/* ---- Two Worlds ---- */
	.worlds-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-top: 8px;
	}

	.world-card {
		padding: 32px 28px;
		background: var(--color-surface-glass);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		position: relative;
		overflow: hidden;
		transition: transform 0.3s ease, background 0.3s ease;
	}

	.world-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
	}

	.world-engineer::before {
		background: linear-gradient(90deg, var(--color-accent), var(--color-accent-subtle));
	}

	.world-photographer::before {
		background: linear-gradient(90deg, var(--color-secondary), var(--color-secondary-glow));
	}

	.world-card:hover {
		transform: translateY(-4px);
		background: var(--color-surface-glass-strong);
	}

	.world-icon {
		color: var(--color-text-secondary);
		margin-bottom: 20px;
	}

	.world-engineer .world-icon {
		color: var(--color-accent);
	}

	.world-photographer .world-icon {
		color: var(--color-secondary);
	}

	.world-title {
		font-family: 'Playfair Display', serif;
		color: var(--color-text-primary);
		font-size: 1.2rem;
		margin-bottom: 12px;
		font-weight: 400;
	}

	.world-text {
		color: var(--color-text-secondary);
		font-size: 0.95rem;
		line-height: 1.7;
		font-weight: 300;
	}

	/* ---- Skills Grid ---- */
	.skills-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 8px;
	}

	.skill-card {
		padding: 24px;
		background: var(--color-surface-glass);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		transition: transform 0.3s ease, background 0.3s ease;
	}

	.skill-card:hover {
		transform: translateY(-2px);
		background: var(--color-surface-glass-strong);
	}

	.skill-num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-accent);
		font-weight: 700;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 12px;
		opacity: 0.7;
	}

	.skill-name {
		font-family: 'Playfair Display', serif;
		color: var(--color-text-primary);
		font-size: 1.1rem;
		margin-bottom: 8px;
		font-weight: 400;
	}

	.skill-desc {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		line-height: 1.6;
		font-weight: 300;
	}

	/* ---- Sidebar ---- */
	.sidebar-card {
		background: var(--color-surface-glass);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 28px;
		margin-bottom: 24px;
	}

	.sidebar-heading {
		font-family: 'JetBrains Mono', monospace;
		color: var(--color-text-primary);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 20px;
		font-weight: 500;
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--color-border);
	}

	.stat-row:last-child {
		border-bottom: none;
	}

	.stat-row-label {
		color: var(--color-text-secondary);
		font-size: 0.95rem;
	}

	.stat-row-value {
		font-family: 'JetBrains Mono', monospace;
		color: var(--color-accent);
		font-size: 1.2rem;
		font-weight: 700;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		padding: 6px 14px;
		background: var(--color-accent-subtle);
		border: 1px solid var(--color-border-accent);
		border-radius: 20px;
		color: var(--color-accent);
		font-size: 0.85rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.tag:hover {
		background: var(--color-accent-glow);
		transform: translateY(-1px);
	}

	.tag-small {
		font-size: 0.8rem;
		padding: 4px 12px;
		background: var(--color-surface-glass);
		border-color: var(--color-border);
		color: var(--color-text-secondary);
	}

	.tag-small:hover {
		color: var(--color-secondary);
		border-color: var(--color-secondary-glow);
		background: var(--color-secondary-glow);
	}

	.sidebar-cta {
		text-align: center;
		border-color: var(--color-accent-subtle);
	}

	.cta-decorator {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.5rem;
		color: var(--color-accent);
		opacity: 0.25;
		margin-bottom: 16px;
	}

	.contact-text {
		color: var(--color-text-secondary);
		font-size: 0.95rem;
		line-height: 1.6;
		margin-bottom: 20px;
	}

	.contact-btn {
		width: 100%;
		text-align: center;
	}

	/* ---- Responsive ---- */
	@media (max-width: 1024px) {
		.about-layout {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.about-sidebar {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 16px;
		}

		.sidebar-card {
			margin-bottom: 0;
		}
	}

	@media (max-width: 768px) {
		.about-sidebar {
			grid-template-columns: 1fr;
		}

		.worlds-grid {
			grid-template-columns: 1fr;
		}

		.skills-grid {
			grid-template-columns: 1fr;
		}

		.bio-code {
			font-size: 0.75rem;
			padding: 16px 20px;
			overflow-x: auto;
		}
	}
</style>
