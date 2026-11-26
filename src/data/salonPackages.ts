import { BUSINESS_INFO } from './barbershopData';
import type { Plan6 } from '../components/ui/components-pricings-pricing-6';

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
    name: 'Hair & Glow Combo',
    gujaratiSubtitle: 'લેયર હેરકટ + હેર સ્પા + હાઇડ્રા ગ્લો ફેસિયલ',
    badge: 'Most Popular',
    badgeType: 'gold',
    subtitle: 'Custom Layer Cut + Deep Hair Spa + Hydra-Glow Facial',
    duration: '75-90 mins',
    rateHint: 'Best Value for Monthly Self-Care',
    description:
      'Our everyday ladies refresh session with a face-framing layer cut, keratin hair spa, hydra-glow facial, and bouncy blow-dry.',
    image: '/assets/characters/services/ladies-facial.png',
    category: 'hair-care',
    features: [
      'Customised Layer, Feather, or Step Haircut',
      'Deep Conditioning Hair Spa & Steam Ritual',
      'Hydra-Glow Facial & Brightening De-Tan Pack',
      'Eyebrow Threading & Upper-Lip Clean-Up',
      'Silky Round-Brush Blow-Dry Finish',
      'Complimentary Home-Care Styling Tips',
    ],
    featured: true,
  },
  {
    id: 'keratin-color-refresh',
    name: 'Keratin & Colour Edit',
    gujaratiSubtitle: 'કેરાટિન સ્મૂધનિંગ + ગ્લોબલ કલર / બાલાયાજ',
    badge: 'Silk Transformation',
    badgeType: 'cyan',
    subtitle: 'Frizz-Free Keratin Treatment + Balayage or Global Colour',
    duration: '120-150 mins',
    rateHint: 'Silky Shine & Rich Dimension',
    description:
      'Transform dry or frizzy hair into glossy, manageable locks with ammonia-free colour or balayage paired with keratin smoothing.',
    image: '/assets/characters/services/ladies-color.png',
    category: 'hair-care',
    features: [
      'Personal Skin-Undertone & Shade Consultation',
      'Global Colour, Root Touch-Up, or Caramel Balayage',
      'Frizz-Control Keratin or Hair Botox Smoothing',
      'Bond-Repair Mask & Moisture Lock Rinse',
      'Split-End Dusting Trim Included',
      'Glossy Salon Blow-Dry Finish',
    ],
  },
  {
    id: 'party-ready-glam-nails',
    name: 'Party Glam & Nails',
    gujaratiSubtitle: 'પાર્ટી મેકઅપ + બ્લો-ડ્રાય + સ્પા મેનિક્યોર અને નેઇલ આર્ટ',
    badge: 'Festive Favourite',
    badgeType: 'emerald',
    subtitle: 'Soft Glam Party Makeup + Blow-Dry + Spa Mani-Pedi',
    duration: '75-90 mins',
    rateHint: 'Ideal for Navratri, Reception & Events',
    description:
      'Step out ready for receptions, sangeet nights, or family celebrations with soft glam makeup, sculpted waves, and gel nail couture.',
    image: '/assets/characters/services/ladies-nails.png',
    category: 'party-nails',
    features: [
      'Soft Glam Party Makeup & Skin Prep',
      'False Lash Placement & Waterproof Setting',
      'Soft Curls, Waves, or Sleek Blow-Dry Styling',
      'Spa Manicure & Pedicure with Cuticle Care',
      'Long-Wear Gel Polish or Custom Nail Art',
      'Dupatta / Saree Pleat Assistance on Request',
    ],
  },
  {
    id: 'pre-bridal-radiance',
    name: 'Pre-Bridal Radiance',
    gujaratiSubtitle: 'પ્રી-બ્રાઇડલ ગ્લો ફેસિયલ + બોડી પોલિશ + હેર સ્પા',
    badge: '7–10 Days Before Wedding',
    badgeType: 'cyan',
    subtitle: 'Hydra-Glow Skin Ritual + Body Polish + Keratin Spa + Mani-Pedi',
    duration: '120-150 mins',
    rateHint: 'Planned Pre-Wedding Care',
    description:
      'Complete pre-wedding skin, hair, and hand care timed before your haldi and mehndi so makeup glides on effortlessly.',
    image: '/assets/characters/services/ladies-facial.png',
    category: 'bridal',
    features: [
      'Hydra-Glow Radiance Facial & Brightening Mask',
      'Full-Body De-Tan & Gentle Exfoliating Polish',
      'Deep Nourishing Hair Spa & Scalp Massage',
      'Full Waxing & Precision Eyebrow Shaping',
      'Spa Manicure & Pedicure with Gel Polish',
      'Personal Bridal Skin Timeline Checklist',
    ],
  },
  {
    id: 'royal-bridal-edit',
    name: 'Royal Bridal Edit',
    gujaratiSubtitle: 'સંપૂર્ણ બ્રાઇડલ મેકઅપ + ફ્લોરલ બન + સાડી ડ્રેપિંગ',
    badge: "Bride's Choice",
    badgeType: 'amber',
    subtitle: 'HD / Airbrush Bridal Makeup + Floral Bun + Lehenga Draping',
    duration: '150-180 mins',
    rateHint: 'Wedding Day & Reception Complete Studio',
    description:
      'Crafted for Rajkot brides. Sweat-resistant HD or airbrush bridal makeup, traditional mogra floral bun, jewellery setting, and draping.',
    image: '/assets/characters/services/ladies-bridal.png',
    category: 'bridal',
    features: [
      'Pre-Event Bridal Shade & Jewellery Consultation',
      'Sweat-Proof HD or Airbrush Bridal Makeup',
      'Mogra Floral Bun, Juda Pinning & Veil Setting',
      'Saree, Lehenga & Double-Dupatta Draping',
      'Bridal Nail Extension or Gel Couture Finish',
      'Transfer-Proof Lipstick & Touch-Up Kit Prep',
    ],
    featured: true,
  },
  {
    id: 'bridesmaid-family-group',
    name: 'Bridesmaid & Family Group',
    gujaratiSubtitle: 'બ્રાઇડ્સમેઇડ મેકઅપ + હેર સ્ટાઇલ + સાડી ડ્રેપિંગ (ગ્રુપ)',
    badge: 'Group Booking',
    badgeType: 'emerald',
    subtitle: 'Coordinated Hair, Soft Glam Makeup & Draping for 3+ Guests',
    duration: '90-120 mins',
    rateHint: 'Mothers, Sisters & Bridal Party',
    description:
      'Coordinated morning or evening slots for mothers, sisters, and friends so the entire bridal party steps out together on schedule.',
    image: '/assets/characters/services/ladies-nails.png',
    category: 'bridal',
    features: [
      'Natural & Radiant Soft-Glam Makeup per Guest',
      'Traditional Bun, Open Curls, or Blow-Dry',
      'Custom Saree, Ghagra & Dupatta Pinning',
      'Priority Dedicated Morning / Sangeet Slots',
      'Optional Studio or Rajkot Venue Service',
      'Coordinated Group Timing Schedule',
    ],
  },
];

