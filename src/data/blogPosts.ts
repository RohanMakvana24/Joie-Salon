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

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-ladies-salon-in-rajkot-jyoti-nagar',
    title: 'How to Choose the Best Ladies Salon for You in Rajkot',
    description: 'Compare ladies salons in Rajkot using a practical checklist for consultations, portfolios, quotes and booking. Find Joie Salon near Crystal Mall.',
    category: 'Salon Guide',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/feather-layers-blowout.jpg',
    imageAlt: 'Illustration of feather layers with a rounded blowout',
    intro: 'The best salon for you depends on the service you need, how much upkeep you want and what you feel comfortable spending. Start with one goal: a cut you can style before work, a colour that grows out softly or a bridal look that works with your outfit.',
    sections: [
      {
        id: 'consultation',
        heading: 'Start with a consultation',
        paragraphs: ['Show two reference photos and point out exactly what you like in each. For a haircut, describe the shortest length you can comfortably tie up. For colour, mention old dye, henna or smoothing. A useful consultation ends with a clear plan you can describe back in your own words.'],
      },
      {
        id: 'portfolio',
        heading: 'Look for work similar to yours',
        paragraphs: ['When you browse a portfolio, look for hair that resembles yours in length, density and texture. For bridal makeup, look at finishes in daylight and flash. Check which images are examples of previous work and which are style inspiration. Read reviews that describe the service you plan to book.'],
      },
      {
        id: 'quote',
        heading: 'Ask what the quote includes',
        paragraphs: ['Ask whether the haircut includes a wash and finish, whether a colour quote includes toner and whether bridal styling includes draping and accessories. If a price depends on hair length or density, ask how it will be confirmed before work begins.'],
      },
      {
        id: 'visit-joie',
        heading: 'Plan a visit to Joie Salon',
        paragraphs: ['Joie Salon is a ladies hair, skin and bridal studio on Jyoti Nagar Main Road, behind Crystal Mall in Rajkot. When you enquire, send your preferred service, date and one reference photo. Ask for the estimated appointment time and what to bring.'],
      },
    ],
  },
  {
    slug: 'trending-balayage-keratin-haircuts-rajkot',
    title: 'Balayage or Keratin? A Rajkot Salon Guide to Colour and Smoothing',
    description: 'Compare balayage, keratin smoothing and haircuts by the result you want, the upkeep you can manage and the questions to ask before booking.',
    category: 'Hair & Colour',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/caramel-balayage-waves.jpg',
    imageAlt: 'Illustration of warm caramel balayage on wavy hair',
    intro: 'Balayage adds dimension through colour placement. A smoothing service changes how the hair feels and styles. A haircut changes the shape. Start with the result you want most and use that to guide the consultation.',
    sections: [
      {
        id: 'balayage',
        heading: 'Choose colour placement first',
        paragraphs: ['Caramel around the face gives a different effect from caramel through the mid-lengths and ends. Show where you want the brightest pieces and how much of your natural base you want to keep. Ask the stylist how the shade may look in daylight and how often you might want a toner refresh.'],
      },
      {
        id: 'smoothing',
        heading: 'Discuss smoothing and your natural texture',
        paragraphs: ['Describe how your hair behaves on a normal morning. If you want to keep your waves while making blow-drying easier, say so early. Ask which smoothing product the salon proposes, what the service includes and what routine it requires afterwards.'],
      },
      {
        id: 'sequencing',
        heading: 'Plan the order of appointments',
        paragraphs: ['If you are considering colour and smoothing, tell the stylist about any previous bleach, box dye, henna or straightening. Ask whether they recommend a strand test and how to schedule the services around an upcoming event.'],
      },
      {
        id: 'booking',
        heading: 'Confirm the quote and maintenance',
        paragraphs: ['Send one photo of your current hair in daylight and one of your goal. Ask whether the quote includes colour, toner, finishing and any follow-up. A maintenance plan should fit the time and budget you can manage after the appointment.'],
      },
    ],
  },
  {
    slug: 'bridal-pre-bridal-makeup-timeline-rajkot',
    title: 'Bridal Makeup in Rajkot: A Gujarati Wedding Beauty Timeline',
    description: 'Plan your bridal trial, hairstyles, makeup and draping for Haldi, Mehndi, Sangeet and wedding day with a practical appointment checklist.',
    category: 'Bridal Studio',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/mogra-gajra-bridal-bun.jpg',
    imageAlt: 'Illustration of a bridal bun with fresh jasmine and gold pins',
    intro: 'A bridal beauty schedule works best when it follows the wedding schedule. List each event, the venue, the time you need to be ready and who needs styling. Use that list to enquire about bridal makeup and hair in Rajkot.',
    sections: [
      {
        id: 'trial',
        heading: 'Bring your outfit details to the trial',
        paragraphs: ['Bring a picture of your blouse neckline, jewellery and dupatta. Decide where the dupatta will sit before choosing bun height or accessory placement. Photograph the trial in daylight and with flash, and note which finish felt comfortable.'],
      },
      {
        id: 'events',
        heading: 'Give each ceremony its own brief',
        paragraphs: ['For daytime Haldi, explain if flowers or draping will frame your face. For Mehndi, plan accessories before your hands are busy. For Sangeet, mention how much dancing you expect. For the wedding, share your veil or double-dupatta plan so the hairstyle can accommodate the pins.'],
      },
      {
        id: 'prep',
        heading: 'Schedule prep around what you already use',
        paragraphs: ['If you want a haircut, colour, brow shaping or manicure, ask when to book each service based on your routine and previous experiences. Tell the salon about sensitivities and products you already know suit you. Leave time to adjust details after the trial.'],
      },
      {
        id: 'appointment',
        heading: 'Confirm the get-ready schedule',
        paragraphs: ['Ask for a written list of what is included, including hair, makeup, lashes, draping and touch-ups where applicable. Confirm the arrival time, venue or studio location, who supplies accessories and when the photographer needs you ready.'],
      },
    ],
  },
  {
    slug: 'hydra-glow-facial-detan-skincare-rajkot',
    title: 'Facial Appointments in Rajkot: What to Ask Before Booking',
    description: 'Prepare for a salon facial consultation with questions about the steps, products, timing and recent changes to your skincare routine.',
    category: 'Skin & Beauty',
    publishedAt: '2026-11-13',
    image: '/assets/gallery/hydra-glow-glass-skin.jpg',
    imageAlt: 'Illustration of a softly lit skincare look and groomed brows',
    intro: 'A facial menu is easier to compare when you know what each appointment actually includes. If you are looking at a hydra-glow facial or de-tan service in Rajkot, ask about the steps and products before choosing a slot.',
    sections: [
      {
        id: 'routine',
        heading: 'Describe your everyday routine',
        paragraphs: ['Tell the salon what you currently use and what has felt comfortable or uncomfortable in the past. Mention recent waxing, exfoliation or a new product. If an ingredient has caused a reaction before, bring the name or a photo of the label.'],
      },
      {
        id: 'steps',
        heading: 'Ask what happens during the facial',
        paragraphs: ['Ask whether the service includes massage, exfoliation, masks or extractions and how long the appointment lasts. You can also ask how tools are cleaned between clients and which items are single-use. Decide ahead of time which steps you are comfortable with.'],
      },
      {
        id: 'event',
        heading: 'Plan around your event',
        paragraphs: ['If you have a wedding or photoshoot coming up, share the date before choosing a service. Tell the salon whether you have tried it before and ask how to plan it alongside other appointments. For a first visit, keep your plans flexible enough to discuss the options in person.'],
      },
      {
        id: 'aftercare',
        heading: 'Get clear aftercare instructions',
        paragraphs: ['Ask what products the salon used, when to resume your usual routine and what to do if a product feels uncomfortable. Take a photo of the product names or ask for a short written note so you can refer back to it.'],
      },
    ],
  },
  {
    slug: 'layered-haircuts-rajkot-feather-layers-curtain-bangs',
    title: 'Layered Haircuts in Rajkot: Feather Layers, Face-Framing and Curtain Bangs',
    description: 'Choose layers that work with your hair texture, ponytail length and morning routine. Know what to ask for at your next Rajkot haircut.',
    category: 'Hair & Colour',
    publishedAt: '2026-11-27',
    image: '/assets/gallery/curtain-bangs-soft-waves.jpg',
    imageAlt: 'Illustration of curtain bangs with soft, face-framing waves',
    intro: 'Feather layers, face-framing pieces and curtain bangs can all add movement, but they change different parts of a haircut. Decide what you want to notice first when you look in the mirror and what needs to remain practical on an ordinary day.',
    sections: [
      {
        id: 'shape',
        heading: 'Pick the part of the cut you want to change',
        paragraphs: ['Ask about feather layers if you want a softer outline through the ends. Ask about face-framing layers if you like your overall length and want movement near your cheeks or jaw. If you are considering curtain bangs, ask where the shortest piece will sit after drying.'],
      },
      {
        id: 'length',
        heading: 'Check your ponytail and parting',
        paragraphs: ['Show the stylist where you part your hair and how you tie it for work or exercise. Point to the shortest length you can manage. Ask what the cut will look like from the back and how much length will come off the perimeter.'],
      },
      {
        id: 'styling',
        heading: 'Ask for a finish you can repeat',
        paragraphs: ['Say whether you usually air-dry, blow-dry or spend a few minutes styling the front. Ask the stylist to demonstrate one simple technique before you leave. Check how the fringe or face-framing pieces sit when you tuck them behind your ears.'],
      },
      {
        id: 'references',
        heading: 'Bring references that show the whole cut',
        paragraphs: ['A front photo helps with the fringe, a side photo shows the shortest layer and a back photo shows the outline. If you only have one reference, explain what you like about it so the stylist can adapt the shape to your hair.'],
      },
    ],
  },
  {
    slug: 'gel-nails-rajkot-bridal-nail-art-guide',
    title: 'Gel Nails in Rajkot: Choosing Shape, Length and Bridal Nail Art',
    description: 'Compare gel polish and extensions, pick a shape that suits your routine, and plan nail art around Mehndi, jewellery and your outfit.',
    category: 'Nail Studio',
    publishedAt: '2026-11-27',
    image: '/assets/gallery/rose-chrome-nail-couture.jpg',
    imageAlt: 'Illustration of rose-toned almond nails with gold accents',
    intro: 'Start with the length you can wear comfortably. A wedding nail set needs to work with outfit changes, jewellery, phones and everyday tasks as well as close-up photos.',
    sections: [
      {
        id: 'polish',
        heading: 'Choose gel polish or extensions',
        paragraphs: ['Gel polish adds colour over your existing length. Extensions add length and let you change the outline more dramatically. Show a reference and ask whether the result is possible on your current nails, how long it will take and what removal involves.'],
      },
      {
        id: 'shape',
        heading: 'Try a shape you can live with',
        paragraphs: ['Ask to compare a short round shape, a soft square and an almond outline before choosing. If you type, wear contact lenses or use your hands for work, say so. A shorter version of your reference can keep the same colour and pattern while feeling easier to wear.'],
      },
      {
        id: 'bridal',
        heading: 'Build the bridal set around one detail',
        paragraphs: ['Bring a photo of your jewellery, lehenga or Mehndi inspiration and choose one element to echo. A rose-toned base or a slim gold accent can tie the look together without repeating every detail in the outfit. Ask to see a sample in daylight before committing to the full set.'],
      },
      {
        id: 'removal',
        heading: 'Ask about timing, repairs and removal',
        paragraphs: ['Confirm whether the appointment includes removal of your previous set and whether nail art is priced per nail or as a set. Share your Mehndi date and ask how to sequence the two appointments. Ask how to book a repair or removal afterwards.'],
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
