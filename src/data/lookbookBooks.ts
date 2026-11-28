export interface GalleryLookItem {
  image: string;
  title: string;
  description: string;
}

/**
 * Curated gallery items from Joie Salon (18 editorial hair, bridal, skincare & nail looks).
 */
export const GALLERY_ITEMS: GalleryLookItem[] = [
  {
    image: '/assets/gallery/feather-layers-blowout.webp',
    title: 'Feather Layers & Blowout',
    description: 'Face-framing feather layers with a bouncy salon blow-dry.',
  },
  {
    image: '/assets/gallery/caramel-balayage-waves.webp',
    title: 'Caramel Honey Balayage',
    description: 'Sun-lit hand-painted balayage curls with glossy keratin shine.',
  },
  {
    image: '/assets/gallery/curtain-bangs-soft-waves.webp',
    title: 'Curtain Bangs & Waves',
    description: 'Wispy soft curtain bangs paired with silky chocolate waves.',
  },
  {
    image: '/assets/gallery/silk-keratin-gloss.webp',
    title: 'Silk Keratin Glass Hair',
    description: 'Mirror-shine smoothing keratin ritual with frizz-free velvet sleekness.',
  },
  {
    image: '/assets/gallery/espresso-butterfly-layers.webp',
    title: 'Butterfly Layers & Gloss',
    description: 'Voluminous butterfly layering with warm mocha-chestnut dimensional tones.',
  },
  {
    image: '/assets/gallery/mogra-gajra-bridal-bun.webp',
    title: 'Mogra Gajra Bridal Bun',
    description: 'Sculpted bridal chignon adorned with fresh jasmine and gold pins.',
  },
  {
    image: '/assets/gallery/pastel-blush-bridal.webp',
    title: 'Pastel Blush Lehenga Bridal',
    description: 'Soft-focus HD bridal makeup, floral low bun & antique-gold dupatta draping.',
  },
  {
    image: '/assets/gallery/emerald-velvet-reception.webp',
    title: 'Emerald Velvet Reception',
    description: 'Champagne-bronze smokey eyes with sculpted glossy Hollywood waves.',
  },
  {
    image: '/assets/gallery/hydra-glow-glass-skin.webp',
    title: 'Hydra-Glow Facial & Brows',
    description: 'Dewy glass-skin radiance with cleanly shaped eyebrows.',
  },
  {
    image: '/assets/gallery/gold-radiance-facial.webp',
    title: '24K Gold Radiance Ritual',
    description: 'Restorative botanical hydration facial for calm, lit-from-within luminosity.',
  },
  {
    image: '/assets/gallery/rose-chrome-nail-couture.webp',
    title: 'Rose & Gold Nail Couture',
    description: 'Almond rose-nude gel extensions with delicate gold-leaf artistry.',
  },
  {
    image: '/assets/gallery/french-pearl-nails.webp',
    title: 'Pearl Glaze & Gold Foil Nails',
    description: 'Sheer pearl-glazed micro French extensions finished with 24K foil accents.',
  },
  {
    image: '/assets/bridals/royal-maroon-bridal.webp',
    title: 'Royal Maroon Bridal',
    description: 'HD airbrush bridal makeup, mogra bun & timeless lehenga draping.',
  },
  {
    image: '/assets/bridals/sangeet-caramel-glam.webp',
    title: 'Sangeet Caramel Glam',
    description: 'Soft bronze smokey eyes and glossy Hollywood waves.',
  },
  {
    image: '/assets/bridals/reception-couture-blowout.webp',
    title: 'Reception Couture Blowout',
    description: 'Lifted crown volume with sleek face-framing layers.',
  },
  {
    image: '/assets/bridals/haldi-dewy-glow.webp',
    title: 'Haldi Dewy Glow',
    description: 'Breathable sunlit makeup with floral-ready messy bun.',
  },
  {
    image: '/assets/bridals/mehndi-nail-couture.webp',
    title: 'Mehndi Nail Couture',
    description: 'Festive gel polish paired with half-up romantic curls.',
  },
  {
    image: '/assets/bridals/engagement-sculpt.webp',
    title: 'Engagement Brow Sculpt',
    description: 'Precision brow framing and camera-ready satin skin finish.',
  },
];

