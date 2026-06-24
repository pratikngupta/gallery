<script>
  import CategoryCard from "$lib/components/CategoryCard.svelte";
  import PhotoCard from "$lib/components/PhotoCard.svelte";
  import Lightbox from "$lib/components/Lightbox.svelte";
  import MarqueeSlider from "$lib/components/MarqueeSlider.svelte";
  import BentoGrid from "$lib/components/BentoGrid.svelte";
  import HorizontalScroll from "$lib/components/HorizontalScroll.svelte";
  import {
    galleryData,
    getFeaturedPhotos,
    getTotalPhotoCount,
    getAllPhotos,
  } from "$lib/stores/gallery.js";

  const categories = galleryData.categories;
  const featuredPhotos = getFeaturedPhotos(6); // Bento grid takes 6
  const hsPhotos = getFeaturedPhotos(8); // Horizontal scroll takes 8
  const allPhotos = getAllPhotos();
  const totalPhotos = allPhotos.length;
  const totalSubcategories = categories.reduce(
    (acc, c) => acc + c.subcategories.length,
    0,
  );

  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  /* Animated counters */
  let photosCount = $state(0);
  let collectionsCount = $state(0);
  let subcategoriesCount = $state(0);
  let countersStarted = $state(false);

  function openLightbox(index) {
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
          animateCounter(
            categories.length,
            (v) => (collectionsCount = v),
            1000,
          );
          animateCounter(
            totalSubcategories,
            (v) => (subcategoriesCount = v),
            1200,
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    const el = document.getElementById("about-teaser");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });

  const heroImages =
    galleryData.heroImages ||
    categories
      .map((c) => c.cover)
      .filter(Boolean)
      .slice(0, 4);
</script>

<svelte:head>
  <title>Pratik Gupta | Engineer × Photographer</title>
  <meta
    name="description"
    content="Photography portfolio by Pratik Gupta — a software engineer capturing landscapes, architecture, and wildlife through a precise yet artistic lens."
  />

  <!-- Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    property="og:description"
    content="Photography portfolio by Pratik Gupta — a software engineer capturing landscapes, architecture, and wildlife."
  />
  <meta property="og:url" content="https://pratikngupta.github.io/gallery" />
  <meta property="og:image" content="https://pratikngupta.github.io/gallery/og-image.jpg" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pratik Gupta | Engineer × Photographer" />
  <meta
    name="twitter:description"
    content="Photography portfolio by Pratik Gupta — a software engineer capturing landscapes, architecture, and wildlife."
  />
  <meta name="twitter:image" content="https://pratikngupta.github.io/gallery/og-image.jpg" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://pratikngupta.github.io/gallery" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Pratik Gupta",
      "jobTitle": "Software Engineer",
      "description": "Software engineer and photographer capturing landscapes, architecture, and wildlife through a precise yet artistic lens.",
      "url": "https://pratikngupta.github.io/gallery",
      "image": "https://pratikngupta.github.io/gallery/og-image.jpg",
      "sameAs": [
        "https://github.com/pratikngupta",
        "https://linkedin.com/in/pratikngupta",
        "https://instagram.com/pratikngupta"
      ]
    }
  </script>
</svelte:head>

<!-- Cinematic Scroll Hero -->
<HorizontalScroll 
  isHero={true}
  title="Engineer × Photographer" 
  subtitle="The logic of software. The art of the lens." 
  photos={heroImages} 
  onclick={openLightbox} 
/>

