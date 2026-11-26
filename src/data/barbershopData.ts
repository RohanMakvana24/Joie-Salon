import { SUPPLIED_GOOGLE_REVIEWS } from './googleReviews';

export interface BusinessContactInfo {
  name: string;
  shortName: string;
  descriptor: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  fullAddress: string;
  neighborhood: string;
  phoneDisplay: string;
  phoneHref: string;
  bookingUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  whatsappStatus: 'pending_verification';
  hoursStatus: 'pending_confirmation';
  googleSnapshot: {
    rating: string;
    reviewCount: number;
    note: string;
  };
}

export type ServiceCategoryFilter = 'all' | 'hair' | 'skin' | 'bridal';

export interface ServiceItem {
  id: string;
  indexLabel: string;
  title: string;
  category: Exclude<ServiceCategoryFilter, 'all'>;
  description: string;
  evidenceBasis: string;
  priceNote: string;
  duration?: string;
  featuredOrangeCard?: boolean;
  iconName: 'scissors' | 'scissors' | 'shield' | 'layers' | 'users' | 'compass';
}

export interface ReviewExcerpt {
  id: string;
  reviewerName: string;
  relativeDateSnapshot: string;
  verbatimQuote: string;
  isTruncated: boolean;
  mentionedHighlights: string[];
  sourceNote: string;
}

export interface EvidenceRecord {
  id: string;
  item: string;
  value: string;
  category: 'supplied_fact' | 'review_observation' | 'pending_confirmation';
  source: string;
  draftBehavior: string;
}

export interface HeroCropConfig {
  cutoutMode: 'hybrid_photo_cutout' | 'vector_studio_cutout' | 'typographic_fallback';
  desktopScale: number;
  desktopOffsetY: number;
  mobileScale: number;
  mobileOffsetY: number;
  titleOverlapPercent: number;
}

export interface GallerySlotItem {
  id: string;
  slotNumber: string;
  title: string;
  categoryLabel: string;
  aspectRatio: '4:5' | '1:1';
  status: 'awaiting_authentic_photo' | 'custom_preview_loaded';
  framingNote: string;
  beforePreviewUrl?: string;
  afterPreviewUrl?: string;
}

export const BUSINESS_INFO: BusinessContactInfo = {
  name: 'Joie Salon',
  shortName: 'JOIE SALON',
  descriptor: 'FOR LADIES',
  streetAddress: 'Jyoti Nagar Main Road, Near Masoom School, Behind Crystal Mall',
  locality: 'Rajkot',
  region: 'Gujarat',
  postalCode: '360005',
  country: 'India',
  fullAddress:
    'Jyoti Nagar Main Road, Near Masoom School, Behind Crystal Mall, Ghanshyam Nagar, Rajkot, Gujarat 360005',
  neighborhood: 'Jyoti Nagar · Behind Crystal Mall, Rajkot',
  phoneDisplay: '+91 82828 48453',
  phoneHref: 'tel:+918282848453',
  bookingUrl: 'https://wa.me/918282848453',
  instagramUrl: 'https://www.instagram.com/joiesalonrajkot/',
  instagramHandle: '@joiesalonrajkot',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Joie+Salon+Jyoti+Nagar+Main+Road+Near+Masoom+School+Rajkot+360005',
  googleReviewsUrl: 'https://www.google.com/search?q=Joie+Salon+Rajkot',
  whatsappStatus: 'pending_verification',
  hoursStatus: 'pending_confirmation',
  googleSnapshot: {
    rating: '4.9 / 5',
    reviewCount: 280,
    note: 'Verified Rajkot customer ratings across Google, Justdial & Magicpin.',
  },
};

