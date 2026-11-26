export interface GalleryLookItem {
  image: string;
  title: string;
  description: string;
}

/**
 * Preserved original gallery items from Joie Salon (all 12 images, titles, and descriptions).
 */
export const GALLERY_ITEMS: GalleryLookItem[] = [
  {
    image: '/assets/gallery/feather-layers-blowout.jpg',
    title: 'Feather Layers & Blowout',
    description: 'Face-framing feather layers with a bouncy salon blow-dry.',
  },
  {
    image: '/assets/gallery/caramel-balayage-waves.jpg',
    title: 'Caramel Honey Balayage',
    description: 'Sun-lit hand-painted balayage curls with glossy keratin shine.',
  },
  {
    image: '/assets/gallery/curtain-bangs-soft-waves.jpg',
    title: 'Curtain Bangs & Waves',
    description: 'Wispy soft curtain bangs paired with silky chocolate waves.',
  },
  {
    image: '/assets/gallery/mogra-gajra-bridal-bun.jpg',
    title: 'Mogra Gajra Bridal Bun',
    description: 'Sculpted bridal chignon adorned with fresh jasmine and gold pins.',
  },
  {
    image: '/assets/gallery/hydra-glow-glass-skin.jpg',
    title: 'Hydra-Glow Facial & Brows',
    description: 'Dewy glass-skin radiance with cleanly shaped eyebrows.',
  },
  {
    image: '/assets/gallery/rose-chrome-nail-couture.jpg',
    title: 'Rose & Gold Nail Couture',
    description: 'Almond rose-nude gel extensions with delicate gold-leaf artistry.',
  },
  {
    image: '/assets/bridals/royal-maroon-bridal.png',
    title: 'Royal Maroon Bridal',
    description: 'HD airbrush bridal makeup, mogra bun & timeless lehenga draping.',
  },
  {
    image: '/assets/bridals/sangeet-caramel-glam.png',
    title: 'Sangeet Caramel Glam',
    description: 'Soft bronze smokey eyes and glossy Hollywood waves.',
  },
  {
    image: '/assets/bridals/reception-couture-blowout.png',
    title: 'Reception Couture Blowout',
    description: 'Lifted crown volume with sleek face-framing layers.',
  },
  {
    image: '/assets/bridals/haldi-dewy-glow.png',
    title: 'Haldi Dewy Glow',
    description: 'Breathable sunlit makeup with floral-ready messy bun.',
  },
  {
    image: '/assets/bridals/mehndi-nail-couture.png',
    title: 'Mehndi Nail Couture',
    description: 'Festive gel polish paired with half-up romantic curls.',
  },
  {
    image: '/assets/bridals/engagement-sculpt.png',
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
  preservePhotoFraming?: boolean;
  pages: BookPageSpec[];
}

const byImage = (suffix: string): GalleryLookItem => {
  const found = GALLERY_ITEMS.find((item) => item.image.endsWith(suffix));
  if (!found) {
    throw new Error(`Missing gallery item for ${suffix}`);
  }
  return found;
};

const featherLayers = byImage('feather-layers-blowout.jpg');
const caramelBalayage = byImage('caramel-balayage-waves.jpg');
const curtainBangs = byImage('curtain-bangs-soft-waves.jpg');
const receptionBlowout = byImage('reception-couture-blowout.png');

const royalMaroon = byImage('royal-maroon-bridal.png');
const mograGajra = byImage('mogra-gajra-bridal-bun.jpg');
const sangeetGlam = byImage('sangeet-caramel-glam.png');
const haldiGlow = byImage('haldi-dewy-glow.png');

const hydraGlow = byImage('hydra-glow-glass-skin.jpg');
const roseNails = byImage('rose-chrome-nail-couture.jpg');
const mehndiNails = byImage('mehndi-nail-couture.png');
const engagementSculpt = byImage('engagement-sculpt.png');

export const LOOKBOOK_VOLUMES: LookbookVolume[] = [
  {
    id: 'hair-colour',
    roman: 'VOL. I',
    shortTitle: 'Hair & Colour',
    title: 'Hair & Dimensional Colour',
    subtitle: 'Feather layers, hand-painted caramel tones & couture blowouts',
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
        body: 'Feather layers, hand-painted balayage & silky salon finishes.',
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
        kicker: 'FULL PLATE',
        heading: curtainBangs.title,
        body: curtainBangs.description,
        primaryItem: curtainBangs,
        alt: `${curtainBangs.title}: ${curtainBangs.description}`,
        text: `${curtainBangs.title}. ${curtainBangs.description}`,
      },
      {
        id: 'vol1-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'HAIR ARCHIVE · TRIPTYCH',
        heading: 'Movement, Gloss & Soft Silhouette',
        body: 'Three signature hair finishes crafted at our Jyoti Nagar studio.',
        collageItems: [featherLayers, caramelBalayage, receptionBlowout],
        alt: `Collage of ${featherLayers.title}, ${caramelBalayage.title}, and ${receptionBlowout.title}`,
        text: `${featherLayers.title}, ${caramelBalayage.title}, and ${receptionBlowout.title}.`,
      },
      {
        id: 'vol1-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'EVENING VOLUME',
        heading: receptionBlowout.title,
        body: receptionBlowout.description,
        primaryItem: receptionBlowout,
        alt: `${receptionBlowout.title}: ${receptionBlowout.description}`,
        text: `${receptionBlowout.title}. ${receptionBlowout.description}`,
      },
      {
        id: 'vol1-p6',
        layout: 'closing',
        folio: '06',
        kicker: 'INDEX · VOLUME I',
        heading: 'Hair & Colour Gallery',
        body: 'Curated transformations from Joie Salon, Jyoti Nagar Main Rd, Rajkot.',
        indexItems: [featherLayers, caramelBalayage, curtainBangs, receptionBlowout],
        alt: 'Volume I Photo Gallery',
        text: 'Volume I Index: Feather Layers & Blowout, Caramel Honey Balayage, Curtain Bangs & Waves, Reception Couture Blowout.',
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
    subtitle: 'Airbrush bridal artistry, mogra gajra buns & ceremonial glow',
    editionNote: 'Joie Salon · Bridal Monograph · Rajkot',
    coverCloth: '#4A1B25',
    coverClothDeep: '#2D0F16',
    coverFoil: '#E7C88B',
    coverInk: '#FAF3EA',
    paperTone: '#FBF7F0',
    darkPageTone: '#1E1416',
    preservePhotoFraming: true,
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
        kicker: 'FULL PLATE',
        heading: mograGajra.title,
        body: mograGajra.description,
        primaryItem: mograGajra,
        alt: `${mograGajra.title}: ${mograGajra.description}`,
        text: `${mograGajra.title}. ${mograGajra.description}`,
      },
      {
        id: 'vol2-p3',
        layout: 'full-image',
        folio: '03',
        kicker: 'SANGEET EDITION',
        heading: sangeetGlam.title,
        body: sangeetGlam.description,
        primaryItem: sangeetGlam,
        alt: `${sangeetGlam.title}: ${sangeetGlam.description}`,
        text: `${sangeetGlam.title}. ${sangeetGlam.description}`,
      },
      {
        id: 'vol2-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'CEREMONIAL STORY · TRIPTYCH',
        heading: 'From Haldi Sunlit Skin to Pheras',
        body: 'Cohesive hair, floral pinning & luminous bridal skin transitions.',
        collageItems: [royalMaroon, mograGajra, haldiGlow],
        alt: `Collage of ${royalMaroon.title}, ${mograGajra.title}, and ${haldiGlow.title}`,
        text: `${royalMaroon.title}, ${mograGajra.title}, and ${haldiGlow.title}.`,
      },
      {
        id: 'vol2-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'DAYLIGHT CEREMONY',
        heading: haldiGlow.title,
        body: haldiGlow.description,
        primaryItem: haldiGlow,
        alt: `${haldiGlow.title}: ${haldiGlow.description}`,
        text: `${haldiGlow.title}. ${haldiGlow.description}`,
      },
      {
        id: 'vol2-p6',
        layout: 'full-image',
        folio: '06',
        kicker: 'RECEPTION HAIR',
        heading: receptionBlowout.title,
        body: receptionBlowout.description,
        primaryItem: receptionBlowout,
        alt: `${receptionBlowout.title}: ${receptionBlowout.description}`,
        text: `${receptionBlowout.title}. ${receptionBlowout.description}`,
      },
      {
        id: 'vol2-p7',
        layout: 'full-image',
        folio: '07',
        kicker: 'ENGAGEMENT MAKEUP',
        heading: engagementSculpt.title,
        body: engagementSculpt.description,
        primaryItem: engagementSculpt,
        alt: `${engagementSculpt.title}: ${engagementSculpt.description}`,
        text: `${engagementSculpt.title}. ${engagementSculpt.description}`,
      },
      {
        id: 'vol2-p8',
        layout: 'closing',
        folio: '08',
        kicker: 'INDEX · VOLUME II',
        heading: 'Bridal Gallery',
        body: 'Dedicated private bridal lounge at Joie Salon, Rajkot.',
        indexItems: [royalMaroon, mograGajra, sangeetGlam, haldiGlow],
        alt: 'Volume II Photo Gallery',
        text: 'Volume II Index: Royal Maroon Bridal, Mogra Gajra Bridal Bun, Sangeet Caramel Glam, Haldi Dewy Glow.',
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
    subtitle: 'Glass-skin hydra facials, brow framing & gold-leaf gel artistry',
    editionNote: 'Joie Salon · Atelier Monograph · Rajkot',
    coverCloth: '#5A3E40',
    coverClothDeep: '#3A2527',
    coverFoil: '#ECD3C1',
    coverInk: '#FAF5F1',
    paperTone: '#FAF7F3',
    darkPageTone: '#1F1919',
    preservePhotoFraming: true,
    pages: [
      {
        id: 'vol3-cover',
        layout: 'front-cover',
        kicker: 'JOIE SALON · RAJKOT',
        heading: 'SKIN &\nCOUTURE',
        body: 'Hydra-glow glass skin, brow sculpting & fine nail artistry.',
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
        kicker: 'NAIL ATELIER',
        heading: roseNails.title,
        body: roseNails.description,
        primaryItem: roseNails,
        alt: `${roseNails.title}: ${roseNails.description}`,
        text: `${roseNails.title}. ${roseNails.description}`,
      },
      {
        id: 'vol3-p3',
        layout: 'full-image',
        folio: '03',
        kicker: 'FULL PLATE',
        heading: mehndiNails.title,
        body: mehndiNails.description,
        primaryItem: mehndiNails,
        alt: `${mehndiNails.title}: ${mehndiNails.description}`,
        text: `${mehndiNails.title}. ${mehndiNails.description}`,
      },
      {
        id: 'vol3-p4',
        layout: 'collage',
        folio: '04',
        kicker: 'ATELIER DETAILS · TRIPTYCH',
        heading: 'Luminance & Fine Detail',
        body: 'Calm skin preparation paired with delicate sculptural nail finishing.',
        collageItems: [hydraGlow, roseNails, engagementSculpt],
        alt: `Collage of ${hydraGlow.title}, ${roseNails.title}, and ${engagementSculpt.title}`,
        text: `${hydraGlow.title}, ${roseNails.title}, and ${engagementSculpt.title}.`,
      },
      {
        id: 'vol3-p5',
        layout: 'full-image',
        folio: '05',
        kicker: 'ENGAGEMENT EDIT',
        heading: engagementSculpt.title,
        body: engagementSculpt.description,
        primaryItem: engagementSculpt,
        alt: `${engagementSculpt.title}: ${engagementSculpt.description}`,
        text: `${engagementSculpt.title}. ${engagementSculpt.description}`,
      },
      {
        id: 'vol3-p6',
        layout: 'closing',
        folio: '06',
        kicker: 'INDEX · VOLUME III',
        heading: 'Skin & Nail Gallery',
        body: 'Book a tailored consultation at Joie Salon, Rajkot.',
        indexItems: [hydraGlow, roseNails, mehndiNails, engagementSculpt],
        alt: 'Volume III Photo Gallery',
        text: 'Volume III Index: Hydra-Glow Facial & Brows, Rose & Gold Nail Couture, Mehndi Nail Couture, Engagement Brow Sculpt.',
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