<!-- Introduction Strip -->`
<section class="intro-strip">
  <div class="dot-pattern"></div>
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
        <span class="code-string">'Software Engineer'</span><span
          class="code-punct">,</span
        >
      </div>
      <div class="code-line code-indent">
        <span class="code-key">passion</span><span class="code-punct">:</span>
        <span class="code-string">'Photography'</span><span class="code-punct"
          >,</span
        >
      </div>
      <div class="code-line code-indent">
        <span class="code-key">focus</span><span class="code-punct">:</span>
        <span class="code-bracket">[</span>
        <span class="code-string">'Landscapes'</span><span class="code-punct"
          >,</span
        >
        <span class="code-string">'Buildings'</span><span class="code-punct"
          >,</span
        >
        <span class="code-string">'Wildlife'</span>
        <span class="code-bracket">]</span>
      </div>
      <div class="code-line">
        <span class="code-bracket">{"}"}</span><span class="code-punct">;</span>
      </div>
    </div>
    <div class="intro-text">
      <p>
        There's a quiet symmetry between writing elegant code and composing a
        photograph. Both demand patience, precision, and an eye for the details
        others overlook. By day I architect software systems; by golden hour I
        chase the algorithms of light — debugging compositions until every pixel
        feels intentional.
      </p>
    </div>
  </div>
</section>



<!-- Collections Section (Marquee) -->
<section class="section offscreen-section" id="collections">
  <div class="container">
    <div class="section-header">
      <span class="section-label">collections</span>
      <h2 class="section-title">Explore the Gallery</h2>
      <p class="section-subtitle">
        {totalPhotos} photographs across {categories.length} curated collections
      </p>
    </div>
  </div>
  <!-- Full bleed marquee -->
  <MarqueeSlider 
    photos={categories.map(c => ({ src: c.cover, title: c.name }))} 
    speed={30} 
    direction="left"
    onclick={(index) => window.location.href = `/gallery/${categories[index].id}`}
  />
</section>

<!-- Featured Photos Section (Bento Grid) -->
<section class="section section-dark offscreen-section" id="featured">
  <div class="container">
    <div class="section-header">
      <span class="section-label">recent captures</span>
      <h2 class="section-title">Latest Work</h2>
      <p class="section-subtitle">
        A selection of recent photographs from the portfolio
      </p>
    </div>
    <div class="featured-grid-container">
      <BentoGrid photos={featuredPhotos} onclick={openLightbox} />
    </div>
  </div>
</section>

{#if lightboxOpen}
  <Lightbox
    photos={featuredPhotos}
    currentIndex={lightboxIndex}
    onclose={() => {
      lightboxOpen = false;
    }}
  />
{/if}

<!-- About Teaser -->
<section class="section offscreen-section" id="about-teaser">
  <div class="container">
    <div class="section-header">
      <span class="section-label">about</span>
    </div>
    <div class="about-content">
      <div class="about-text">
        <h2 class="section-title about-title">
          The logic of software.<br />The art of the lens.
        </h2>
        <p class="about-description">
          I'm a Software Engineering student building resilient systems at the
          intersection of AI, robotics, and cloud-native infrastructure. But
          behind the lens, logic meets wonder. Every landscape is a system to
          decode, and every shutter click is a deployment of a moment I'll never
          get back. Where engineering precision meets artistic vision.
        </p>
        <a href="/about" class="btn btn-ghost">
          <span class="btn-decorator">&lt;/&gt;</span>
          Learn More
        </a>
      </div>
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
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container cta-inner">
    <span class="cta-decorator">{"{"} ⏤ {"}"}</span>
    <h2 class="cta-title">Ready to explore?</h2>
    <p class="cta-subtitle">Browse the full collection of photographs</p>
    <a href="/gallery" class="btn btn-primary">View Full Gallery</a>
  </div>
</section>

<style>
  /* ---- Introduction Strip ---- */
  .intro-strip {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }

  .dot-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .intro-inner {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 60px;
    align-items: center;
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .code-block {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.9rem;
    line-height: 2;
    white-space: nowrap;
    padding: 28px 32px;
    background: var(--color-surface-glass-strong);
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  .code-indent {
    padding-left: 2em;
  }

  .code-keyword {
    color: #c792ea;
    font-weight: 500;
  }

  .code-var {
    color: #82aaff;
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

  .intro-text p {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    line-height: 1.8;
    font-weight: 300;
    max-width: 480px;
  }

  /* ---- Sections ---- */
  .section {
    padding: 100px 0;
  }

  .section-dark {
    background: linear-gradient(
      180deg,
      var(--color-bg-tertiary) 0%,
      transparent 100%
    );
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .section-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--color-text-primary);
    margin-bottom: 16px;
    font-weight: 400;
  }

  .section-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ---- Featured Grid ---- */
  .featured-grid-container {
    width: 100%;
  }

  /* ---- About Teaser ---- */
  .about-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .about-title {
    text-align: left;
  }

  .about-description {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 32px;
    font-weight: 300;
  }

  .btn-decorator {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.8rem;
    color: var(--color-accent);
    opacity: 0.7;
  }

  .about-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .stat-card {
    padding: 28px 32px;
    background: var(--color-surface-glass);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    display: flex;
    align-items: baseline;
    gap: 16px;
    transition:
      transform 0.3s ease,
      background 0.3s ease;
  }

  .stat-card:hover {
    transform: translateX(6px);
    background: var(--color-surface-glass-strong);
  }

  .stat-number {
    font-family: "JetBrains Mono", monospace;
    font-size: 2.5rem;
    color: var(--color-accent);
    font-weight: 700;
    min-width: 72px;
    line-height: 1;
  }

  .stat-label {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* ---- CTA Section ---- */
  .cta-section {
    padding: 80px 0 120px;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
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
    margin-bottom: 24px;
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
    margin-bottom: 36px;
    font-weight: 300;
  }

  /* ---- Keyframes ---- */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ---- Responsive ---- */
  @media (max-width: 1024px) {
    .intro-inner {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .code-block {
      font-size: 0.8rem;
      overflow-x: auto;
    }

    .intro-text p {
      max-width: 100%;
    }

    .about-content {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .about-title {
      text-align: center;
    }

    .about-description {
      text-align: center;
    }

    .about-text {
      text-align: center;
    }

    .about-stats {
      flex-direction: row;
      justify-content: center;
    }

    .stat-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }
  }

  @media (max-width: 900px) {
    .categories-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .featured-grid {
      columns: 2;
    }

    .section {
      padding: 60px 0;
    }
  }

  @media (max-width: 600px) {
    .featured-grid {
      columns: 1;
    }

    .about-stats {
      flex-direction: column;
    }

    .stat-card {
      flex-direction: row;
      align-items: baseline;
    }

    .stat-card:hover {
      transform: translateX(6px);
    }

    .intro-inner {
      padding-top: 40px;
      padding-bottom: 40px;
    }

    .cta-section {
      padding: 60px 0 80px;
    }
  }

  /* Offscreen rendering optimization */
  .offscreen-section {
    content-visibility: auto;
    contain-intrinsic-size: auto 600px;
  }
</style>