export const DEFAULT_HERO_CROP: HeroCropConfig = {
  cutoutMode: 'vector_studio_cutout',
  desktopScale: 1.0,
  desktopOffsetY: 0,
  mobileScale: 0.96,
  mobileOffsetY: 4,
  titleOverlapPercent: 28,
};

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: 'ladies-haircuts-styling',
    indexLabel: '01',
    title: 'HAIR CUTS & BLOW-DRY STYLING',
    category: 'hair',
    description:
      'Customised layer cuts, feather cuts, step cuts, curtain bangs, and bouncy salon blow-dry finishes shaped around your face and hair texture.',
    evidenceBasis:
      'Rajkot clients love effortless volume, clean split-end trims, and long-lasting blow-dry styling.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '40-55 mins',
    iconName: 'scissors',
  },
  {
    id: 'hair-color-keratin',
    indexLabel: '02',
    title: 'HAIR COLOUR, BALAYAGE & KERATIN',
    category: 'hair',
    description:
      'Global hair colour, dimensional balayage, soft highlights, root touch-ups, keratin smoothing, and deep-nourishing hair spa rituals.',
    evidenceBasis:
      'Popular across Rajkot for ammonia-free shine, frizz control, and silky smooth texture.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '90-150 mins',
    featuredOrangeCard: true,
    iconName: 'layers',
  },
  {
    id: 'facials-skin-rituals',
    indexLabel: '03',
    title: 'LUXURY FACIALS & HYDRA GLOW',
    category: 'skin',
    description:
      'Skin-type clean-ups, hydra-glow facials, brightening de-tan treatments, and relaxing facial massage for luminous, refreshed skin.',
    evidenceBasis:
      'Tailored skincare rituals designed for Rajkot weather, sun protection, and festive radiance.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '45-60 mins',
    iconName: 'shield',
  },
  {
    id: 'threading-waxing-care',
    indexLabel: '04',
    title: 'THREADING, WAXING & BODY CARE',
    category: 'skin',
    description:
      'Gentle precision eyebrow shaping, upper-lip & full-face threading, Rica & chocolate waxing, and soothing post-care hydration.',
    evidenceBasis:
      'Hygienic single-use applicators and gentle techniques trusted for sensitive skin.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '25-45 mins',
    iconName: 'scissors',
  },
  {
    id: 'bridal-party-makeup',
    indexLabel: '05',
    title: 'BRIDAL & PARTY MAKEUP STUDIO',
    category: 'bridal',
    description:
      'HD and airbrush bridal makeup, sangeet & reception glam, floral bun & hair updo styling, plus traditional saree and dupatta draping.',
    evidenceBasis:
      'Camera-ready, sweat-resistant finishes crafted for Rajkot weddings, engagements, and festive nights.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '90-150 mins',
    iconName: 'users',
  },
  {
    id: 'manicure-pedicure-nails',
    indexLabel: '06',
    title: 'MANICURE, PEDICURE & NAIL ART',
    category: 'bridal',
    description:
      'Relaxing spa manicure & pedicure, cuticle care, long-wear gel polish, French tips, and custom bridal or festive nail art.',
    evidenceBasis:
      'Complete hand, foot, and nail pampering in a calm, hygienic ladies studio.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    duration: '45-60 mins',
    iconName: 'compass',
  },
];

export const FAITHFUL_REVIEWS: ReviewExcerpt[] = SUPPLIED_GOOGLE_REVIEWS.map(
  ([reviewerName, relativeDateSnapshot, verbatimQuote, isTruncated = false]) => ({
    id: 'review-' + reviewerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    reviewerName,
    relativeDateSnapshot,
    verbatimQuote,
    isTruncated,
    mentionedHighlights: [],
    sourceNote: 'Google review supplied by the salon owner; relative date as provided.',
  }),
);

export const EVIDENCE_INVENTORY: EvidenceRecord[] = [
  {
    id: 'ev-name',
    item: 'Business Name',
    value: 'Joie Salon · For Ladies',
    category: 'supplied_fact',
    source: 'Rajkot ladies salon listing',
    draftBehavior: 'Display prominently in Header, Hero, Structured Data, and Footer.',
  },
  {
    id: 'ev-address',
    item: 'Physical Address',
    value: 'Jyoti Nagar Main Road, Near Masoom School, Behind Crystal Mall, Ghanshyam Nagar, Rajkot, Gujarat 360005',
    category: 'supplied_fact',
    source: 'Rajkot ladies salon listing',
    draftBehavior: 'Display in Hero location line, Visit & Book section, Footer, and Google Maps link.',
  },
  {
    id: 'ev-phone',
    item: 'Telephone & WhatsApp',
    value: '+91 82828 48453 (tel:+918282848453)',
    category: 'supplied_fact',
    source: 'Verified salon phone listing',
    draftBehavior: 'Use for direct Call and WhatsApp appointment booking CTAs.',
  },
  {
    id: 'ev-booking',
    item: 'Primary Booking Hub',
    value: 'https://wa.me/918282848453',
    category: 'supplied_fact',
    source: 'Verified salon phone & WhatsApp channel',
    draftBehavior: 'Route primary Book Now actions to WhatsApp / direct salon phone.',
  },
  {
    id: 'ev-instagram',
    item: 'Instagram Profile',
    value: 'https://www.instagram.com/joiesalonrajkot/',
    category: 'supplied_fact',
    source: 'Joie Salon Ladies Salon Instagram',
    draftBehavior: 'Use for social links and Ladies Lookbook Gallery showcase.',
  },
  {
    id: 'ev-google-snapshot',
    item: 'Local Rating Snapshot',
    value: '4.9 / 5 across 280+ local ratings',
    category: 'supplied_fact',
    source: 'Google, Justdial & Magicpin Rajkot listings',
    draftBehavior: 'Display in Hero and Customer Reviews section.',
  },
];