export function buildPackageWhatsAppUrl(
  pkg: GroomingPackage,
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const message = [
    '✂️ *JOIE SALON — FOR LADIES (RAJKOT)*',
    '━━━━━━━━━━━━━━━━━━━━',
    `💐 *Package:* ${pkg.name}`,
    `🏷️ *Gujarati:* ${pkg.gujaratiSubtitle}`,
    `⏱️ *Duration:* ${pkg.duration}`,
    `🌿 *Includes:* ${pkg.subtitle}`,
    `📍 *Location:* Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot`,
    '━━━━━━━━━━━━━━━━━━━━',
    'Hi Joie Salon team! I would like to book this package. Please confirm available slots and current rates. Thank you!',
  ].join('\n');

  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}

const PACKAGE_PALETTES = {
  'signature-hair-glow-combo': { palette: 'rose' as const, ctaDark: false },
  'keratin-color-refresh': { palette: 'purple' as const, ctaDark: false },
  'party-ready-glam-nails': { palette: 'amber' as const, ctaDark: true },
  'pre-bridal-radiance': { palette: 'teal' as const, ctaDark: false },
  'royal-bridal-edit': { palette: 'rose' as const, ctaDark: true },
  'bridesmaid-family-group': { palette: 'blue' as const, ctaDark: false },
};

function toPlan6(pkg: GroomingPackage): Plan6 {
  const styling = PACKAGE_PALETTES[pkg.id as keyof typeof PACKAGE_PALETTES] ?? {
    palette: 'rose' as const,
    ctaDark: false,
  };
  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    palette: styling.palette,
    price: pkg.duration,
    priceNote: 'Rates confirmed on WhatsApp · Jyoti Nagar Studio',
    ctaLabel: 'Book This Package',
    ctaHref: buildPackageWhatsAppUrl(pkg),
    featuredLabel: pkg.badge,
    ctaDark: styling.ctaDark,
    features: pkg.features,
    footerNote: pkg.rateHint,
    footerDesc: pkg.gujaratiSubtitle,
  };
}

export const SALON_CARE_PLANS: Plan6[] = SIGNATURE_PACKAGES.slice(0, 3).map(toPlan6);
export const BRIDAL_EVENT_PLANS: Plan6[] = SIGNATURE_PACKAGES.slice(3, 6).map(toPlan6);
