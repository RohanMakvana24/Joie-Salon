import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUSINESS_INFO,
  SERVICE_ITEMS,
  FAITHFUL_REVIEWS,
  DEFAULT_HERO_CROP,
  filterServicesByCategory,
  clampHeroCropConfig,
  validatePublicCopyCompliance,
  buildHairSalonSchemaJsonLd,
  calculateHeroParallaxOffsets,
  computeGlimmerFlashIntensity,
  createInitialGlimmerParticles,
  getNextThemeMode,
  getThemePaletteTokens,
  PRODUCT_ITEMS,
  filterProductsByCategory,
  buildProductWhatsAppUrl,
} from './barbershopData';

test('filterServicesByCategory returns all 6 items for "all" and filters subsets accurately', () => {
  const all = filterServicesByCategory(SERVICE_ITEMS, 'all');
  assert.equal(all.length, 6);

  const hair = filterServicesByCategory(SERVICE_ITEMS, 'hair');
  assert.equal(hair.length, 2);
  assert.ok(hair.every((s) => s.category === 'hair'));

  const skin = filterServicesByCategory(SERVICE_ITEMS, 'skin');
  assert.equal(skin.length, 2);
  assert.ok(skin.every((s) => s.category === 'skin'));

  const bridal = filterServicesByCategory(SERVICE_ITEMS, 'bridal');
  assert.equal(bridal.length, 2);
  assert.ok(bridal.every((s) => s.category === 'bridal'));
});

test('validatePublicCopyCompliance passes for official Joie Salon Rajkot data and catches unconfirmed prices or unrelated domain', () => {
  const compliance = validatePublicCopyCompliance(SERVICE_ITEMS, FAITHFUL_REVIEWS, BUSINESS_INFO);
  assert.equal(compliance.valid, true);
  assert.deepEqual(compliance.violations, []);

  // Verify it catches a fabricated dollar price in a service card
  const badServices = [
    ...SERVICE_ITEMS,
    {
      ...SERVICE_ITEMS[0],
      id: 'fake-price-card',
      priceNote: 'Starting at $30',
    },
  ];
  const badResult = validatePublicCopyCompliance(badServices, FAITHFUL_REVIEWS, BUSINESS_INFO);
  assert.equal(badResult.valid, false);
  assert.ok(badResult.violations.some((v) => v.includes('fake-price-card')));
});

test('clampHeroCropConfig constrains scale, offset, and overlap within safe responsive bounds', () => {
  const clamped = clampHeroCropConfig({
    cutoutMode: 'hybrid_photo_cutout',
    desktopScale: 2.5,
    desktopOffsetY: -99,
    mobileScale: 0.4,
    mobileOffsetY: 99,
    titleOverlapPercent: 95,
  });

  assert.equal(clamped.desktopScale, 1.25);
  assert.equal(clamped.desktopOffsetY, -40);
  assert.equal(clamped.mobileScale, 0.75);
  assert.equal(clamped.mobileOffsetY, 36);
  assert.equal(clamped.titleOverlapPercent, 60);
  assert.equal(DEFAULT_HERO_CROP.cutoutMode, 'vector_studio_cutout');
});

test('buildHairSalonSchemaJsonLd includes verified Joie Salon Rajkot fields without fabricated ratings or hours', () => {
  const schema = buildHairSalonSchemaJsonLd(BUSINESS_INFO) as Record<string, unknown>;
  assert.equal(schema['@type'], 'HairSalon');
  assert.equal(schema.name, 'Joie Salon');
  assert.equal(schema.telephone, '+91-82828-48453');
  assert.equal('aggregateRating' in schema, false);
  assert.equal('openingHours' in schema, false);
  assert.equal('priceRange' in schema, false);
});

test('calculateHeroParallaxOffsets separates title and model planes in opposite directions and zeroes out when disabled', () => {
  const active = calculateHeroParallaxOffsets(0.5, -0.5, true);
  assert.equal(active.titleX, -5);
  assert.equal(active.modelX, 7);
  assert.equal(active.toolsX, 10);

  const disabled = calculateHeroParallaxOffsets(0.8, 0.8, false);
  assert.equal(disabled.titleX, 0);
  assert.equal(disabled.modelX, 0);
  assert.equal(disabled.toolsX, 0);
});

test('createInitialGlimmerParticles and computeGlimmerFlashIntensity produce bounded glints that peak at sin(phase)=1', () => {
  const particles = createInitialGlimmerParticles(64);
  assert.equal(particles.length, 64);
  assert.ok(particles.every((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1));

  // At phase = PI/2 (sin = 1), the glint catches maximum light
  const peak = computeGlimmerFlashIntensity(Math.PI / 2, 10, 1);
  // At phase = -PI/2 (sin = -1), specular flash is 0
  const trough = computeGlimmerFlashIntensity(-Math.PI / 2, 10, 1);

  assert.equal(peak.specularFlash, 1);
  assert.equal(trough.specularFlash, 0);
  assert.ok(peak.totalAlpha > trough.totalAlpha);
});

test('getNextThemeMode and getThemePaletteTokens toggle cleanly between dark and light palettes', () => {
  assert.equal(getNextThemeMode('dark'), 'light');
  assert.equal(getNextThemeMode('light'), 'dark');

  const darkTokens = getThemePaletteTokens('dark');
  const lightTokens = getThemePaletteTokens('light');
  assert.equal(darkTokens.canvasBg, '#0C0907');
  assert.equal(lightTokens.canvasBg, '#F5F6F7');
  assert.notEqual(darkTokens.textPrimary, lightTokens.textPrimary);
});

test('filterProductsByCategory and buildProductWhatsAppUrl filter and format salon products accurately', () => {
  const allProducts = filterProductsByCategory(PRODUCT_ITEMS, 'all');
  assert.equal(allProducts.length, 6);

  const hairProducts = filterProductsByCategory(PRODUCT_ITEMS, 'hair');
  assert.equal(hairProducts.length, 2);
  assert.ok(hairProducts.every((p) => p.category === 'hair'));

  const stylingProducts = filterProductsByCategory(PRODUCT_ITEMS, 'styling');
  assert.equal(stylingProducts.length, 2);
  assert.ok(stylingProducts.every((p) => p.category === 'styling'));

  const skinProducts = filterProductsByCategory(PRODUCT_ITEMS, 'skin');
  assert.equal(skinProducts.length, 2);
  assert.ok(skinProducts.every((p) => p.category === 'skin'));

  const waUrl = buildProductWhatsAppUrl(['Matte Molding Hair Clay', 'Moroccan Argan & Rose Hair Elixir']);
  assert.ok(waUrl.startsWith('https://wa.me/919624396903?text='));
  assert.ok(decodeURIComponent(waUrl).includes('Matte Molding Hair Clay'));
  assert.ok(decodeURIComponent(waUrl).includes('Moroccan Argan & Rose Hair Elixir'));
});