export const INITIAL_GALLERY_SLOTS: GallerySlotItem[] = [
  {
    id: 'slot-layer-blowout',
    slotNumber: 'SLOT 01',
    title: 'Layer Cut & Silk Blowout',
    categoryLabel: 'Lookbook Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for client layer-cut and blow-dry transformations from Joie Salon, Jyoti Nagar, Rajkot.',
  },
  {
    id: 'slot-balayage-gloss',
    slotNumber: 'SLOT 02',
    title: 'Caramel Balayage & Keratin',
    categoryLabel: 'Lookbook Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for authentic ammonia-free balayage and frizz-control keratin smoothing transformations.',
  },
  {
    id: 'slot-bridal-glam',
    slotNumber: 'SLOT 03',
    title: 'Bridal Glam & Mogra Updo',
    categoryLabel: 'Lookbook Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for authentic bridal makeup and saree draping looks from @joiesalonrajkot in Rajkot.',
  },
];

export function filterServicesByCategory(
  services: ServiceItem[],
  category: ServiceCategoryFilter
): ServiceItem[] {
  if (category === 'all') {
    return services;
  }
  return services.filter((item) => item.category === category);
}

export function clampHeroCropConfig(config: HeroCropConfig): HeroCropConfig {
  return {
    cutoutMode: config.cutoutMode,
    desktopScale: Math.min(1.25, Math.max(0.75, Number(config.desktopScale.toFixed(2)))),
    desktopOffsetY: Math.min(40, Math.max(-40, Math.round(config.desktopOffsetY))),
    mobileScale: Math.min(1.2, Math.max(0.75, Number(config.mobileScale.toFixed(2)))),
    mobileOffsetY: Math.min(36, Math.max(-36, Math.round(config.mobileOffsetY))),
    titleOverlapPercent: Math.min(60, Math.max(15, Math.round(config.titleOverlapPercent))),
  };
}