export type BookPageLayout =
  | 'front-cover'
  | 'full-image'
  | 'collage'
  | 'closing'
  | 'back-cover';

export interface BookPageSpec {
  id: string;
  layout: BookPageLayout;
  folio?: string;
  kicker?: string;
  heading?: string;
  body?: string;
  primaryItem?: GalleryLookItem;
  collageItems?: GalleryLookItem[];
  indexItems?: GalleryLookItem[];
  alt: string;
  text: string;
}

export interface LookbookVolume {
  id: string;
  roman: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  editionNote: string;
  coverCloth: string;
  coverClothDeep: string;
  coverFoil: string;
  coverInk: string;
  paperTone: string;
  darkPageTone: string;
  pages: BookPageSpec[];
}

const byImage = (suffix: string): GalleryLookItem => {
  const found = GALLERY_ITEMS.find((item) => item.image.endsWith(suffix));
  if (!found) {
    throw new Error(`Missing gallery item for ${suffix}`);
  }
  return found;
};

const featherLayers = byImage('feather-layers-blowout.webp');
const caramelBalayage = byImage('caramel-balayage-waves.webp');
const curtainBangs = byImage('curtain-bangs-soft-waves.webp');
const silkKeratin = byImage('silk-keratin-gloss.webp');
const butterflyLayers = byImage('espresso-butterfly-layers.webp');
const receptionBlowout = byImage('reception-couture-blowout.webp');

const royalMaroon = byImage('royal-maroon-bridal.webp');
const pastelBlushBridal = byImage('pastel-blush-bridal.webp');
const emeraldReception = byImage('emerald-velvet-reception.webp');
const mograGajra = byImage('mogra-gajra-bridal-bun.webp');
const sangeetGlam = byImage('sangeet-caramel-glam.webp');
const haldiGlow = byImage('haldi-dewy-glow.webp');

const hydraGlow = byImage('hydra-glow-glass-skin.webp');
const goldRadianceFacial = byImage('gold-radiance-facial.webp');
const roseNails = byImage('rose-chrome-nail-couture.webp');
const frenchPearlNails = byImage('french-pearl-nails.webp');
const mehndiNails = byImage('mehndi-nail-couture.webp');
const engagementSculpt = byImage('engagement-sculpt.webp');

