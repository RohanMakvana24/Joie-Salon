import { BUSINESS_INFO } from './barbershopData';

export interface GroomingPackage {
  id: string;
  name: string;
  gujaratiSubtitle: string;
  badge?: string;
  badgeType?: 'gold' | 'amber' | 'emerald' | 'cyan';
  subtitle: string;
  duration: string;
  rateHint: string;
  description: string;
  image: string;
  category: 'all' | 'bridal' | 'hair-care' | 'party-nails';
  features: string[];
  featured?: boolean;
}

export const SIGNATURE_PACKAGES: GroomingPackage[] = [
  {
    id: 'signature-hair-glow-combo',
    name: 'Signature Hair & Glow Combo',
    gujaratiSubtitle: 'લેયર હેરકટ + હેર સ્પા + હાઇડ્રા ગ્લો ફેસિયલ',
    badge: 'MOST POPULAR',
    badgeType: 'gold',
    subtitle: 'Custom Layer Cut + Deep Hair Spa + Hydra-Glow Facial',
    duration: '75-90 mins',
    rateHint: 'Best Value for Monthly Self-Care',
    description:
      'Our signature ladies refresh session. Includes a face-framing layer or feather cut, nourishing keratin hair spa, relaxing hydra-glow facial, and bouncy blow-dry finish.',
    image: '/assets/characters/services/ladies-facial.png',
    category: 'hair-care',
    features: [
      'Customised Layer, Feather, or Step Haircut',
      'Deep Conditioning Hair Spa & Steam Ritual',
      'Hydra-Glow Facial & Brightening De-Tan Pack',
      'Eyebrow Threading & Silky Blow-Dry Styling',
    ],
    featured: true,
  },
  {
    id: 'royal-bridal-edit',
    name: 'Royal Bridal & Pre-Bridal Edit',
    gujaratiSubtitle: 'સંપૂર્ણ બ્રાઇડલ મેકઅપ + પ્રી-બ્રાઇડલ ગ્લો + હેર સ્ટાઇલ',
    badge: 'BRIDAL SPECIAL',
    badgeType: 'amber',
    subtitle: 'HD / Airbrush Bridal Makeup + Pre-Bridal Glow + Hair & Draping',
    duration: '120-180 mins',
    rateHint: 'Bridal, Engagement & Sangeet Package',
    description:
      'Crafted for Rajkot brides and bridesmaids. Complete pre-bridal skin radiance ritual, sweat-proof HD or airbrush makeup, floral bun hair styling, and traditional saree draping.',
    image: '/assets/characters/services/ladies-bridal.png',
    category: 'bridal',
    features: [
      'Pre-Bridal Skin Prep & Bridal Makeup Trial Consultation',
      'HD or Airbrush Long-Wear Bridal Makeup Finish',
      'Traditional Floral Bun / Hair Updo & Jewellery Setting',
      'Saree, Lehenga & Dupatta Pinning & Draping',
      'Touch-Up Kit Tips for Wedding & Reception Lights',
    ],
    featured: true,
  },
  {
    id: 'keratin-color-refresh',
    name: 'Keratin Smooth & Colour Edit',
    gujaratiSubtitle: 'કેરાટિન સ્મૂધનિંગ + ગ્લોબલ કલર / બાલાયાજ',
    badge: 'HAIR TRANSFORMATION',
    badgeType: 'cyan',
    subtitle: 'Frizz-Free Keratin Treatment + Balayage or Global Colour',
    duration: '120-150 mins',
    rateHint: 'Silky Shine & Rich Dimension',
    description:
      'Transform dry or frizzy hair into glossy, manageable locks. Pairs ammonia-free global colour or soft caramel balayage with deep keratin smoothing.',
    image: '/assets/characters/services/ladies-color.png',
    category: 'hair-care',
    features: [
      'Personal Shade & Undertone Consultation',
      'Global Hair Colour, Root Touch-Up, or Balayage',
      'Frizz-Control Keratin / Botox Smoothing Treatment',
      'Post-Colour Moisture Lock & Glossy Blow-Dry',
    ],
  },
  {
    id: 'party-ready-glam-nails',
    name: 'Party Glam & Mani-Pedi Duo',
    gujaratiSubtitle: 'પાર્ટી મેકઅપ + બ્લો-ડ્રાય + સ્પા મેનિક્યોર અને નેઇલ આર્ટ',
    badge: 'PARTY FAVORITE',
    badgeType: 'emerald',
    subtitle: 'Soft Glam Party Makeup + Blow-Dry + Spa Mani-Pedi',
    duration: '75-90 mins',
    rateHint: 'Ideal for Navratri, Reception & Events',
    description:
      'Step out effortlessly for receptions, festive nights, or family celebrations with soft glam makeup, bouncy curls or blow-dry, and glossy gel manicure.',
    image: '/assets/characters/services/ladies-nails.png',
    category: 'party-nails',
    features: [
      'Soft Glam Party Makeup & Lash Styling',
      'Soft Curls, Waves, or Sleek Blow-Dry Finish',
      'Spa Manicure & Pedicure with Cuticle Care',
      'Long-Wear Gel Polish or Custom Festive Nail Art',
    ],
  },
];

export function buildPackageWhatsAppUrl(
  pkg: GroomingPackage,
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const message = [
    '✂️ *JOIE SALON — RAJKOT*',
    '━━━━━━━━━━━━━━━━━━━━',
    `💈 *Package:* ${pkg.name}`,
    `🏷️ *Gujarati:* ${pkg.gujaratiSubtitle}`,
    `⏱️ *Duration:* ${pkg.duration}`,
    `✨ *Includes:* ${pkg.subtitle}`,
    `📍 *Location:* Pedak Cross Road, Arya Nagar, Rajkot`,
    '━━━━━━━━━━━━━━━━━━━━',
    'Hi Joie Salon team! I would like to book this package. Please confirm available slots and current rates. Thank you!',
  ].join('\n');

  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}