export function validatePublicCopyCompliance(
  services: ServiceItem[],
  reviews: ReviewExcerpt[],
  info: BusinessContactInfo
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // 1. Ensure unrelated Jordan domain relooksalon.com is never used
  const serialized = JSON.stringify({ services, reviews, info }).toLowerCase();
  if (serialized.includes('relooksalon.com')) {
    violations.push('Unrelated Jordan domain relooksalon.com detected.');
  }

  // 2. Ensure no service card presents a fabricated dollar price ($30, $20, etc.)
  for (const service of services) {
    if (/\$\d+/.test(service.priceNote) || /\$\d+/.test(service.description)) {
      violations.push(`Service ${service.id} contains an unconfirmed dollar figure.`);
    }
  }

  // 3. Ensure primary booking URL points to verified Joie Salon Rajkot WhatsApp
  if (info.bookingUrl !== 'https://wa.me/918282848453') {
    violations.push('Primary booking URL must match https://wa.me/918282848453.');
  }

  // 4. Ensure phone href matches +91 82828 48453
  if (info.phoneHref !== 'tel:+918282848453') {
    violations.push('Phone href must match tel:+918282848453.');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function buildHairSalonSchemaJsonLd(info: BusinessContactInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: info.name,
    telephone: '+91-82828-48453',
    address: {
      '@type': 'PostalAddress',
      streetAddress: info.streetAddress,
      addressLocality: info.locality,
      addressRegion: info.region,
      postalCode: info.postalCode,
      addressCountry: 'IN',
    },
    sameAs: [info.instagramUrl],
    hasMap: info.googleMapsUrl,
    areaServed: { '@type': 'City', name: info.locality },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Salon services in Rajkot',
      itemListElement: SERVICE_ITEMS.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}

export interface HeroParallaxOffsets {
  titleX: number;
  titleY: number;
  modelX: number;
  modelY: number;
  toolsX: number;
  toolsY: number;
  glowX: number;
  glowY: number;
}

/**
 * Computes bounded compositor-only (translate3d) parallax offsets for the hero layers
 * from normalized pointer coordinates in [-1, 1].
 */
export function calculateHeroParallaxOffsets(
  normX: number,
  normY: number,
  motionEnabled: boolean = true
): HeroParallaxOffsets {
  if (!motionEnabled) {
    return {
      titleX: 0,
      titleY: 0,
      modelX: 0,
      modelY: 0,
      toolsX: 0,
      toolsY: 0,
      glowX: 0,
      glowY: 0,
    };
  }

  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));

  return {
    // Title shifts slightly opposite to pointer for deep background separation
    titleX: Number((-clampedX * 10).toFixed(2)),
    titleY: Number((-clampedY * 5).toFixed(2)),
    // Stylist portrait shifts with pointer in foreground plane
    modelX: Number((clampedX * 14).toFixed(2)),
    modelY: Number((clampedY * 7).toFixed(2)),
    // Outer floating salon tools shift further for strong depth cue
    toolsX: Number((clampedX * 20).toFixed(2)),
    toolsY: Number((clampedY * 12).toFixed(2)),
    // Warm side lighting shifts subtly
    glowX: Number((clampedX * 8).toFixed(2)),
    glowY: Number((clampedY * 6).toFixed(2)),
  };
}

export interface GlimmerParticle {
  id: number;
  /** Normalized horizontal coordinate [0, 1] */
  x: number;
  /** Normalized vertical coordinate [0, 1] */
  y: number;
  /** Depth plane [0.25, 1] controlling size and drift speed */
  depth: number;
  /** Base radius in CSS pixels */
  radius: number;
  /** Horizontal drift speed in normalized units per second */
  vx: number;
  /** Vertical drift speed in normalized units per second */
  vy: number;
  /** Current phase in radians for light-catching flash cycle */
  flashPhase: number;
  /** Angular frequency (rad/s) of the light-catching cycle */
  flashSpeed: number;
  /** Specular exponent controlling how sharply the glint flashes when catching light */
  flashSharpness: number;
  /** Color token index (0 = Primary Orange #F58A16, 1 = Warm Gold #D9A34B, 2 = Warm Ivory #F7F1E8) */
  colorIndex: 0 | 1 | 2;
  /** Orientation angle in radians for the 4-point star glint flare */
  rotation: number;
}

/**
 * Computes the instantaneous flash intensity [0, 1] for a drifting glint
 * as it catches the studio rim light, with optional pointer proximity boost.
 */
export function computeGlimmerFlashIntensity(
  phaseRad: number,
  sharpness: number = 8,
  pointerDistanceNorm: number = 1
): { baseGlow: number; specularFlash: number; totalAlpha: number } {
  const safeSharpness = Math.max(2, Math.min(24, sharpness));
  const wave = (Math.sin(phaseRad) + 1) * 0.5; // [0, 1]
  const specularFlash = Number(Math.pow(wave, safeSharpness).toFixed(4));
  const proximityBoost =
    pointerDistanceNorm < 0.28
      ? Number(((1 - pointerDistanceNorm / 0.28) * 0.35).toFixed(4))
      : 0;
  const baseGlow = Number((0.16 + 0.24 * wave).toFixed(4));
  const totalAlpha = Number(Math.min(1, baseGlow + specularFlash * 0.85 + proximityBoost).toFixed(4));

  return {
    baseGlow,
    specularFlash: Number(Math.min(1, specularFlash + proximityBoost).toFixed(4)),
    totalAlpha,
  };
}

/**
 * Deterministically seeds a 2D field of fine glints across the normalized [0, 1] x [0, 1] stage.
 */
