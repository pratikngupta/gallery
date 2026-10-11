<script>
  import Lightbox from "$lib/components/Lightbox.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import PhotoCard from "$lib/components/PhotoCard.svelte";
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

  // Curated photographs for editorial layout
  const heroPhoto = allPhotos.find(p => p.src.includes('yosemite-main') || p.src.includes('toronto-skyline-evening')) || allPhotos[0];
  const buildingsPhoto = allPhotos.find(p => p.src.includes('cn-tower.jpeg')) || allPhotos.find(p => p.categoryId === 'buildings') || allPhotos[0];
  const landscapePhoto = allPhotos.find(p => p.src.includes('cover-big-surf-costline')) || allPhotos.find(p => p.categoryId === 'landscape') || allPhotos[1];
  const wildlifePhoto = allPhotos.find(p => p.src.includes('cover-bird') || p.src.includes('seagulls-flying') || p.src.includes('GOAT')) || allPhotos.find(p => p.categoryId === 'wildlife') || allPhotos[2];

  // Interactive category filter state for Selected Work gallery
  let activeFilter = $state('all');

  const filterTabs = [
    { id: 'all', label: 'All', count: totalPhotos },
    ...categories.map((c) => {
      const cPhotos = allPhotos.filter((p) => p.categoryId === c.id);
      return {
        id: c.id,
        label: c.name,
        count: cPhotos.length,
      };
    }),
  ];

  let activeTab = $derived(
    filterTabs.find((t) => t.id === activeFilter) || filterTabs[0],
  );

  let filteredPhotos = $derived.by(() => {
    if (activeFilter === 'all') {
      return getFeaturedPhotos(9);
    }
    const catPhotos = allPhotos.filter((p) => p.categoryId === activeFilter);
    return catPhotos.slice(0, 9);
  });

  let lightboxPhotos = $state([]);
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  function openLightbox(index, photosArray) {
    lightboxPhotos = photosArray;
    lightboxIndex = index;
    lightboxOpen = true;
  }

  const lcpHref = typeof heroPhoto === 'object' && heroPhoto ? (heroPhoto.src600 || heroPhoto.srcWebp || heroPhoto.src || '') : '';
  const lcpSrcset = typeof heroPhoto === 'object' && heroPhoto ? heroPhoto.srcsetWebp : undefined;
</script>

