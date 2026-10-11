import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateGalleryData } from '../src/lib/server/gallery.js';

const SCREENSHOTS_DIR = '/Users/pratik/.gemini/antigravity-ide/brain/1b76bbf6-a4b1-4e31-9d96-2790b5ef6080/scratch/screenshots';
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let passed = 0;
let failed = 0;
let skipped = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', name: testName });
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    results.push({ status: 'FAIL', name: testName, details });
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

// Simple CDP Client over native WebSocket
class ChromeDevToolsClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { res, rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message));
          else res(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    return new Promise((res, rej) => {
      const msgId = this.id++;
      this.pending.set(msgId, { res, rej });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('       PHOTOGRAPHY PORTFOLIO QA & REGRESSION SUITE     ');
  console.log('======================================================\n');

  // ----------------------------------------------------------------
  // 1. DATA INTEGRITY & ARCHIVE CONTRACT TESTS
  // ----------------------------------------------------------------
  console.log('1. DATA & CONTENT INTEGRITY:');
  const data = generateGalleryData();
  const buildings = data.categories.find(c => c.id === 'buildings');
  const landscape = data.categories.find(c => c.id === 'landscape');
  const wildlife = data.categories.find(c => c.id === 'wildlife');

  const bCount = buildings ? buildings.subcategories.reduce((a, s) => a + s.photos.length, 0) : 0;
  const lCount = landscape ? landscape.subcategories.reduce((a, s) => a + s.photos.length, 0) : 0;
  const wCount = wildlife ? wildlife.subcategories.reduce((a, s) => a + s.photos.length, 0) : 0;
  const totalCount = bCount + lCount + wCount;

  assert(bCount === 6, 'Buildings collection contains exactly 6 photographs', `Found: ${bCount}`);
  assert(lCount === 9, 'Landscape collection contains exactly 9 photographs', `Found: ${lCount}`);
  assert(wCount === 21, 'Wildlife collection contains exactly 21 photographs', `Found: ${wCount}`);
  assert(totalCount === 36, 'Total portfolio contains exactly 36 photographs', `Found: ${totalCount}`);

  // Check file assets existence (decoding URL encoded components)
  let missingFiles = 0;
  for (const c of data.categories) {
    for (const s of c.subcategories) {
      for (const p of s.photos) {
        const unescaped = decodeURIComponent(p.src);
        const fullSrc = path.join(process.cwd(), 'static', unescaped);
        if (!fs.existsSync(fullSrc)) missingFiles++;
      }
    }
  }
  assert(missingFiles === 0, 'All 36 original photograph image files exist in static/photos', `Missing: ${missingFiles}`);

  // Check WebP optimization manifest
  const manifestPath = path.join(process.cwd(), 'static', 'photos-opt', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'Optimized WebP manifest exists in static/photos-opt/manifest.json');

  // ----------------------------------------------------------------
  // 2. STATIC EXPORT & SEO REGRESSION TESTS
  // ----------------------------------------------------------------
  console.log('\n2. STATIC ROUTING & SEO INTEGRITY:');
  const routesToCheck = [
    { path: 'build/index.html', canonical: 'https://gallery-rho-two.vercel.app/', title: 'Pratik Gupta | Engineer × Photographer' },
    { path: 'build/gallery.html', canonical: 'https://gallery-rho-two.vercel.app/gallery', title: 'Gallery | All Collections' },
    { path: 'build/gallery/buildings.html', canonical: 'https://gallery-rho-two.vercel.app/gallery/buildings', title: 'Buildings | Collections | Pratik Gupta' },
    { path: 'build/gallery/landscape.html', canonical: 'https://gallery-rho-two.vercel.app/gallery/landscape', title: 'Landscape | Collections | Pratik Gupta' },
    { path: 'build/gallery/wildlife.html', canonical: 'https://gallery-rho-two.vercel.app/gallery/wildlife', title: 'Wildlife | Collections | Pratik Gupta' },
    { path: 'build/about.html', canonical: 'https://gallery-rho-two.vercel.app/about', title: 'About | Pratik Gupta — Engineer × Photographer' }
  ];

  for (const r of routesToCheck) {
    const fullPath = path.join(process.cwd(), r.path);
    assert(fs.existsSync(fullPath), `Static route file ${r.path} exists and is exported`);
    if (fs.existsSync(fullPath)) {
      const html = fs.readFileSync(fullPath, 'utf8');
      assert(html.includes(`<title>${r.title}</title>`), `Route ${r.path} has correct title tag`);
      assert(html.includes(`rel="canonical" href="${r.canonical}"`), `Route ${r.path} has valid canonical URL`);
      assert(html.includes('name="description"'), `Route ${r.path} has meta description`);
      assert(html.includes('property="og:title"'), `Route ${r.path} has Open Graph title`);
      // Exactly one h1 per page
      const h1Matches = html.match(/<h1[\s>]/g) || [];
      assert(h1Matches.length === 1, `Route ${r.path} has exactly one <h1> heading (found: ${h1Matches.length})`);
    }
  }

  // ----------------------------------------------------------------
  // 3. BROWSER END-TO-END AUTOMATION VIA CHROME CDP
  // ----------------------------------------------------------------
  console.log('\n3. BROWSER END-TO-END (CHROME 154 CDP):');
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  let cdp;
  try {
    const vRes = await fetch('http://localhost:9223/json/new', { method: 'PUT' });
    const tabInfo = await vRes.json();
    cdp = new ChromeDevToolsClient(tabInfo.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const appUrl = 'http://localhost:5173/';
    await cdp.send('Page.navigate', { url: appUrl });
    await new Promise(r => setTimeout(r, 1000));

    // Page title and heading
    const pageTitle = await cdp.eval('document.title');
    assert(pageTitle.includes('Pratik Gupta'), 'Browser renders valid document title on homepage');

    const h1Text = await cdp.eval('document.querySelector("h1")?.innerText');
    assert(h1Text === 'A different perspective.', 'Hero h1 heading renders "A different perspective."');

    // Navigation items
    const navText = await cdp.eval('Array.from(document.querySelectorAll(".nav-link")).map(a => a.innerText.trim()).join(", ")');
    assert(navText === 'Home, Gallery, About', `Main navigation contains Home, Gallery, About (Found: "${navText}")`);

    // Location badge on hero photo
    const heroBadgeText = await cdp.eval('document.querySelector(".hero-pill-badge")?.innerText.trim()');
    assert(heroBadgeText === '📍 Toronto, Canada', `Hero photo badge accurately displays "📍 Toronto, Canada" (Found: "${heroBadgeText}")`);

    // ----------------------------------------------------------------
    // 4. RESPONSIVE VIEWPORT TESTING & OVERFLOW CHECKS
    // ----------------------------------------------------------------
    console.log('\n4. RESPONSIVE VIEWPORTS & OVERFLOW TESTS:');
    const viewports = [
      { name: 'small-mobile', width: 320, height: 600 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'large-mobile', width: 430, height: 932 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'small-laptop', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'wide-desktop', width: 1920, height: 1080 }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);
      await new Promise(r => setTimeout(r, 300));
      const hasOverflow = await cdp.eval('document.documentElement.scrollWidth > window.innerWidth');
      assert(!hasOverflow, `Viewport ${vp.width}px (${vp.name}) has NO horizontal page overflow`);
      
      const shotPath = path.join(SCREENSHOTS_DIR, `qa_${vp.name}_${vp.width}px.png`);
      await cdp.screenshot(shotPath);
      assert(fs.existsSync(shotPath), `Screenshot successfully captured for ${vp.name} (${vp.width}px)`);
    }

    // Reset to desktop for interaction tests
    await cdp.setViewport(1440, 900);
    await new Promise(r => setTimeout(r, 200));

    // ----------------------------------------------------------------
    // 5. INTERACTIVE CATEGORY FILTERING TESTS
    // ----------------------------------------------------------------
    console.log('\n5. INTERACTIVE CATEGORY FILTERING:');
    const tabCounts = await cdp.eval(`
      Array.from(document.querySelectorAll(".filter-tab-btn")).map(b => ({
        label: b.querySelector(".tab-label")?.innerText.trim(),
        count: b.querySelector(".tab-count")?.innerText.trim()
      }))
    `);
    
    assert(tabCounts.length === 4, 'Interactive filter contains 4 tabs (All, Buildings, Landscape, Wildlife)');
    assert(tabCounts.find(t => t.label === 'All')?.count === '36', 'All filter tab displays 36 photographs');
    assert(tabCounts.find(t => t.label === 'Buildings')?.count === '6', 'Buildings filter tab displays 6 photographs');
    assert(tabCounts.find(t => t.label === 'Landscape')?.count === '9', 'Landscape filter tab displays 9 photographs');
    assert(tabCounts.find(t => t.label === 'Wildlife')?.count === '21', 'Wildlife filter tab displays 21 photographs');

    // Click Buildings filter tab
    await cdp.eval('document.querySelector("#tab-buildings").click()');
    await new Promise(r => setTimeout(r, 400));
    const buildingsGridCount = await cdp.eval('document.querySelectorAll("#gallery-grid .photo-card").length');
    assert(buildingsGridCount === 6, `Clicking Buildings filter displays 6 photographs in grid (Found: ${buildingsGridCount})`);

    const ctaTextBuildings = await cdp.eval('document.querySelector(".gallery-footer-cta a")?.textContent?.trim() || ""');
    assert(ctaTextBuildings.includes('Buildings') && ctaTextBuildings.includes('6'), `CTA dynamically updates for Buildings: "${ctaTextBuildings}"`);

    // Click Landscape filter tab
    await cdp.eval('document.querySelector("#tab-landscape").click()');
    await new Promise(r => setTimeout(r, 400));
    const landscapeGridCount = await cdp.eval('document.querySelectorAll("#gallery-grid .photo-card").length');
    assert(landscapeGridCount === 9, `Clicking Landscape filter displays 9 photographs in grid (Found: ${landscapeGridCount})`);

    // Click Wildlife filter tab
    await cdp.eval('document.querySelector("#tab-wildlife").click()');
    await new Promise(r => setTimeout(r, 400));
    const wildlifeGridCount = await cdp.eval('document.querySelectorAll("#gallery-grid .photo-card").length');
    assert(wildlifeGridCount === 9, `Clicking Wildlife filter displays 9 curated photos in grid (Found: ${wildlifeGridCount})`);

    // Click All filter tab
    await cdp.eval('document.querySelector("#tab-all").click()');
    await new Promise(r => setTimeout(r, 400));
    const allGridCount = await cdp.eval('document.querySelectorAll("#gallery-grid .photo-card").length');
    assert(allGridCount === 9, `Clicking All filter restores 9 curated photographs in grid (Found: ${allGridCount})`);

    // ----------------------------------------------------------------
    // 6. LIGHTBOX VIEWER & KEYBOARD NAVIGATION TESTS
    // ----------------------------------------------------------------
    console.log('\n6. LIGHTBOX VIEWER & ACCESSIBLE CONTROLS:');
    // Open lightbox by clicking first photo card
    await cdp.eval('document.querySelector("#gallery-grid .photo-card").click()');
    await new Promise(r => setTimeout(r, 400));

    const lightboxOpen = await cdp.eval('!!document.querySelector(".lightbox-overlay")');
    assert(lightboxOpen, 'Clicking photo opens Lightbox modal dialog');

    const lightboxBg = await cdp.eval('window.getComputedStyle(document.querySelector(".lightbox-overlay")).backgroundColor');
    assert(lightboxBg === 'rgb(9, 9, 9)', `Lightbox background is fixed #090909 (Found: ${lightboxBg})`);

    const initialCounter = await cdp.eval('document.querySelector(".counter")?.innerText');
    assert(initialCounter.startsWith('1 /'), `Initial lightbox counter starts at 1 (Found: "${initialCounter}")`);

    // Press ArrowRight key to navigate
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight' });
    await new Promise(r => setTimeout(r, 300));
    const nextCounter = await cdp.eval('document.querySelector(".counter")?.innerText');
    assert(nextCounter.startsWith('2 /'), `ArrowRight key advances to next photo (Found: "${nextCounter}")`);

    // Press Escape key to close
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    await new Promise(r => setTimeout(r, 350));
    const lightboxClosed = await cdp.eval('!document.querySelector(".lightbox-overlay")');
    assert(lightboxClosed, 'Escape key closes Lightbox modal dialog');

    // ----------------------------------------------------------------
    // 7. THEME SWITCHING & PERSISTENCE TESTS
    // ----------------------------------------------------------------
    console.log('\n7. THEME SWITCHING & PERSISTENCE:');
    const initialTheme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    assert(initialTheme === 'dark', 'Default theme is dark (#121212)');

    // Toggle to light theme
    await cdp.eval('document.querySelector(".theme-toggle").click()');
    await new Promise(r => setTimeout(r, 200));
    const lightTheme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    assert(lightTheme === 'light', 'Clicking theme toggle switches theme to "light"');

    const lightStorage = await cdp.eval('localStorage.getItem("gallery-theme")');
    assert(lightStorage === 'light', 'Light theme preference saved to localStorage');

    // Toggle back to dark theme
    await cdp.eval('document.querySelector(".theme-toggle").click()');
    await new Promise(r => setTimeout(r, 200));
    const darkTheme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    assert(darkTheme === 'dark', 'Toggling again returns theme to "dark"');

    // ----------------------------------------------------------------
    // 8. MOBILE NAVIGATION DRAWER TESTS
    // ----------------------------------------------------------------
    console.log('\n8. MOBILE NAVIGATION DRAWER:');
    await cdp.setViewport(375, 667);
    await new Promise(r => setTimeout(r, 300));

    await cdp.eval('document.querySelector(".hamburger").click()');
    await new Promise(r => setTimeout(r, 300));
    const menuOpen = await cdp.eval('document.querySelector(".mobile-menu").classList.contains("open")');
    assert(menuOpen, 'Mobile hamburger button opens drawer menu');

    const ariaExpanded = await cdp.eval('document.querySelector(".hamburger").getAttribute("aria-expanded")');
    assert(ariaExpanded === 'true', 'Hamburger aria-expanded attribute updates to true');

    // Close menu by clicking backdrop
    await cdp.eval('document.querySelector(".mobile-backdrop")?.click()');
    await new Promise(r => setTimeout(r, 300));
    const menuClosed = await cdp.eval('!document.querySelector(".mobile-menu").classList.contains("open")');
    assert(menuClosed, 'Clicking backdrop closes mobile drawer menu');

  } finally {
    if (cdp) cdp.close();
    chromeProcess.kill();
  }

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED:      ${passed}`);
  console.log(`FAILED:      ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner execution failed:', err);
  process.exit(1);
});