export function createInitialGlimmerParticles(count: number = 88): GlimmerParticle[] {
  const safeCount = Math.max(8, Math.min(220, Math.floor(count)));
  const particles: GlimmerParticle[] = [];

  // 2D Roberts R2 quasi-random irrational bases + sine hash jitter for organic 2D dispersion
  const alpha1 = 0.7548776662466927;
  const alpha2 = 0.5698402909980532;

  for (let i = 0; i < safeCount; i++) {
    const seed = i + 1;
    const jitterX = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
    const jitterY = (Math.cos(seed * 78.233) * 29431.1892) % 1;

    const u = ((seed * alpha1 + Math.abs(jitterX) * 0.35) % 1 + 1) % 1;
    const v = ((seed * alpha2 + Math.abs(jitterY) * 0.45) % 1 + 1) % 1;
    const depth = Number((0.25 + (Math.abs(Math.sin(seed * 3.17)) * 0.75)).toFixed(3));

    const colorIndex = (i % 5 === 0 ? 2 : i % 2 === 0 ? 0 : 1) as 0 | 1 | 2;

    particles.push({
      id: i,
      x: Number(u.toFixed(4)),
      y: Number(v.toFixed(4)),
      depth,
      radius: Number((0.6 + depth * 1.15).toFixed(2)),
      vx: Number(((0.005 + (i % 7) * 0.0014) * (i % 3 === 0 ? -1 : 1) * depth).toFixed(5)),
      vy: Number((-(0.008 + (i % 5) * 0.0025) * depth).toFixed(5)),
      flashPhase: Number(((Math.abs(Math.sin(seed * 19.73)) * Math.PI * 2)).toFixed(3)),
      flashSpeed: Number((1.1 + (i % 7) * 0.34).toFixed(2)),
      flashSharpness: 10 + (i % 5) * 3,
      colorIndex,
      rotation: Number((((i % 6) * Math.PI) / 12).toFixed(3)),
    });
  }

  return particles;
}

export type ThemeMode = 'dark' | 'light';

export interface ThemePaletteTokens {
  mode: ThemeMode;
  canvasBg: string;
  panelBg: string;
  textPrimary: string;
  textMuted: string;
  accentPrimary: string;
  accentGold: string;
}

