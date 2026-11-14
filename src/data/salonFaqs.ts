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
      'Walk-ins are always warmly welcomed! However, to skip peak wait times—especially on Friday evenings, weekends, and during wedding or festival seasons in Rajkot—we strongly recommend booking your preferred time slot via WhatsApp or direct phone call (+91 82828 48453).',
    category: 'booking',
  },
  {
    id: 'exact-location-parking',
    question: 'Where is Classic Cut Salon located, and is parking available?',
    answer:
      'We are conveniently located at Pedak Cross Road, Opposite Umiya R.O., Ranchod Nagar Society, Arya Nagar, Rajkot (Gujarat 360003), near Balak Hanuman and Shree Atal Bihari Vajpayee Auditorium. Ample, convenient two-wheeler and four-wheeler parking is available directly in front of the salon.',
    category: 'location',
  },
  {
    id: 'groom-wedding-packages',
    question: 'What is included in your Groom & Wedding Makeover packages?',
    answer:
      'Our Signature Groom Package includes an unhurried style consultation, precision haircut/fade tailored to your wedding attire (Safa and reception suit), royal beard contouring with hot-towel steam, activated charcoal de-tan facial cleanup, and a restorative pro-keratin hair spa. We recommend booking 7–10 days before your wedding ceremonies.',
    category: 'services',
  },
  {
    id: 'hygiene-standards',
    question: 'What hygiene and sanitation standards do you follow?',
    answer:
      'Client hygiene and safety are non-negotiable at Classic Cut Salon. We strictly use fresh, single-use surgical razor blades for every client, sanitize clippers and scissors with medical-grade disinfectant after each cut, provide fresh sanitized towels and neck strips, and maintain a spotless, fully air-conditioned environment.',
    category: 'hygiene',
  },
  {
    id: 'reference-photo-styling',
    question: 'Can I show a photo or Instagram reel of the hairstyle I want?',
    answer:
      'Yes, absolutely! We love when clients bring reference photos. Our stylists will assess your hair texture, thickness, face shape, and daily routine to recreate the look so that it suits you naturally and is easy to maintain with a helmet or daily commute.',
    category: 'services',
  },
  {
    id: 'payment-methods',
    question: 'What payment options do you accept?',
    answer:
      'We accept all modern digital payment options including Google Pay, PhonePe, Paytm, BHIM UPI, debit/credit cards, and cash.',
    category: 'booking',
  },
];
