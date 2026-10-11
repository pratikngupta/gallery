<script>
  import CategoryCard from "$lib/components/CategoryCard.svelte";
  import Lightbox from "$lib/components/Lightbox.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import PhotoCard from "$lib/components/PhotoCard.svelte";
  import HorizontalScroll from "$lib/components/HorizontalScroll.svelte";
  import {
    galleryData,
    getFeaturedPhotos,
    getAllPhotos,
  } from "$lib/stores/gallery.js";

  const categories = galleryData.categories;
  const allPhotos = getAllPhotos();
  const totalPhotos = allPhotos.length;
  const totalSubcategories = categories.reduce(
    (acc, c) => acc + c.subcategories.length,
    0,
  );

  // Curated photos for Selected Work vertical gallery (9 photos across categories)
  const selectedPhotos = getFeaturedPhotos(9);
  // Curated series photos for horizontal editorial section
  const seriesPhotos = allPhotos.slice(0, 8);

  let lightboxPhotos = $state([]);
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  /* Animated counters */
  let photosCount = $state(0);
  let collectionsCount = $state(0);
  let subcategoriesCount = $state(0);
  let countersStarted = $state(false);

  function openLightbox(index, photosArray) {
    lightboxPhotos = photosArray;
    lightboxIndex = index;
    lightboxOpen = true;
  }

  function animateCounter(target, setter, duration = 1600) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  $effect(() => {
    if (countersStarted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          countersStarted = true;
          animateCounter(totalPhotos, (v) => (photosCount = v));
          animateCounter(categories.length, (v) => (collectionsCount = v), 1000);
          animateCounter(totalSubcategories, (v) => (subcategoriesCount = v), 1200);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    const el = document.getElementById("about-teaser");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });

  // Hero image selection: high-resolution, visually striking photograph
  const heroPhoto =
    (galleryData.heroImages && galleryData.heroImages.length > 0)
      ? galleryData.heroImages[0]
      : categories[0]?.coverPhoto || allPhotos[0];

  const lcpHref = typeof heroPhoto === 'object' && heroPhoto ? (heroPhoto.src1400 || heroPhoto.src800 || heroPhoto.srcWebp || heroPhoto.src || '') : '';
  const lcpSrcset = typeof heroPhoto === 'object' && heroPhoto ? heroPhoto.srcsetWebp : undefined;
</script>

<svelte:head>
  <title>Pratik Gupta | Engineer × Photographer</title>
  <meta
    name="description"
    content="Photography portfolio by Pratik Gupta — a software engineer capturing architecture, landscapes, and wildlife through an engineer's perspective."
  />

  {#if lcpHref}
    <!-- High priority preload for Largest Contentful Paint hero image -->
    <link
      rel="preload"
      as="image"
      type="image/webp"
      href={lcpHref}
      imagesrcset={lcpSrcset || undefined}
      imagesizes="(max-width: 768px) 94vw, (max-width: 1200px) 90vw, 1150px"
      fetchpriority="high"
    />
  {/if}

  <!-- Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    property="og:description"
    content="Photography portfolio by Pratik Gupta — Architecture, landscapes, and wildlife captured through an engineer's perspective."
  />
  <meta property="og:url" content="https://gallery-rho-two.vercel.app/" />
  <meta property="og:image" content="https://gallery-rho-two.vercel.app/og-image.jpg" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    name="twitter:description"
    content="Photography portfolio by Pratik Gupta — Architecture, landscapes, and wildlife captured through an engineer's perspective."
  />
  <meta name="twitter:image" content="https://gallery-rho-two.vercel.app/og-image.jpg" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://gallery-rho-two.vercel.app/" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Pratik Gupta",
      "jobTitle": "Software Engineer & Photographer",
      "description": "Software engineer and photographer capturing landscapes, architecture, and wildlife through a precise yet artistic lens.",
      "url": "https://gallery-rho-two.vercel.app/",
      "image": "https://gallery-rho-two.vercel.app/og-image.jpg",
      "sameAs": [
        "https://github.com/pratikngupta",
        "https://linkedin.com/in/pratikngupta",
        "https://instagram.com/pratikngupta"
      ]
    }
  </script>
</svelte:head>

<!-- Refined Hero Section -->
<section class="hero-section">
  <div class="dot-pattern" aria-hidden="true"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <span class="hero-eyebrow">PRATIK GUPTA</span>
      <h1 class="hero-title">Photography through a different perspective.</h1>
      <p class="hero-subtitle">
        Architecture, landscapes, and wildlife captured through an engineer's perspective.
      </p>
      <div class="hero-actions">
        <a href="#collections" class="btn btn-primary">Explore Collections</a>
        <a href="#work" class="btn btn-ghost">Selected Work</a>
      </div>
    </div>

    <!-- Prominent Hero Photograph -->
    {#if heroPhoto}
      <div 
        class="hero-media-wrap"
        role="button"
        tabindex="0"
        aria-label="View featured photograph: {heroPhoto.title || 'Toronto Skyline'} in full screen"
        onclick={() => openLightbox(0, [heroPhoto])}
        onkeydown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            openLightbox(0, [heroPhoto]); 
          } 
        }}
      >
        <img
          src={lcpHref}
          srcset={lcpSrcset}
          sizes="(max-width: 768px) 94vw, (max-width: 1200px) 90vw, 1150px"
          width={heroPhoto.width || 1400}
          height={heroPhoto.height || 933}
          style="aspect-ratio: {heroPhoto.width || 1400} / {heroPhoto.height || 933};"
          alt={heroPhoto.title || "Featured Photograph — Pratik Gupta Photography"}
          class="hero-img"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div class="hero-img-overlay">
          <div class="hero-img-info">
            {#if heroPhoto.title}
              <span class="hero-img-title">{heroPhoto.title}</span>
            {/if}
            {#if heroPhoto.location}
              <span class="hero-img-location">📍 {heroPhoto.location}</span>
            {/if}
          </div>
          <span class="hero-expand-badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            Full resolution
          </span>
        </div>
      </div>
    {/if}

    <!-- Discoverable Vertical Scroll Cue -->
    <a href="#collections" class="scroll-discover">
      <span class="scroll-discover-text">Scroll to discover</span>
      <svg class="scroll-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    </a>
  </div>
</section>

<!-- Collections Section -->
<section class="section" id="collections">
  <div class="container">
    <div class="section-header">
      <span class="section-label">collections</span>
      <h2 class="section-title">Explore Collections</h2>
      <p class="section-subtitle">
        {totalPhotos} photographs across {categories.length} curated collections
      </p>
    </div>
    <div class="categories-grid">
      {#each categories as category}
        <div class="category-wrapper">
          <CategoryCard {category} />
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Selected Work Section: Responsive Vertical Gallery Grid -->
<section class="section section-dark" id="work">
  <div class="container">
    <div class="section-header">
      <span class="section-label">selected work</span>
      <h2 class="section-title">Featured Photographs</h2>
      <p class="section-subtitle">
        A vertical gallery showcasing highlights from across all collections. Click any photograph to view in full resolution.
      </p>
    </div>
    <div class="vertical-gallery-wrap">
      <Masonry items={selectedPhotos}>
        {#snippet children({ item: photo, index })}
          <PhotoCard 
            {photo} 
            {index} 
            onclick={() => openLightbox(index, selectedPhotos)} 
          />
        {/snippet}
      </Masonry>
    </div>
    <div class="gallery-footer-cta">
      <a href="/gallery" class="btn btn-primary">
        <span>View Full Archive</span>
        <span class="btn-count">({totalPhotos} photos)</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>

<!-- Curated Editorial Series (Discoverable Carousel with Prev/Next, Dots, Snap) -->
<section class="section curated-wrap" id="series">
  <HorizontalScroll
    photos={seriesPhotos}
    title="Curated Series"
    subtitle="Selected frames from across collections presented in an editorial sequence"
    onclick={(idx) => openLightbox(idx, seriesPhotos)}
  />
</section>

<!-- Engineering × Photography Narrative -->
<section class="intro-strip" id="about-teaser">
  <div class="dot-pattern" aria-hidden="true"></div>
  <div class="container intro-inner">
    <div class="code-block">
      <div class="code-line">
        <span class="code-keyword">const</span>
        <span class="code-var">pratik</span>
        <span class="code-punct">=</span>
        <span class="code-bracket">{"{"}</span>
      </div>
      <div class="code-line code-indent">
        <span class="code-key">role</span><span class="code-punct">:</span>
        <span class="code-string">'Software Engineer'</span><span class="code-punct">,</span>
      </div>
      <div class="code-line code-indent">
        <span class="code-key">passion</span><span class="code-punct">:</span>
        <span class="code-string">'Photography'</span><span class="code-punct">,</span>
      </div>
      <div class="code-line code-indent">
        <span class="code-key">focus</span><span class="code-punct">:</span>
        <span class="code-bracket">[</span>
        <span class="code-string">'Landscapes'</span><span class="code-punct">,</span>
        <span class="code-string">'Buildings'</span><span class="code-punct">,</span>
        <span class="code-string">'Wildlife'</span>
        <span class="code-bracket">]</span>
      </div>
      <div class="code-line">
        <span class="code-bracket">{"}"}</span><span class="code-punct">;</span>
      </div>
    </div>
    <div class="intro-text">
      <h2 class="about-lead-title">The logic of software.<br />The art of the lens.</h2>
      <p>
        There's a quiet symmetry between writing elegant code and composing a
        photograph. Both demand patience, precision, and an eye for the details
        others overlook. By day I architect software systems; by golden hour I
        chase the algorithms of light — debugging compositions until every pixel
        feels intentional.
      </p>
      <div class="about-action-row">
        <a href="/about" class="btn btn-ghost">
          <span class="btn-decorator">&lt;/&gt;</span>
          Learn More About Pratik
        </a>
      </div>
    </div>
  </div>

  <div class="container about-stats-container">
    <div class="about-stats">
      <div class="stat-card">
        <span class="stat-number">{photosCount}</span>
        <span class="stat-label">Photographs</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{collectionsCount}</span>
        <span class="stat-label">Collections</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{subcategoriesCount}</span>
        <span class="stat-label">Categories</span>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container cta-inner">
    <span class="cta-decorator" aria-hidden="true">{"{"} ⏤ {"}"}</span>
    <h2 class="cta-title">Ready to explore?</h2>
    <p class="cta-subtitle">Browse all {totalPhotos} photographs across the collection</p>
    <a href="/gallery" class="btn btn-primary">Browse All Collections</a>
  </div>
</section>

{#if lightboxOpen}
  <Lightbox
    photos={lightboxPhotos}
    currentIndex={lightboxIndex}
    onclose={() => {
      lightboxOpen = false;
    }}
  />
{/if}

<style>
  /* ---- Hero Section ---- */
  .hero-section {
    position: relative;
    padding-top: calc(var(--nav-height, 72px) + 40px);
    padding-bottom: 60px;
    background: var(--color-bg-primary);
    overflow: hidden;
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-content {
    max-width: 820px;
    margin: 0 auto 40px;
  }

  .hero-eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    display: block;
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(2.4rem, 5.5vw, 4.2rem);
    color: var(--color-text-primary);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .hero-subtitle {
    font-family: "Inter", sans-serif;
    font-size: clamp(1.05rem, 2vw, 1.3rem);
    color: var(--color-text-secondary);
    font-weight: 300;
    line-height: 1.6;
    max-width: 680px;
    margin: 0 auto 32px;
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* ---- Hero Media Wrap ---- */
  .hero-media-wrap {
    position: relative;
    width: 100%;
    max-width: 1150px;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    margin-bottom: 40px;
    line-height: 0;
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  }

  .hero-media-wrap:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 75px rgba(0, 0, 0, 0.45);
    border-color: var(--color-border-accent);
  }

  .hero-media-wrap:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }

  .hero-img {
    width: 100%;
    height: auto;
    max-height: 72vh;
    object-fit: cover;
    display: block;
    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .hero-media-wrap:hover .hero-img {
    transform: scale(1.02);
  }

  .hero-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 70%);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 28px 36px;
    opacity: 0.9;
    transition: opacity 0.3s ease;
  }

  .hero-media-wrap:hover .hero-img-overlay {
    opacity: 1;
  }

  .hero-img-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }

  .hero-img-title {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
  }

  .hero-img-location {
    font-family: "Inter", sans-serif;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0.02em;
  }

  .hero-expand-badge {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ---- Scroll Discover Indicator ---- */
  .scroll-discover {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--color-text-secondary);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
    padding: 8px 16px;
  }

  .scroll-discover:hover {
    color: var(--color-accent);
    transform: translateY(2px);
  }

  .scroll-discover-text {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .scroll-arrow-icon {
    animation: bounceDown 2s infinite ease-in-out;
  }

  @keyframes bounceDown {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(6px);
    }
  }

  /* ---- Sections ---- */
  .section {
    padding: 100px 0;
    position: relative;
  }

  .section-dark {
    background: linear-gradient(
      180deg,
      var(--color-bg-secondary) 0%,
      var(--color-bg-primary) 100%
    );
  }

  .curated-wrap {
    padding: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .section-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: 12px;
  }

  .section-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--color-text-primary);
    margin-bottom: 14px;
    font-weight: 400;
  }

  .section-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ---- Categories Grid (3 Columns) ---- */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .category-wrapper {
    width: 100%;
  }

  /* ---- Vertical Gallery Wrap ---- */
  .vertical-gallery-wrap {
    width: 100%;
  }

  .gallery-footer-cta {
    display: flex;
    justify-content: center;
    margin-top: 56px;
  }

  .btn-count {
    opacity: 0.7;
    margin-left: 4px;
  }

  .btn-arrow {
    margin-left: 6px;
    transition: transform 0.2s ease;
  }

  .btn:hover .btn-arrow {
    transform: translateX(4px);
  }

  /* ---- Introduction Strip / Engineering Perspective ---- */
  .intro-strip {
    position: relative;
    background: var(--color-bg-surface);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
    padding: 80px 0;
  }

  .dot-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  :root[data-theme="light"] .dot-pattern {
    opacity: 0.08;
    background-image: radial-gradient(circle, #000 1px, transparent 1px);
  }

  .intro-inner {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 60px;
  }

  .code-block {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.9rem;
    line-height: 2;
    white-space: nowrap;
    padding: 28px 32px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  .code-indent {
    padding-left: 2em;
  }

  .code-keyword {
    color: var(--color-syntax-keyword, #c792ea);
    font-weight: 500;
  }

  .code-var {
    color: var(--color-syntax-variable, #82aaff);
    margin-left: 0.5em;
  }

  .code-punct {
    color: var(--color-text-secondary);
    margin: 0 0.25em;
  }

  .code-bracket {
    color: var(--color-text-primary);
    margin: 0 0.15em;
  }

  .code-key {
    color: var(--color-accent);
  }

  .code-string {
    color: var(--color-secondary);
  }

  .about-lead-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.8rem, 3.2vw, 2.5rem);
    color: var(--color-text-primary);
    font-weight: 400;
    margin-bottom: 16px;
    line-height: 1.25;
  }

  .intro-text p {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    line-height: 1.8;
    font-weight: 300;
    max-width: 540px;
    margin-bottom: 24px;
  }

  .about-action-row {
    margin-top: 16px;
  }

  .btn-decorator {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8rem;
    color: var(--color-accent);
    opacity: 0.7;
    margin-right: 6px;
  }

  .about-stats-container {
    position: relative;
  }

  .about-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .stat-card {
    padding: 24px 28px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    display: flex;
    align-items: baseline;
    gap: 16px;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    border-color: var(--color-border-accent);
  }

  .stat-number {
    font-family: "JetBrains Mono", monospace;
    font-size: 2.2rem;
    color: var(--color-accent);
    font-weight: 700;
    min-width: 64px;
    line-height: 1;
  }

  .stat-label {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  /* ---- CTA Section ---- */
  .cta-section {
    padding: 80px 0 120px;
    border-top: 1px solid var(--color-border);
  }

  .cta-inner {
    text-align: center;
  }

  .cta-decorator {
    font-family: "JetBrains Mono", monospace;
    font-size: 1.2rem;
    color: var(--color-accent);
    opacity: 0.3;
    display: block;
    margin-bottom: 20px;
  }

  .cta-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: var(--color-text-primary);
    font-weight: 400;
    margin-bottom: 12px;
  }

  .cta-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    margin-bottom: 32px;
    font-weight: 300;
  }

  /* ---- Responsive Adjustments ---- */
  @media (max-width: 1024px) {
    .intro-inner {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .code-block {
      overflow-x: auto;
    }

    .intro-text p {
      max-width: 100%;
    }
  }

  @media (max-width: 900px) {
    .categories-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .section {
      padding: 70px 0;
    }

    .hero-img-overlay {
      padding: 18px 22px;
    }

    .hero-img-title {
      font-size: 1.2rem;
    }

    .hero-expand-badge {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .hero-section {
      padding-top: calc(var(--nav-height, 72px) + 24px);
      padding-bottom: 40px;
    }

    .hero-title {
      font-size: 2.1rem;
    }

    .hero-subtitle {
      font-size: 1rem;
      margin-bottom: 24px;
    }

    .hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .hero-actions .btn {
      width: 100%;
    }

    .about-stats {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .stat-card {
      padding: 18px 22px;
    }

    .intro-strip {
      padding: 50px 0;
    }

    .cta-section {
      padding: 60px 0 80px;
    }
  }
</style>