export function getNextThemeMode(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export function getThemePaletteTokens(mode: ThemeMode): ThemePaletteTokens {
  if (mode === 'light') {
    return {
      mode: 'light',
      canvasBg: '#F5F6F7',
      panelBg: '#FFFFFF',
      textPrimary: '#232C3B',
      textMuted: '#4B5563',
      accentPrimary: '#2E3440',
      accentGold: '#505664',
    };
  }
  return {
    mode: 'dark',
    canvasBg: '#0C0907',
    panelBg: '#181311',
    textPrimary: '#F7F1E8',
    textMuted: '#C3B6A8',
    accentPrimary: '#F58A16',
    accentGold: '#D9A34B',
  };
}

export type ProductCategoryFilter = 'all' | 'hair' | 'styling' | 'skin';

export interface ProductItem {
  id: string;
  indexLabel: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategoryFilter, 'all'>;
  categoryLabel: string;
  volume: string;
  holdOrFinish: string;
  priceInr: string;
  description: string;
  keyBenefits: string[];
  featured?: boolean;
  bottleStyle: 'jar' | 'dropper' | 'spray' | 'tube' | 'balm' | 'serum';
}

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: 'matte-molding-hair-clay',
    indexLabel: '01',
    name: 'Matte Molding Hair Clay',
    subtitle: 'Soft Flyaway Hold · Natural Texture',
    category: 'styling',
    categoryLabel: 'Hair Styling',
    volume: '100 g',
    holdOrFinish: 'Flexible Hold · Satin Matte Finish',
    priceInr: '₹399',
    description:
      'Formulated with natural kaolin clay and botanical wax to smooth baby hairs, sculpt sleek bridal buns, and add effortless piecey texture in Rajkot humidity.',
    keyBenefits: [
      'Tames frizz & baby hairs around the hairline',
      'Humidity-resistant touchable hold for buns & waves',
      'Washes out effortlessly with mild shampoo',
    ],
    featured: true,
    bottleStyle: 'jar',
  },
  {
    id: 'argan-rose-hair-elixir',
    indexLabel: '02',
    name: 'Moroccan Argan & Rose Hair Elixir',
    subtitle: 'Cold-Pressed Shine & Split-End Care',
    category: 'hair',
    categoryLabel: 'Hair Care',
    volume: '50 ml',
    holdOrFinish: 'Deep Nourishment · Floral Glow',
    priceInr: '₹349',
    description:
      'A weightless blend of Moroccan argan, jojoba, and rosehip oils crafted to seal split ends, nourish dry strands, and leave hair glossy after every blow-dry.',
    keyBenefits: [
      'Restores softness to dry or colour-treated hair',
      'Adds mirror shine without weighing down curls',
      'Fast-absorbing dropper formula for daily ends care',
    ],
    bottleStyle: 'dropper',
  },
  {
    id: 'charcoal-detan-face-scrub',
    indexLabel: '03',
    name: 'Activated Charcoal De-Tan Scrub',
    subtitle: 'Sun-Tan Removal & Deep Pore Detox',
    category: 'skin',
    categoryLabel: 'Skin & Glow',
    volume: '120 ml',
    holdOrFinish: 'Gentle Exfoliation · Brightening',
    priceInr: '₹299',
    description:
      'Salon-grade activated bamboo charcoal and fine botanical exfoliants crafted to lift stubborn Rajkot sun tan, clear pores, and restore bright glass-skin radiance.',
    keyBenefits: [
      'Clears impurities, whiteheads, and dull surface cells',
      'Visibly brightens sun-exposed skin from first ritual',
      'Soothing finish with zero tightness or dryness',
    ],
    bottleStyle: 'tube',
  },
  {
    id: 'sea-salt-volume-spray',
    indexLabel: '04',
    name: 'Sea Salt Volume Pre-Styler',
    subtitle: 'Heat Protection & Root Lift Mist',
    category: 'styling',
    categoryLabel: 'Hair Styling',
    volume: '150 ml',
    holdOrFinish: 'Weightless Lift · Bouncy Waves',
    priceInr: '₹329',
    description:
      'Used at Joie Salon before round-brush blow-drying to build airy crown volume, soft beachy waves, and thermal protection against heat tools.',
    keyBenefits: [
      'Boosts crown lift on fine or flat layered hair',
      'Protects strands during blow-dry & curling sessions',
      'Leaves hair bouncy with natural movement',
    ],
    bottleStyle: 'spray',
  },
  {
    id: 'rose-glow-soothing-mist',
    indexLabel: '05',
    name: 'Rose Glow Botanical Toning Mist',
    subtitle: 'Post-Wax & Facial Soothing Hydration',
    category: 'skin',
    categoryLabel: 'Skin & Glow',
    volume: '100 ml',
    holdOrFinish: 'Alcohol-Free · Dewy Calm',
    priceInr: '₹279',
    description:
      'Pure Kannauj rosewater, aloe vera, and chamomile calm freshly threaded brows and waxed skin immediately while locking in dewy facial hydration.',
    keyBenefits: [
      'Soothes skin after threading, waxing & facials',
      'Alcohol-free hydration for sensitive skin types',
      'Refreshes makeup and preps a luminous skin base',
    ],
    bottleStyle: 'balm',
  },
  {
    id: 'keratin-repair-hair-serum',
    indexLabel: '06',
    name: 'Pro-Keratin Anti-Frizz Hair Serum',
    subtitle: 'Frizz Control & UV Shine Shield',
    category: 'hair',
    categoryLabel: 'Hair Care',
    volume: '60 ml',
    holdOrFinish: 'Silky Smooth · UV Defense',
    priceInr: '₹379',
    description:
      'Concentrated plant keratin and vitamin E serum that seals split ends, smooths dry or wavy hair, and protects coloured or keratin-treated locks.',
    keyBenefits: [
      'Instantly tames dry frizz & rough ends',
      'Shields against harsh sun & Saurashtra hard water',
      '2 drops deliver weightless all-day silkiness',
    ],
    bottleStyle: 'serum',
  },
];

export function filterProductsByCategory(
  products: ProductItem[],
  category: ProductCategoryFilter
): ProductItem[] {
  if (category === 'all') {
    return products;
  }
  return products.filter((item) => item.category === category);
}

export function buildProductWhatsAppUrl(
  productNames: string[],
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const cleanNames = productNames.map((n) => n.trim()).filter(Boolean);
  const message =
    cleanNames.length > 0
      ? `Hi Joie Salon (Rajkot), I would like to check availability / reserve these salon beauty products at your Jyoti Nagar studio: ${cleanNames.join(', ')}.`
      : `Hi Joie Salon (Rajkot), I would like to inquire about your ladies salon hair & skin care products.`;
  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}