<svelte:head>
  <title>Pratik Gupta | Engineer × Photographer</title>
  <meta
    name="description"
    content="Photography portfolio by Pratik Gupta — Architecture, landscapes, and wildlife through my lens."
  />

  {#if lcpHref}
    <!-- High priority preload for Largest Contentful Paint hero image -->
    <link
      rel="preload"
      as="image"
      type="image/webp"
      href={lcpHref}
      imagesrcset={lcpSrcset || undefined}
      imagesizes="(max-width: 640px) 600px, (max-width: 1024px) 85vw, 1150px"
      fetchpriority="high"
    />
  {/if}

  <!-- Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    property="og:description"
    content="Architecture, landscapes, and wildlife through my lens. Captured through an engineer's perspective."
  />
  <meta property="og:url" content="https://gallery-rho-two.vercel.app/" />
  <meta property="og:image" content="https://gallery-rho-two.vercel.app/og-image.jpg" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    name="twitter:description"
    content="Architecture, landscapes, and wildlife through my lens."
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

<div class="homepage-editorial">
  <!-- 1. Hero Section -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-header-block">
        <span class="hero-eyebrow">ENGINEER / PHOTOGRAPHER</span>
        <h1 class="hero-title">A different perspective.</h1>
        <p class="hero-subtitle">
          Architecture, landscapes, and wildlife through my lens.
        </p>
      </div>

      <!-- Hero Image -->
      {#if heroPhoto}
        <div 
          class="hero-media-wrap"
          role="button"
          tabindex="0"
          onclick={() => openLightbox(0, [heroPhoto])}
          onkeydown={(e) => { 
            if (e.key === 'Enter' || e.key === ' ') { 
              e.preventDefault(); 
              openLightbox(0, [heroPhoto]); 
            } 
          }}
        >
          <img
            src={heroPhoto.src600 || heroPhoto.srcWebp || lcpHref}
            srcset={lcpSrcset}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 85vw, 1150px"
            width={heroPhoto.width || 1400}
            height={heroPhoto.height || 933}
            style="aspect-ratio: {heroPhoto.width || 1400} / {heroPhoto.height || 933};"
            alt={heroPhoto.title || "Featured Photograph — Pratik Gupta"}
            class="hero-img"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          {#if heroPhoto.location}
            <div class="hero-pill-badge" aria-hidden="true">
              📍 {heroPhoto.location}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Links Row Directly Below Hero -->
      <div class="hero-bottom-row">
        <a href="#work" class="hero-link-left">Selected work</a>
        <a href="#collections" class="hero-link-right">
          <span>Explore Gallery</span>
          <span class="arrow-down" aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Horizontal Section Divider -->
  <div class="container">
    <div class="section-divider" aria-hidden="true"></div>
  </div>

  <!-- 2. Collections Section (Editorial Grid Matching Mockup) -->
  <section class="collections-section" id="collections">
    <div class="container">
      <div class="collections-header">
        <h2 class="collections-title">Collections</h2>
        <span class="collections-counter" aria-hidden="true">01 / 03</span>
      </div>

      <!-- Top Row: Buildings & Landscape (Side-by-side vertical cards) -->
      <div class="collections-top-grid">
        <!-- Buildings Card -->
        {#if buildingsPhoto}
          <a href="/gallery/buildings" class="editorial-card">
            <div class="card-img-wrap tall-card">
              <img
                src={buildingsPhoto.src600 || buildingsPhoto.srcWebp}
                srcset={buildingsPhoto.srcsetWebp}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 540px"
                width={buildingsPhoto.width || 800}
                height={buildingsPhoto.height || 1067}
                style="aspect-ratio: {buildingsPhoto.width || 800} / {buildingsPhoto.height || 1067};"
                alt="Buildings collection"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="card-caption">
              <h3 class="card-name">Buildings</h3>
              <p class="card-sub">Architecture and geometry</p>
            </div>
          </a>
        {/if}

        <!-- Landscape Card -->
        {#if landscapePhoto}
          <a href="/gallery/landscape" class="editorial-card">
            <div class="card-img-wrap tall-card">
              <img
                src={landscapePhoto.src600 || landscapePhoto.srcWebp}
                srcset={landscapePhoto.srcsetWebp}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 540px"
                width={landscapePhoto.width || 800}
                height={landscapePhoto.height || 1067}
                style="aspect-ratio: {landscapePhoto.width || 800} / {landscapePhoto.height || 1067};"
                alt="Landscape collection"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="card-caption">
              <h3 class="card-name">Landscape</h3>
              <p class="card-sub">Nature and atmosphere</p>
            </div>
          </a>
        {/if}
      </div>

      <!-- Bottom Row: Wildlife (Full-width wide card) -->
      {#if wildlifePhoto}
        <div class="collections-bottom-wrap">
          <a href="/gallery/wildlife" class="editorial-card">
            <div class="card-img-wrap wide-card">
              <img
                src={wildlifePhoto.src900 || wildlifePhoto.srcWebp}
                srcset={wildlifePhoto.srcsetWebp}
                sizes="(max-width: 768px) 94vw, (max-width: 1200px) 90vw, 1150px"
                width={wildlifePhoto.width || 1400}
                height={wildlifePhoto.height || 788}
                style="aspect-ratio: {wildlifePhoto.width || 1400} / {wildlifePhoto.height || 788};"
                alt="Wildlife collection"
                loading="lazy"
                decoding="async"
              />
              {#if wildlifePhoto.location}
                <div class="hero-pill-badge" aria-hidden="true">
                  📍 {wildlifePhoto.location}
                </div>
              {/if}
            </div>
            <div class="card-caption">
              <h3 class="card-name">Wildlife</h3>
              <p class="card-sub">Life in the natural world</p>
            </div>
          </a>
        </div>
      {/if}
    </div>
  </section>

  <!-- Horizontal Section Divider -->
  <div class="container">
    <div class="section-divider" aria-hidden="true"></div>
  </div>

  <!-- 3. Through the Lens (Selected Work with Interactive Filter) -->
  <section class="selected-work-section" id="work">
    <div class="container">
      <div class="section-header-clean">
        <div class="section-heading-group">
          <h2 class="section-title-clean">Through the lens</h2>
          <p class="section-sub-clean">
            A selection of photographs exploring light, form, and the natural world.
          </p>
        </div>

        <!-- Interactive Category Filtering Tabs (Option 4) -->
        <div 
          class="filter-tabs-bar" 
          role="tablist" 
          aria-label="Filter photographs by collection"
        >
          {#each filterTabs as tab}
            <button
              type="button"
              role="tab"
              id="tab-{tab.id}"
              aria-selected={activeFilter === tab.id}
              aria-controls="gallery-grid"
              class="filter-tab-btn"
              class:active={activeFilter === tab.id}
              onclick={() => { activeFilter = tab.id; }}
            >
              <span class="tab-label">{tab.label}</span>
              <span class="tab-count" aria-hidden="true">{tab.count}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Responsive Vertical Gallery Grid (Masonry) -->
      <div 
        class="vertical-gallery-wrap" 
        id="gallery-grid" 
        role="tabpanel" 
        aria-labelledby="tab-{activeFilter}"
      >
        {#key activeFilter}
          <div class="gallery-fade-container">
            <Masonry items={filteredPhotos}>
              {#snippet children({ item: photo, index })}
                <PhotoCard 
                  {photo} 
                  {index} 
                  onclick={() => openLightbox(index, filteredPhotos)} 
                />
              {/snippet}
            </Masonry>
          </div>
        {/key}
      </div>
    </div>
  </section>

  <!-- 5. CTA Section -->
  <section class="cta-section">
    <div class="container cta-inner">
      <div class="cta-divider" aria-hidden="true">
        <span class="divider-line"></span>
        <span class="divider-diamond">◆</span>
        <span class="divider-line"></span>
      </div>
      <h2 class="cta-title">Ready to explore?</h2>
      <p class="cta-subtitle">Browse all {totalPhotos} photographs across the complete archive</p>
      <a href="/gallery" class="btn btn-primary">Browse All Collections</a>
    </div>
  </section>
</div>

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
  /* ---- Page Container ---- */
  .homepage-editorial {
    min-height: 100vh;
    background: var(--color-bg-primary);
  }

  .container {
    max-width: 1150px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-divider {
    height: 1px;
    background: var(--color-border);
    margin: 40px 0;
  }

  /* ---- 1. Hero Section ---- */
  .hero-section {
    padding-top: calc(var(--nav-height, 72px) + 28px);
    padding-bottom: 0;
    position: relative;
  }

  .hero-header-block {
    text-align: left;
    margin-bottom: 24px;
  }

  .hero-eyebrow {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    display: block;
    margin-bottom: 12px;
  }

  .hero-title {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-text-primary);
    line-height: 1.15;
    margin-bottom: 8px;
  }

  .hero-subtitle {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .hero-media-wrap {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    background: var(--color-bg-surface);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hero-media-wrap:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
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
    transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .hero-media-wrap:hover .hero-img {
    transform: scale(1.02);
  }

  .hero-pill-badge {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(28, 28, 28, 0.75);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    line-height: 1.4;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    letter-spacing: 0.02em;
    pointer-events: none;
  }

  .hero-bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
  }

  .hero-link-left {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .hero-link-left:hover {
    color: var(--color-text-primary);
  }

  .hero-link-right {
    color: var(--color-text-primary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .hero-link-right:hover {
    color: var(--color-accent);
    transform: translateY(1px);
  }

  .arrow-down {
    font-size: 1.1rem;
    line-height: 1;
  }

  /* ---- 2. Collections Section ---- */
  .collections-section {
    padding: 0;
  }

  .collections-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }

  .collections-title {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1.55rem;
    font-weight: 700;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .collections-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    letter-spacing: 0.05em;
  }

  .collections-top-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
  }

  .collections-bottom-wrap {
    width: 100%;
  }

  .editorial-card {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .card-img-wrap {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    background: var(--color-bg-surface);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card-img-wrap:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.25);
  }

  .card-img-wrap:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }

  .tall-card img {
    width: 100%;
    height: auto;
    aspect-ratio: 0.82;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .wide-card img {
    width: 100%;
    height: auto;
    aspect-ratio: 1.85;
    max-height: 60vh;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .editorial-card:hover img {
    transform: scale(1.02);
  }

  .card-caption {
    padding-top: 14px;
    text-align: left;
  }

  .card-name {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 3px 0;
    line-height: 1.25;
  }

  .card-sub {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 0.88rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  /* ---- 3. Selected Work Section ---- */
  .selected-work-section {
    padding: 0;
  }

  .section-header-clean {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 32px;
  }

  .section-heading-group {
    text-align: left;
  }

  .section-title-clean {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1.55rem;
    font-weight: 700;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 6px 0;
  }

  .section-sub-clean {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  /* Interactive Filter Tabs Bar */
  .filter-tabs-bar {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--color-bg-surface);
    padding: 4px;
    border-radius: 9999px;
    border: 1px solid var(--color-border);
    overflow-x: auto;
    max-width: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .filter-tab-btn {
    appearance: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .filter-tab-btn:hover {
    color: var(--color-text-primary);
  }

  .filter-tab-btn.active {
    background: var(--color-text-primary);
    color: var(--color-bg-primary);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .filter-tab-btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .tab-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    padding: 1px 6px;
    border-radius: 9999px;
    background: rgba(125, 125, 125, 0.16);
    color: inherit;
    transition: background 0.2s ease;
  }

  .filter-tab-btn.active .tab-count {
    background: rgba(0, 0, 0, 0.22);
  }

  :root[data-theme="light"] .filter-tab-btn.active .tab-count {
    background: rgba(255, 255, 255, 0.24);
  }

  .vertical-gallery-wrap {
    width: 100%;
  }

  .gallery-fade-container {
    animation: fadeInGallery 0.3s ease-out forwards;
  }

  @keyframes fadeInGallery {
    from {
      opacity: 0.65;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .gallery-footer-cta {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }

  .btn-count {
    opacity: 0.75;
    margin-left: 4px;
  }

  .btn-arrow {
    margin-left: 6px;
    transition: transform 0.2s ease;
  }

  .btn:hover .btn-arrow {
    transform: translateX(4px);
  }

  /* ---- 4. CTA Section ---- */
  .cta-section {
    padding: 80px 0 120px;
  }

  .cta-inner {
    text-align: center;
  }

  .cta-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    color: var(--color-border-accent);
  }

  .divider-line {
    width: 48px;
    height: 1px;
    background: var(--color-border);
  }

  .divider-diamond {
    font-size: 0.75rem;
    color: var(--color-accent);
    opacity: 0.8;
  }

  .cta-title {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: var(--color-text-primary);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }

  .cta-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    margin-bottom: 32px;
    font-weight: 300;
  }

  /* ---- Responsive Adjustments ---- */
  @media (max-width: 900px) {
    .collections-top-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .wide-card img {
      aspect-ratio: 1.33;
    }
  }

  @media (max-width: 768px) {
    .section-header-clean {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .filter-tabs-bar {
      width: 100%;
      justify-content: flex-start;
      padding: 3px;
      gap: 4px;
    }

    .filter-tab-btn {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 640px) {
    .hero-section {
      padding-top: calc(var(--nav-height, 72px) + 20px);
    }

    .hero-title {
      font-size: 2.1rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-pill-badge {
      bottom: 12px;
      left: 12px;
      padding: 4px 10px;
      font-size: 0.72rem;
    }

    .tall-card img {
      aspect-ratio: 1;
    }

    .cta-section {
      padding: 60px 0 80px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gallery-fade-container,
    .hero-img,
    .tall-card img,
    .wide-card img {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
  }
</style>
