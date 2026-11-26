export interface SalonFaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'services' | 'hygiene' | 'location';
}

export const SALON_FAQS: SalonFaqItem[] = [
  {
    id: 'walkin-vs-appointment',
    question: 'Do I need to book in advance, or are walk-ins welcome?',
    answer:
      'Walk-ins are always welcome! However, to avoid waiting—especially on Friday evenings, weekends, and during wedding or Navratri seasons in Rajkot—we recommend booking your preferred slot via WhatsApp or phone call (+91 82828 48453).',
    category: 'booking',
  },
  {
    id: 'bridal-prebridal-packages',
    question: 'What is included in your Bridal & Pre-Bridal packages?',
    answer:
      'Our Royal Bridal & Pre-Bridal Edit includes a detailed makeup & hairstyle trial consultation, sweat-proof HD or airbrush bridal makeup, floral bun or hair updo styling, saree & dupatta draping, plus pre-bridal hydra-glow facials and mani-pedi care. We suggest booking 2–3 weeks before your wedding.',
    category: 'services',
  },
  {
    id: 'hair-color-keratin-safety',
    question: 'Are your hair colour, balayage, and keratin treatments ammonia-free?',
    answer:
      'Yes! We use gentle, salon-grade ammonia-free colour formulas and nourishing keratin/botox smoothing treatments tailored to Indian hair textures—giving you lasting shine and frizz control without harsh damage.',
    category: 'services',
  },
  {
    id: 'hygiene-standards',
    question: 'What hygiene and sanitation standards do you follow for ladies services?',
    answer:
      'Hygiene is our top priority at Joie Salon. We use fresh, single-use threading threads and waxing spatulas for every guest, medical-grade sanitization for manicure/pedicure tools and brushes, fresh sanitized towels, and a private, comfortable AC studio.',
    category: 'hygiene',
  },
  {
    id: 'exact-location-parking',
    question: 'Where is Joie Salon located, and is parking available?',
    answer:
      'We are located at Jyoti Nagar Main Road, Near Masoom School, Behind Crystal Mall, Ghanshyam Nagar, Rajkot (Gujarat 360005), open Mon–Sun 10:00 AM to 8:00 PM. Convenient two-wheeler and four-wheeler parking is available right outside the salon.',
    category: 'location',
  },
  {
    id: 'payment-methods',
    question: 'What payment options do you accept?',
    answer:
      'We accept all UPI apps (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and cash.',
    category: 'booking',
  },
];
