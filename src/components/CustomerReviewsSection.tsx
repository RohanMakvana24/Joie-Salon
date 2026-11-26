'use client';

import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import { TestimonialsMarquee } from './ui/testimonials-with-marquee';
import type { MarqueeTestimonial } from './ui/testimonials-with-marquee-utils/animated-testimonials';

const cleanQuote = (quote: string) =>
  quote
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^["“'']+|["”'']+$/g, '')
    .trim();

const formatReviewerName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.length <= 2
        ? word.toUpperCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');

const salonTestimonials: MarqueeTestimonial[] = FAITHFUL_REVIEWS
  .map((review) => ({
    id: review.id,
    name: formatReviewerName(review.reviewerName),
    handle: `${review.relativeDateSnapshot} · Google Review`,
    description: cleanQuote(review.verbatimQuote),
    rating: 5,
  }))
  .filter(
    (review) =>
      review.description.length > 0 &&
      !review.description.toLowerCase().includes('unsatisfactory')
  );

export function CustomerReviewsSection() {
  return (
    <TestimonialsMarquee
      id="reviews"
      eyebrow="GOOGLE REVIEWS · RAJKOT, GUJARAT"
      title="Trusted by our clients in Rajkot"
      subtitle="Word-for-word experiences from guests who visit Joie Salon for precision cuts, bridal styling, and relaxing salon care."
      testimonials={salonTestimonials}
      ctaLabel="Read all reviews on Google"
      ctaHref={BUSINESS_INFO.googleReviewsUrl}
    />
  );
}

export default CustomerReviewsSection;
