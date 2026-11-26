'use client';

import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import { TestimonialsMarquee } from './ui/testimonials-with-marquee';
import type { MarqueeTestimonial } from './ui/testimonials-with-marquee-utils/animated-testimonials';

const salonTestimonials: MarqueeTestimonial[] = FAITHFUL_REVIEWS.map((review) => ({
  id: review.id,
  name: review.reviewerName,
  handle: `${review.relativeDateSnapshot} · Google Review`,
  description: review.verbatimQuote,
}));

export function CustomerReviewsSection() {
  return (
    <TestimonialsMarquee
      id="reviews"
      eyebrow="GOOGLE REVIEWS · RAJKOT, GUJARAT"
      title="Trusted by our clients in Rajkot"
      subtitle="What guests say about their haircuts, treatments, and salon visits."
      testimonials={salonTestimonials}
      ctaLabel="Read all reviews on Google"
      ctaHref={BUSINESS_INFO.googleReviewsUrl}
    />
  );
}

export default CustomerReviewsSection;
