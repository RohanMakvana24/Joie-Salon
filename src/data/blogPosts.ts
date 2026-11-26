export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: { id: string; heading: string; paragraphs: string[]; tips?: string[] }[];
}

// Comprehensive Rajkot Ladies Salon & Beauty Styling Guides
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-ladies-salon-in-rajkot-jyoti-nagar',
    title: 'Inside Joie Salon: Rajkot’s Calm Sanctuary for Hair, Skin & Bridal Care',
    description: 'Discover why Rajkot women choose Joie Salon at Jyoti Nagar Main Road, Behind Crystal Mall for layered haircuts, caramel balayage, hydra-glow facials, and bridal makeup.',
    category: 'Rajkot Salons',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/feather-layers-blowout.jpg',
    imageAlt: 'Indian woman with glossy face-framing feather layers and bouncy salon blowout at Joie Salon Rajkot',
    intro: 'Rajkot’s beauty culture has evolved into something deeply personal. Women across Saurashtra look for more than a rushed appointment—they want thoughtful face-shape consultation, ammonia-free hair artistry, hygienic single-use skin tools, and a calm studio to unwind. Tucked behind Crystal Mall on Jyoti Nagar Main Road, Joie Salon offers a private, welcoming haven tailored exclusively for ladies.',
    sections: [
      {
        id: 'rajkot-ladies-standard',
        heading: 'Setting a New Benchmark for Ladies Beauty Care in Rajkot',
        paragraphs: [
          'From college students looking for soft curtain bangs and effortless layers, to brides-to-be planning weeks of pre-wedding radiance, every guest at Joie Salon begins with an unhurried one-on-one consultation.',
          'Our stylists evaluate your hair porosity, natural fall, skin undertones, and daily schedule before recommending a single trim, shade, or facial ritual.',
        ],
      },
      {
        id: 'layer-cuts-and-blowouts',
        heading: 'Face-Framing Feather Layers & Silky Salon Blowouts',
        paragraphs: [
          'A great haircut should look just as flattering air-dried at home as it does stepping out of the salon. We sculpt feather cuts, step layers, and wispy curtain bangs around your jawline and cheekbones so your hair retains bounce without losing length.',
          'Every cut finishes with a heat-protected round-brush blow-dry and weightless botanical serum so your hair moves freely through Rajkot warmth.',
        ],
        tips: [
          'Bring two or three lookbook photos showing the front and side length you love.',
          'Let your stylist know how often you tie your hair up or wear it open for work.',
          'Trim split ends every 8 to 10 weeks to maintain soft movement and thickness.',
        ],
      },
      {
        id: 'hygienic-private-studio',
        heading: 'Single-Use Hygiene & Relaxing Studio Comfort',
        paragraphs: [
          'Whether you drop in for eyebrow threading, Rica waxing, or a 60-minute hydra-glow facial, cleanliness comes first. Fresh single-use applicators, medical-grade tool sanitization, and sanitized linens ensure complete peace of mind at every visit.',
        ],
      },
    ],
  },
  {
    slug: 'trending-balayage-keratin-haircuts-rajkot',
    title: 'Caramel Balayage, Keratin Smoothing & Layered Cuts Trending in Rajkot',
    description: 'Explore dimensional caramel balayage, ammonia-free colour, frizz-taming keratin smoothing, and face-framing cuts crafted for Indian hair and Rajkot weather.',
    category: 'Hair & Colour',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/caramel-balayage-waves.jpg',
    imageAlt: 'Indian woman with warm caramel honey balayage waves and glossy keratin finish at Joie Salon Rajkot',
    intro: 'Sun-lit caramel ribbons, soft mocha melts, and silky frizz-free texture are among the most requested transformations at Joie Salon. Here is how our colour and keratin specialists tailor dimensional colour to complement warm Indian skin undertones and defend against Saurashtra hard water.',
    sections: [
      {
        id: 'caramel-and-honey-balayage',
        heading: 'Seamless Caramel & Honey Balayage for Indian Brunettes',
        paragraphs: [
          'Unlike harsh full-head bleaching, hand-painted balayage melts seamlessly from your natural root shade into warm toffee, honey, and chestnut tones. As your hair grows out over months, the blend remains soft with zero harsh regrowth lines.',
          'Using gentle ammonia-free formulations keeps the hair cuticle supple and luminous under both daylight and festive evening lights.',
        ],
      },
      {
        id: 'keratin-vs-hard-water-frizz',
        heading: 'Neutralizing Hard-Water Frizz with Keratin & Botanical Spas',
        paragraphs: [
          'Mineral-heavy Rajkot water often leaves hair strands feeling rough, tangled, and dull. Pairing colour services with a deep keratin smoothing treatment or steam hair spa infuses plant proteins back into the cuticle, restoring effortless mirror shine.',
        ],
        tips: [
          'Switch to a sulfate-free hydrating shampoo to make balayage and keratin last longer.',
          'Apply two drops of Moroccan Argan & Rose Hair Elixir on damp ends before styling.',
          'Use a heat-protectant volume mist before blow-drying or curling.',
        ],
      },
    ],
  },
  {
    slug: 'bridal-pre-bridal-makeup-timeline-rajkot',
    title: 'Complete Bridal & Pre-Bridal Glam Timeline for Rajkot Brides',
    description: 'Planning your Haldi, Mehndi, Sangeet, and wedding phera look? A practical bridal skincare, hair updo, nail art, and HD airbrush makeup roadmap.',
    category: 'Bridal Studio',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/mogra-gajra-bridal-bun.jpg',
    imageAlt: 'Indian bride wearing maroon silk with sculpted mogra jasmine gajra bun and gold pins at Joie Salon Rajkot',
    intro: 'Every Gujarati wedding ceremony brings its own mood—sunlit Haldi freshness, playful Mehndi colour, glittering Sangeet waves, and timeless royal phera elegance. Planning your beauty timeline 3 weeks ahead keeps your skin calm, your hair glossy, and your wedding mornings completely stress-free.',
    sections: [
      {
        id: 'three-week-bridal-prep',
        heading: 'Your 3-Week Pre-Bridal Glow & Hair Prep Schedule',
        paragraphs: [
          'Great bridal makeup starts with calm, hydrated skin rather than heavy layers. Begin your pre-bridal hydra-glow facials and hair spa rituals early so your complexion glows naturally under photography flashes.',
        ],
        tips: [
          '3 Weeks Prior: Hair colour or balayage refresh, keratin spa, and your bridal trial consultation.',
          '5 Days Prior: Hydra-glow facial cleanup, Rica waxing, and eyebrow arch shaping.',
          '2 Days Prior: Bridal gel nail extensions, spa manicure & pedicure.',
          'Wedding Day: Breathable HD or airbrush makeup, fresh mogra gajra bun, and double-dupatta lehenga draping.',
        ],
      },
      {
        id: 'sweat-proof-hd-airbrush',
        heading: 'Breathable HD & Airbrush Makeup for Long Ceremonies',
        paragraphs: [
          'Between outdoor mandaps, warm lights, and joyful dancing, bridal makeup needs to stay crease-free without feeling heavy. Our waterproof HD and airbrush finishes mimic real radiant skin for up to 16 hours.',
        ],
      },
    ],
  },
  {
    slug: 'hydra-glow-facial-detan-skincare-rajkot',
    title: 'Hydra-Glow Facials & Sun De-Tan Rituals for Radiant Glass Skin',
    description: 'How gentle lymphatic massage, botanical de-tan packs, and multi-layer hydration revive sun-exposed skin in Rajkot.',
    category: 'Skin & Glow',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/hydra-glow-glass-skin.jpg',
    imageAlt: 'Indian woman with luminous dewy glass skin after a luxury hydra-glow facial at Joie Salon Rajkot',
    intro: 'Rajkot sunshine and daily dust can quickly leave skin looking dehydrated and uneven. Harsh bleaching creams often sensitize the skin barrier—instead, Joie Salon focuses on calming de-tan therapy and deep hydration to reveal a healthy, lit-from-within glow.',
    sections: [
      {
        id: 'gentle-detan-and-hydration',
        heading: 'Lifting Sun Tan Without Stripping Your Skin Barrier',
        paragraphs: [
          'Our signature Hydra-Glow Facial combines ultrasonic gentle pore cleansing, cooling rosewater toning, and vitamin C serum infusion with relaxing lymphatic drainage massage to melt away puffiness and dullness.',
        ],
        tips: [
          'Book a soothing facial every 4 weeks to keep pores clear and skin hydrated.',
          'Mist with alcohol-free Rose Glow Toning Mist after threading or sun exposure.',
          'Pair morning hydration with broad-spectrum SPF 50 sunscreen before stepping outdoors.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function readingMinutes(post: BlogPost): number {
  const words = [
    post.intro,
    ...post.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.tips ?? []),
    ]),
  ].join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${date}T00:00:00+05:30`));
}