export const LOOKBOOK_VOLUMES: LookbookVolume[] = [
  {
    id: 'hair-colour',
    roman: 'VOL. I',
    shortTitle: 'Hair & Colour',
    title: 'Hair & Dimensional Colour',
    subtitle: 'Feather layers, silk keratin gloss, hand-painted caramel tones & couture blowouts',
    editionNote: 'Joie Salon · Archival Lookbook · Rajkot',
    coverCloth: '#232C3B',
    coverClothDeep: '#161D28',
    coverFoil: '#DFC28C',
    coverInk: '#F6F2EA',
    paperTone: '#FAF7F1',
    darkPageTone: '#191C22',
    pages: [
      {
        id: 'vol1-cover',
        layout: 'front-cover',
        kicker: 'JOIE SALON · RAJKOT',
        heading: 'HAIR &\nCOLOUR',
        body: 'Feather layers, silk keratin gloss & hand-painted salon finishes.',
        primaryItem: featherLayers,
        alt: `Volume I Front Cover: ${featherLayers.title}`,
        text: 'Volume I. Hair & Dimensional Colour. Joie Salon, Rajkot.',
      },
      {
        id: 'vol1-p1',
        layout: 'full-image',
        folio: '01',
        kicker: 'FEATURE PLATE',
        heading: featherLayers.title,
        body: featherLayers.description,
        primaryItem: featherLayers,
        alt: `${featherLayers.title}: ${featherLayers.description}`,
        text: `${featherLayers.title}. ${featherLayers.description}`,
      },
      {
        id: 'vol1-p2',
        layout: 'full-image',
        folio: '02',
        kicker: 'BALAYAGE STUDIO',
        heading: caramelBalayage.title,
        body: caramelBalayage.description,
        primaryItem: caramelBalayage,
        alt: `${caramelBalayage.title}: ${caramelBalayage.description}`,
        text: `${caramelBalayage.title}. ${caramelBalayage.description}`,
      },
      {
        id: 'vol1-p3',
        layout: 'full-image',
        folio: '03',
        kicker: 'KERATIN SMOOTHING',
        heading: silkKeratin.title,
        body: silkKeratin.description,
        primaryItem: silkKeratin,
        alt: `${silkKeratin.title}: ${silkKeratin.description}`,
        text: `${silkKeratin.title}. ${silkKeratin.description}`,
      },
      {
        id: 'vol1-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'HAIR ARCHIVE · TRIPTYCH',
        heading: 'Movement, Gloss & Soft Silhouette',
        body: 'Three signature hair finishes crafted at our Jyoti Nagar studio.',
        collageItems: [featherLayers, caramelBalayage, silkKeratin],
        alt: `Collage of ${featherLayers.title}, ${caramelBalayage.title}, and ${silkKeratin.title}`,
        text: `${featherLayers.title}, ${caramelBalayage.title}, and ${silkKeratin.title}.`,
      },
      {
        id: 'vol1-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'SOFT FRAMING',
        heading: curtainBangs.title,
        body: curtainBangs.description,
        primaryItem: curtainBangs,
        alt: `${curtainBangs.title}: ${curtainBangs.description}`,
        text: `${curtainBangs.title}. ${curtainBangs.description}`,
      },
      {
        id: 'vol1-p6',
        layout: 'full-image',
        folio: '06',
        kicker: 'PRECISION LAYERS',
        heading: butterflyLayers.title,
        body: butterflyLayers.description,
        primaryItem: butterflyLayers,
        alt: `${butterflyLayers.title}: ${butterflyLayers.description}`,
        text: `${butterflyLayers.title}. ${butterflyLayers.description}`,
      },
      {
        id: 'vol1-p7',
        layout: 'full-image',
        folio: '07',
        kicker: 'EVENING VOLUME',
        heading: receptionBlowout.title,
        body: receptionBlowout.description,
        primaryItem: receptionBlowout,
        alt: `${receptionBlowout.title}: ${receptionBlowout.description}`,
        text: `${receptionBlowout.title}. ${receptionBlowout.description}`,
      },
      {
        id: 'vol1-p8',
        layout: 'collage',
        folio: '08',
        kicker: 'DIMENSIONAL EDIT · TRIPTYCH',
        heading: 'Layered Volume & Silky Waves',
        body: 'Bespoke blowouts and custom gloss treatments tailored to hair density.',
        collageItems: [butterflyLayers, curtainBangs, receptionBlowout],
        alt: `Collage of ${butterflyLayers.title}, ${curtainBangs.title}, and ${receptionBlowout.title}`,
        text: `${butterflyLayers.title}, ${curtainBangs.title}, and ${receptionBlowout.title}.`,
      },
      {
        id: 'vol1-p9',
        layout: 'full-image',
        folio: '09',
        kicker: 'HOLLYWOOD WAVES',
        heading: sangeetGlam.title,
        body: sangeetGlam.description,
        primaryItem: sangeetGlam,
        alt: `${sangeetGlam.title}: ${sangeetGlam.description}`,
        text: `${sangeetGlam.title}. ${sangeetGlam.description}`,
      },
      {
        id: 'vol1-p10',
        layout: 'closing',
        folio: '10',
        kicker: 'INDEX · VOLUME I',
        heading: 'Hair & Colour Gallery',
        body: 'Curated transformations from Joie Salon, Jyoti Nagar Main Rd, Rajkot.',
        indexItems: [featherLayers, silkKeratin, butterflyLayers, caramelBalayage],
        alt: 'Volume I Photo Gallery',
        text: 'Volume I Index: Feather Layers & Blowout, Silk Keratin Glass Hair, Butterfly Layers & Gloss, Caramel Honey Balayage.',
      },
      {
        id: 'vol1-back',
        layout: 'back-cover',
        kicker: 'JOIE SALON · EDITION 01',
        heading: 'HAIR & DIMENSIONAL COLOUR',
        body: 'Jyoti Nagar Main Rd · Behind Crystal Mall, Rajkot',
        alt: 'Volume I Back Cover',
        text: 'Joie Salon, Rajkot. Hair & Dimensional Colour.',
      },
    ],
  },
  {
    id: 'bridal-studio',
    roman: 'VOL. II',
    shortTitle: 'Bridal Studio',
    title: 'Bridal Studio & Draping',
    subtitle: 'Airbrush bridal artistry, pastel couture, mogra gajra buns & ceremonial glow',
    editionNote: 'Joie Salon · Bridal Monograph · Rajkot',
    coverCloth: '#4A1B25',
    coverClothDeep: '#2D0F16',
    coverFoil: '#E7C88B',
    coverInk: '#FAF3EA',
    paperTone: '#FBF7F0',
    darkPageTone: '#1E1416',
    pages: [
      {
        id: 'vol2-cover',
        layout: 'front-cover',
        kicker: 'JOIE SALON · RAJKOT',
        heading: 'BRIDAL\nSTUDIO',
        body: 'HD airbrush artistry, jasmine chignons & ceremonial draping.',
        primaryItem: royalMaroon,
        alt: `Volume II Front Cover: ${royalMaroon.title}`,
        text: 'Volume II. Bridal Studio & Draping. Joie Salon, Rajkot.',
      },
      {
        id: 'vol2-p1',
        layout: 'full-image',
        folio: '01',
        kicker: 'BRIDAL FEATURE',
        heading: royalMaroon.title,
        body: royalMaroon.description,
        primaryItem: royalMaroon,
        alt: `${royalMaroon.title}: ${royalMaroon.description}`,
        text: `${royalMaroon.title}. ${royalMaroon.description}`,
      },
      {
        id: 'vol2-p2',
        layout: 'full-image',
        folio: '02',
        kicker: 'DAYLIGHT BRIDAL',
        heading: pastelBlushBridal.title,
        body: pastelBlushBridal.description,
        primaryItem: pastelBlushBridal,
        alt: `${pastelBlushBridal.title}: ${pastelBlushBridal.description}`,
        text: `${pastelBlushBridal.title}. ${pastelBlushBridal.description}`,
      },
      {
        id: 'vol2-p3',
        layout: 'full-image',
        folio: '03',
        kicker: 'FLORAL CHIGNON',
        heading: mograGajra.title,
        body: mograGajra.description,
        primaryItem: mograGajra,
        alt: `${mograGajra.title}: ${mograGajra.description}`,
        text: `${mograGajra.title}. ${mograGajra.description}`,
      },
      {
        id: 'vol2-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'CEREMONIAL STORY · TRIPTYCH',
        heading: 'From Pastel Pheras to Royal Maroon',
        body: 'Cohesive hair, floral pinning & luminous bridal skin transitions.',
        collageItems: [royalMaroon, pastelBlushBridal, mograGajra],
        alt: `Collage of ${royalMaroon.title}, ${pastelBlushBridal.title}, and ${mograGajra.title}`,
        text: `${royalMaroon.title}, ${pastelBlushBridal.title}, and ${mograGajra.title}.`,
      },
      {
        id: 'vol2-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'SANGEET EDITION',
        heading: sangeetGlam.title,
        body: sangeetGlam.description,
        primaryItem: sangeetGlam,
        alt: `${sangeetGlam.title}: ${sangeetGlam.description}`,
        text: `${sangeetGlam.title}. ${sangeetGlam.description}`,
      },
      {
        id: 'vol2-p6',
        layout: 'full-image',
        folio: '06',
        kicker: 'RECEPTION COUTURE',
        heading: emeraldReception.title,
        body: emeraldReception.description,
        primaryItem: emeraldReception,
        alt: `${emeraldReception.title}: ${emeraldReception.description}`,
        text: `${emeraldReception.title}. ${emeraldReception.description}`,
      },
      {
        id: 'vol2-p7',
        layout: 'full-image',
        folio: '07',
        kicker: 'DAYLIGHT CEREMONY',
        heading: haldiGlow.title,
        body: haldiGlow.description,
        primaryItem: haldiGlow,
        alt: `${haldiGlow.title}: ${haldiGlow.description}`,
        text: `${haldiGlow.title}. ${haldiGlow.description}`,
      },
      {
        id: 'vol2-p8',
        layout: 'collage',
        folio: '08',
        kicker: 'EVENING GLAM · TRIPTYCH',
        heading: 'Sangeet Nights & Reception Velvet',
        body: 'Long-wear sculpted waves, soft bronze depth & camera-ready radiance.',
        collageItems: [emeraldReception, sangeetGlam, receptionBlowout],
        alt: `Collage of ${emeraldReception.title}, ${sangeetGlam.title}, and ${receptionBlowout.title}`,
        text: `${emeraldReception.title}, ${sangeetGlam.title}, and ${receptionBlowout.title}.`,
      },
      {
        id: 'vol2-p9',
        layout: 'full-image',
        folio: '09',
        kicker: 'RECEPTION HAIR',
        heading: receptionBlowout.title,
        body: receptionBlowout.description,
        primaryItem: receptionBlowout,
        alt: `${receptionBlowout.title}: ${receptionBlowout.description}`,
        text: `${receptionBlowout.title}. ${receptionBlowout.description}`,
      },
      {
        id: 'vol2-p10',
        layout: 'full-image',
        folio: '10',
        kicker: 'ENGAGEMENT MAKEUP',
        heading: engagementSculpt.title,
        body: engagementSculpt.description,
        primaryItem: engagementSculpt,
        alt: `${engagementSculpt.title}: ${engagementSculpt.description}`,
        text: `${engagementSculpt.title}. ${engagementSculpt.description}`,
      },
      {
        id: 'vol2-p11',
        layout: 'full-image',
        folio: '11',
        kicker: 'MEHNDI DETAILS',
        heading: mehndiNails.title,
        body: mehndiNails.description,
        primaryItem: mehndiNails,
        alt: `${mehndiNails.title}: ${mehndiNails.description}`,
        text: `${mehndiNails.title}. ${mehndiNails.description}`,
      },
      {
        id: 'vol2-p12',
        layout: 'closing',
        folio: '12',
        kicker: 'INDEX · VOLUME II',
        heading: 'Bridal Gallery',
        body: 'Dedicated private bridal lounge at Joie Salon, Rajkot.',
        indexItems: [royalMaroon, pastelBlushBridal, emeraldReception, mograGajra],
        alt: 'Volume II Photo Gallery',
        text: 'Volume II Index: Royal Maroon Bridal, Pastel Blush Lehenga Bridal, Emerald Velvet Reception, Mogra Gajra Bridal Bun.',
      },
      {
        id: 'vol2-back',
        layout: 'back-cover',
        kicker: 'JOIE SALON · EDITION 02',
        heading: 'BRIDAL STUDIO & DRAPING',
        body: 'Jyoti Nagar Main Rd · Behind Crystal Mall, Rajkot',
        alt: 'Volume II Back Cover',
        text: 'Joie Salon, Rajkot. Bridal Studio & Draping.',
      },
    ],
  },
  {
    id: 'skin-nails',
    roman: 'VOL. III',
    shortTitle: 'Skin & Couture',
    title: 'Skin, Brows & Nail Couture',
    subtitle: 'Glass-skin hydra facials, 24K gold rituals, brow framing & pearl-foil nail artistry',
    editionNote: 'Joie Salon · Atelier Monograph · Rajkot',
    coverCloth: '#5A3E40',
    coverClothDeep: '#3A2527',
    coverFoil: '#ECD3C1',
    coverInk: '#FAF5F1',
    paperTone: '#FAF7F3',
    darkPageTone: '#1F1919',
    pages: [
      {
        id: 'vol3-cover',
        layout: 'front-cover',
        kicker: 'JOIE SALON · RAJKOT',
        heading: 'SKIN &\nCOUTURE',
        body: 'Hydra-glow glass skin, 24K facials & fine nail artistry.',
        primaryItem: engagementSculpt,
        alt: `Volume III Front Cover: ${engagementSculpt.title}`,
        text: 'Volume III. Skin, Brows & Nail Couture. Joie Salon, Rajkot.',
      },
      {
        id: 'vol3-p1',
        layout: 'full-image',
        folio: '01',
        kicker: 'SKIN FEATURE',
        heading: hydraGlow.title,
        body: hydraGlow.description,
        primaryItem: hydraGlow,
        alt: `${hydraGlow.title}: ${hydraGlow.description}`,
        text: `${hydraGlow.title}. ${hydraGlow.description}`,
      },
      {
        id: 'vol3-p2',
        layout: 'full-image',
        folio: '02',
        kicker: 'BOTANICAL SPA',
        heading: goldRadianceFacial.title,
        body: goldRadianceFacial.description,
        primaryItem: goldRadianceFacial,
        alt: `${goldRadianceFacial.title}: ${goldRadianceFacial.description}`,
        text: `${goldRadianceFacial.title}. ${goldRadianceFacial.description}`,
      },
      {
        id: 'vol3-p3',
        layout: 'full-image',
        folio: '03',
        kicker: 'NAIL ATELIER',
        heading: roseNails.title,
        body: roseNails.description,
        primaryItem: roseNails,
        alt: `${roseNails.title}: ${roseNails.description}`,
        text: `${roseNails.title}. ${roseNails.description}`,
      },
      {
        id: 'vol3-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'ATELIER DETAILS · TRIPTYCH',
        heading: 'Luminance & Fine Detail',
        body: 'Calm skin preparation paired with delicate sculptural nail finishing.',
        collageItems: [hydraGlow, goldRadianceFacial, roseNails],
        alt: `Collage of ${hydraGlow.title}, ${goldRadianceFacial.title}, and ${roseNails.title}`,
        text: `${hydraGlow.title}, ${goldRadianceFacial.title}, and ${roseNails.title}.`,
      },
      {
        id: 'vol3-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'PEARL COUTURE',
        heading: frenchPearlNails.title,
        body: frenchPearlNails.description,
        primaryItem: frenchPearlNails,
        alt: `${frenchPearlNails.title}: ${frenchPearlNails.description}`,
        text: `${frenchPearlNails.title}. ${frenchPearlNails.description}`,
      },
      {
        id: 'vol3-p6',
        layout: 'full-image',
        folio: '06',
        kicker: 'FESTIVE ARTISTRY',
        heading: mehndiNails.title,
        body: mehndiNails.description,
        primaryItem: mehndiNails,
        alt: `${mehndiNails.title}: ${mehndiNails.description}`,
        text: `${mehndiNails.title}. ${mehndiNails.description}`,
      },
      {
        id: 'vol3-p7',
        layout: 'full-image',
        folio: '07',
        kicker: 'ENGAGEMENT EDIT',
        heading: engagementSculpt.title,
        body: engagementSculpt.description,
        primaryItem: engagementSculpt,
        alt: `${engagementSculpt.title}: ${engagementSculpt.description}`,
        text: `${engagementSculpt.title}. ${engagementSculpt.description}`,
      },
      {
        id: 'vol3-p8',
        layout: 'collage',
        folio: '08',
        kicker: 'BRIDAL PREP · TRIPTYCH',
        heading: 'Pre-Wedding Glow & Nail Finishing',
        body: 'Tailored skincare calendars and bespoke nail extensions for every event.',
        collageItems: [frenchPearlNails, mehndiNails, haldiGlow],
        alt: `Collage of ${frenchPearlNails.title}, ${mehndiNails.title}, and ${haldiGlow.title}`,
        text: `${frenchPearlNails.title}, ${mehndiNails.title}, and ${haldiGlow.title}.`,
      },
      {
        id: 'vol3-p9',
        layout: 'full-image',
        folio: '09',
        kicker: 'SUNLIT SKIN',
        heading: haldiGlow.title,
        body: haldiGlow.description,
        primaryItem: haldiGlow,
        alt: `${haldiGlow.title}: ${haldiGlow.description}`,
        text: `${haldiGlow.title}. ${haldiGlow.description}`,
      },
      {
        id: 'vol3-p10',
        layout: 'closing',
        folio: '10',
        kicker: 'INDEX · VOLUME III',
        heading: 'Skin & Nail Gallery',
        body: 'Book a tailored consultation at Joie Salon, Rajkot.',
        indexItems: [hydraGlow, goldRadianceFacial, roseNails, frenchPearlNails],
        alt: 'Volume III Photo Gallery',
        text: 'Volume III Index: Hydra-Glow Facial & Brows, 24K Gold Radiance Ritual, Rose & Gold Nail Couture, Pearl Glaze & Gold Foil Nails.',
      },
      {
        id: 'vol3-back',
        layout: 'back-cover',
        kicker: 'JOIE SALON · EDITION 03',
        heading: 'SKIN, BROWS & NAIL COUTURE',
        body: 'Jyoti Nagar Main Rd · Behind Crystal Mall, Rajkot',
        alt: 'Volume III Back Cover',
        text: 'Joie Salon, Rajkot. Skin, Brows & Nail Couture.',
      },
    ],
  },
];
