'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  AnimatedTestimonials,
  type MarqueeTestimonial,
} from '@/components/ui/testimonials-with-marquee-utils/animated-testimonials';
import { useTheme } from '@/hooks/useActivity';
import { cn } from '@/lib/utils';

export interface TestimonialsMarqueeProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  testimonials: MarqueeTestimonial[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function TestimonialsMarquee({
  id = 'reviews',
  eyebrow = 'CLIENT LOVE · RAJKOT, GUJARAT',
  title = 'Loved by our clients across Rajkot',
  subtitle = 'Real word-for-word Google reviews from guests who visit Joie Salon for bridal glam, hair styling, and skin care.',
  testimonials,
  ctaLabel = 'Read all reviews on Google',
  ctaHref,
  className,
}: TestimonialsMarqueeProps) {
  const theme = useTheme();
  const isLight = theme === 'light';
  const titleWords = title.trim().split(/\s+/);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'relative w-full overflow-hidden border-y py-20 md:py-28 transition-colors duration-300',
        isLight
          ? 'bg-[#F5F6F7] border-[#232C3B]/14 text-[#232C3B]'
          : 'bg-[#0C0907] border-white/10 text-[#F5F6F7]',
        className
      )}
    >
      <div className="relative z-10 flex w-full flex-col items-center">
        {/* Section Header with Word-by-Word Motion Reveal */}
        <div className="site-container mx-auto flex max-w-3xl flex-col items-center gap-4 text-center pb-10 md:pb-14">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="inline-flex items-center justify-center gap-2.5"
            >
              <span
                className={cn(
                  'h-px w-6',
                  isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'
                )}
              />
              <p
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.26em]',
                  isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
                )}
              >
                {eyebrow}
              </p>
              <span
                className={cn(
                  'h-px w-6',
                  isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'
                )}
              />
            </motion.div>
          )}

          <h2
            id={`${id}-heading`}
            className={cn(
              'font-display uppercase text-3xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-[-0.02em] leading-[1.06]',
              isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
            )}
          >
            {titleWords.map((word, index) => {
              const isLast = index === titleWords.length - 1;
              return (
                <motion.span
                  key={`title-${word}-${index}`}
                  initial={{ opacity: 0, filter: 'blur(6px)', y: 12 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.07,
                    ease: 'easeInOut',
                  }}
                  className={cn(
                    'mr-2.5 inline-block last:mr-0',
                    isLast && (isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]')
                  )}
                >
                  {word}
                </motion.span>
              );
            })}
          </h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className={cn(
                'max-w-2xl text-sm sm:text-base leading-relaxed',
                isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Full-Width Dual-Row Animated Testimonials Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="w-full"
        >
          <AnimatedTestimonials data={testimonials} />
        </motion.div>

        {/* Unified Primary CTA */}
        {ctaHref && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.55 }}
            className="mt-10 px-5 text-center"
          >
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all focus-ring',
                isLight
                  ? 'bg-[#232C3B] text-[#F8F6F2] hover:bg-[#161C26] shadow-[0_10px_24px_-12px_rgba(35,44,59,0.55)]'
                  : 'bg-[#232C3B] text-[#F8F6F2] border border-white/20 hover:bg-[#2F3B4F] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.7)]'
              )}
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsMarquee;
