import { BUSINESS_INFO } from './barbershopData';

export interface BridalDetailItem {
  name: string;
  kind: string;
  note: string;
  x: number;
  y: number;
}

export interface BridalLook {
  id: string;
  name: string;
  gujaratiName: string;
  occasion: string;
  duration: string;
  image: string;
  foot: number;
  details: [BridalDetailItem, BridalDetailItem, BridalDetailItem];
}

export const BRIDAL_LOOKS: BridalLook[] = [
  {
    id: 'royal-maroon-bridal',
    name: 'Royal Maroon Bridal',
    gujaratiName: 'રોયલ મરૂન બ્રાઇડલ',
    occasion: 'Wedding Phera & Reception',
    duration: '150–180 mins',
    image: '/assets/bridals/royal-maroon-bridal.png',
    foot: 0,
    details: [
      { name: 'HD Airbrush Base', kind: 'Makeup', note: 'Sweat-proof 16-hr luminous finish', x: 55, y: 25 },
      { name: 'Gajra Floral Bun', kind: 'Hairstyle', note: 'Fresh mogra & maang tikka setting', x: 41, y: 21 },
      { name: 'Double Dupatta Pin', kind: 'Draping', note: 'Clean lehenga & veil pleating', x: 36, y: 40 },
    ],
  },
  {
    id: 'sangeet-caramel-glam',
    name: 'Sangeet Caramel Glam',
    gujaratiName: 'સંગીત કેરામેલ ગ્લેમ',
    occasion: 'Sangeet & Cocktail Night',
    duration: '90–120 mins',
    image: '/assets/bridals/sangeet-caramel-glam.png',
    foot: 0.02,
    details: [
      { name: 'Caramel Balayage Waves', kind: 'Hair', note: 'Glossy Hollywood soft waves', x: 46, y: 20 },
      { name: 'Smokey Bronze Eye', kind: 'Makeup', note: 'Shimmer lid & flutter lashes', x: 54, y: 14 },
      { name: 'Moisture Lock Gloss', kind: 'Finish', note: 'Anti-frizz shine mist', x: 64, y: 36 },
    ],
  },
  {
    id: 'reception-couture-blowout',
    name: 'Reception Blowout',
    gujaratiName: 'રિસેપ્શન કોચર બ્લોઆઉટ',
    occasion: 'Reception & Engagement',
    duration: '75–90 mins',
    image: '/assets/bridals/reception-couture-blowout.png',
    foot: 0.02,
    details: [
      { name: 'Bouncy Layer Volume', kind: 'Haircut', note: 'Face-framing feather layers', x: 42, y: 18 },
      { name: 'Soft Velvet Lip', kind: 'Makeup', note: 'Rosewood matte & dewy cheek', x: 55, y: 16 },
      { name: 'Silk Press Finish', kind: 'Styling', note: 'Long-hold humidity shield', x: 35, y: 32 },
    ],
  },
  {
    id: 'haldi-dewy-glow',
    name: 'Haldi Dewy Glow',
    gujaratiName: 'હલ્દી ડ્યુઈ ગ્લો',
    occasion: 'Pre-Bridal & Haldi',
    duration: '60–75 mins',
    image: '/assets/bridals/haldi-dewy-glow.png',
    foot: 0.02,
    details: [
      { name: 'Hydra-Glow Prep', kind: 'Skincare', note: '24K serum & lymphatic massage', x: 66, y: 24 },
      { name: 'Glass-Skin Base', kind: 'Makeup', note: 'Sheer breathable sunlit glow', x: 53, y: 16 },
      { name: 'Messy High Bun', kind: 'Hairstyle', note: 'Floral-ready soft tendrils', x: 49, y: 8 },
    ],
  },
  {
    id: 'mehndi-nail-couture',
    name: 'Mehndi Nail Couture',
    gujaratiName: 'મહેંદી નેઇલ કોચર',
    occasion: 'Mehndi & Bridal Nails',
    duration: '60–90 mins',
    image: '/assets/bridals/mehndi-nail-couture.png',
    foot: 0.02,
    details: [
      { name: 'Bridal Gel Extensions', kind: 'Nails', note: 'Rose-nude French & chrome', x: 68, y: 22 },
      { name: 'Luxury Spa Mani-Pedi', kind: 'Care', note: 'Cuticle polish & rose soak', x: 31, y: 22 },
      { name: 'Half-Up Crown Waves', kind: 'Hairstyle', note: 'Soft romantic bridal curls', x: 45, y: 10 },
    ],
  },
  {
    id: 'bridal-brow-sculpt',
    name: 'Engagement Sculpt',
    gujaratiName: 'એન્ગેજમેન્ટ બ્રાઉ સ્કલ્પ્ટ',
    occasion: 'Ring Ceremony & Shoot',
    duration: '60–90 mins',
    image: '/assets/bridals/engagement-sculpt.png',
    foot: 0.02,
    details: [
      { name: 'Precision Brow Arch', kind: 'Brows', note: 'Soft feathered brow framing', x: 47, y: 12 },
      { name: 'Satin Radiance Prep', kind: 'Skin', note: 'De-tan & smooth base prime', x: 54, y: 18 },
      { name: 'Signature Side Waves', kind: 'Hairstyle', note: 'Camera-ready glossy hold', x: 40, y: 26 },
    ],
  },
];

export function buildBridalWhatsAppUrl(
  look: BridalLook,
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const message = [
    '*JOIE SALON — OUR BRIDALS (RAJKOT)*',
    '━━━━━━━━━━━━━━━━━━━━',
    `👰 *Bridal Look:* ${look.name}`,
    `🏷️ *Gujarati:* ${look.gujaratiName}`,
    `💐 *Occasion:* ${look.occasion}`,
    `⏱️ *Duration:* ${look.duration}`,
    `🎨 *Includes:* ${look.details.map((d) => d.name).join(' · ')}`,
    '━━━━━━━━━━━━━━━━━━━━',
    'Hi Joie Salon team! I would like to book a Bridal Consultation / Trial for this look. Please share available dates and packages.',
  ].join('\n');

  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}
