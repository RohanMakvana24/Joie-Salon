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
  category: 'all' | 'groom' | 'executive' | 'youth-family';
  features: string[];
  featured?: boolean;
}

export const SIGNATURE_PACKAGES: GroomingPackage[] = [
  {
    id: 'royal-executive-combo',
    name: 'Royal Executive Combo',
    gujaratiSubtitle: 'હેરકટ + રોયલ દાઢી શેવ + હોટ ટોવેલ + વોશ',
    badge: 'MOST POPULAR',
    badgeType: 'gold',
    subtitle: 'Precision Haircut + Royal Beard Sculpt + Hot Towel & Wash',
    duration: '45-60 mins',
    rateHint: 'Best Value for Weekly & Monthly Grooming',
    description:
      'Our most demanded complete transformation. Includes a custom haircut or skin fade, beard sculpting with straight-razor detailing, hot towel steam, and a relaxing hair wash & blow-dry style.',
    image: '/assets/hairstyles/rajkot-royal-beard.jpg',
    category: 'executive',
    features: [
      'Tailored Scissor Cut or Zero-Gap Skin Fade',
      'Beard Sculpting with Sharp Cheek & Neck Lineup',
      'Relaxing Hot Towel Steam & Essential Oil Prep',
      'Invigorating Hair Wash & Matte Clay Finish',
    ],
    featured: true,
  },
  {
    id: 'signature-groom-makeover',
    name: 'Signature Groom Wedding Edit',
    gujaratiSubtitle: 'સંપૂર્ણ વેડિંગ ગ્રોમિંગ + ડી-ટેન + હેર સ્પા',
    badge: 'WEDDING SPECIAL',
    badgeType: 'amber',
    subtitle: 'Complete Head-to-Toe Groom Styling & Skin De-Tan Package',
    duration: '90-120 mins',
    rateHint: 'Special Occasion & Wedding Package',
    description:
      'Designed exclusively for grooms, family members, and groomsmen in Rajkot. Complete skin de-tan cleanup, hair spa, master haircut, and beard contouring designed to look immaculate under wedding lights.',
    image: '/assets/hairstyles/rajkot-groom-styling.jpg',
    category: 'groom',
    features: [
      'Pre-Wedding Style Consultation (Safa & Reception fit)',
      'Activated Charcoal De-Tan Scrub & Skin Glow Pack',
      'Pro-Keratin Hair Spa & Scalp Massage',
      'Royal Beard Contouring & Razor Detailing',
      'Photo-Ready Matte Finish (Zero camera shine)',
    ],
    featured: true,
  },
  {
    id: 'student-youth-cut',
    name: 'Student & Youth Fresh Cut',
    gujaratiSubtitle: 'ટ્રેન્ડિંગ મિડ ફેડ + ક્રોપ + હેલ્મેટ-પ્રૂફ સેટિંગ',
    badge: 'YOUTH TREND',
    badgeType: 'cyan',
    subtitle: 'Trending Textured Crop / Mid Fade + Clean Lineup',
    duration: '30-40 mins',
    rateHint: 'Special Rates for College & School Students',
    description:
      'Stay ahead with trending street styles, drop fades, or textured quiffs that easily withstand Rajkot helmet commutes. Quick, sharp, and easy to maintain.',
    image: '/assets/hairstyles/rajkot-precision-fade.jpg',
    category: 'youth-family',
    features: [
      'High-Contrast Drop Fade or Low Taper',
      'Textured Crop / Quiff Crown Styling',
      'Sharp Temple & Neckline Razor Detailing',
      'Helmet-Proof Re-workable Styling Tips',
    ],
  },
  {
    id: 'father-son-duo',
    name: 'Father & Son Grooming Duo',
    gujaratiSubtitle: 'પિતા અને દીકરા માટે વિકેન્ડ ફેમિલી ગ્રોમિંગ',
    badge: 'FAMILY FAVORITE',
    badgeType: 'emerald',
    subtitle: 'Gentleman Cut & Shave + Patient Kids Styling',
    duration: '50-60 mins',
    rateHint: 'Special Weekend Family Offer',
    description:
      'A memorable weekend bonding session. Classic, sophisticated scissor cut and royal shave for Dad, paired with a fun, patient, and modern cut for the young champ.',
    image: '/assets/hairstyles/classic-side-part.webp',
    category: 'youth-family',
    features: [
      'Executive Scissor Cut & Classic Beard Grooming for Dad',
      'Patient, Friendly, School-Ready Haircut for Junior',
      'Complimentary Styling & Hair Wash',
      'Comfortable AC Family Lounge & Free WiFi',
    ],
  },
];

export function buildPackageWhatsAppUrl(
  pkg: GroomingPackage,
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const message = [
    '✂️ *CLASSIC CUT SALON — RAJKOT*',
    '━━━━━━━━━━━━━━━━━━━━',
    `💈 *Package:* ${pkg.name}`,
    `🏷️ *Gujarati:* ${pkg.gujaratiSubtitle}`,
    `⏱️ *Duration:* ${pkg.duration}`,
    `✂️ *Includes:* ${pkg.subtitle}`,
    `📍 *Location:* Pedak Cross Road, Arya Nagar, Rajkot`,
    '━━━━━━━━━━━━━━━━━━━━',
    'Hi Classic Cut team! I would like to book this package. Please confirm available slots and current rates. Thank you!',
  ].join('\n');

  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}
