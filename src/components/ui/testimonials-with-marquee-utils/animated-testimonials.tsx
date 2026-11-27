'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useActivity';

export interface MarqueeTestimonial {
  id?: string;
  name: string;
  handle: string;
  description: string;
  image?: string;
  rating?: number;
}

interface CanopyProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  paused?: boolean;
  applyMask?: boolean;
  duration?: string;
}

const Canopy = ({
  children,
  vertical = false,
  repeat = 2,
  pauseOnHover = true,
  paused = false,
  reverse = false,
  className,
  applyMask = true,
  duration = '52s',
  style,
  ...props
}: CanopyProps) => {
  const theme = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      {...props}
      style={
        {
          '--gap': '16px',
          '--duration': duration,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'canopy-group relative flex w-full overflow-hidden p-2 [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={`canopy-track-${index}`}
          aria-hidden={index > 0 ? true : undefined}
          style={paused ? { animationPlayState: 'paused' } : undefined}
          className={cn(
            'flex shrink-0 items-stretch [gap:var(--gap)]',
            vertical ? 'flex-col animate-canopy-y' : 'flex-row animate-canopy-x',
            reverse && 'canopy-reverse',
            pauseOnHover && 'canopy-pause-on-hover'
          )}
        >
          {children}
        </div>
      ))}

      {applyMask && !vertical && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 md:w-28 bg-gradient-to-r to-transparent',
              isLight ? 'from-[#F5F6F7]' : 'from-[#0C0907]'
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 md:w-28 bg-gradient-to-l to-transparent',
              isLight ? 'from-[#F5F6F7]' : 'from-[#0C0907]'
            )}
          />
        </>
      )}
    </div>
  );
};

function getInitials(name: string): string {
  return name
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'JS';
}

const TestimonialCard = ({
  testimonial,
  className,
}: {
  testimonial: MarqueeTestimonial;
  className?: string;
}) => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const stars = testimonial.rating;

  return (
    <article
      className={cn(
        'group/card relative flex w-[300px] sm:w-[356px] md:w-[392px] shrink-0 flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-300',
        isLight
          ? 'bg-white border-[#232C3B]/12 shadow-[0_12px_30px_-18px_rgba(35,44,59,0.22)] hover:-translate-y-0.5 hover:border-[#232C3B]/30 hover:shadow-[0_18px_36px_-18px_rgba(35,44,59,0.28)]'
          : 'bg-[#151210] border-white/12 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#191513]',
        className
      )}
    >
      {/* Top Bar: Reviewer Identity + Rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className={cn(
                'h-11 w-11 shrink-0 rounded-full object-cover border',
                isLight ? 'border-[#232C3B]/15' : 'border-white/15'
              )}
            />
          ) : (
            <div
              aria-hidden="true"
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold tracking-[0.06em]',
                isLight
                  ? 'bg-[#232C3B] text-[#F8F6F2]'
                  : 'bg-[#232C3B] text-[#F8F6F2] border border-white/20'
              )}
            >
              {getInitials(testimonial.name)}
            </div>
          )}

          <div className="min-w-0">
            <h3
              className={cn(
                'truncate font-display text-[15px] font-semibold tracking-[-0.01em] leading-snug',
                isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
              )}
            >
              {testimonial.name}
            </h3>
            <p
              className={cn(
                'truncate font-mono text-[11px] tracking-[0.04em]',
                isLight ? 'text-[#5A6475]' : 'text-[#A89B8C]'
              )}
            >
              {testimonial.handle}
            </p>
          </div>
        </div>

        <Quote
          className={cn(
            'h-4 w-4 shrink-0 mt-1 transition-opacity duration-300',
            isLight
              ? 'text-[#232C3B]/25 group-hover/card:text-[#232C3B]/55'
              : 'text-[#CBD5E1]/25 group-hover/card:text-[#CBD5E1]/60'
          )}
          aria-hidden="true"
        />
      </div>

      {/* Review Quote Body */}
      <p
        className={cn(
          'mt-4 text-[13.5px] sm:text-sm leading-relaxed',
          isLight ? 'text-[#363D49]' : 'text-[#D6CEC5]'
        )}
      >
        &ldquo;{testimonial.description}&rdquo;
      </p>

      {stars !== undefined && (
        <div
          className={cn(
            'mt-5 flex items-center gap-0.5 border-t pt-3.5',
            isLight ? 'border-[#232C3B]/10' : 'border-white/10'
          )}
          aria-label={`${stars} out of 5 stars`}
        >
          {Array.from({ length: stars }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                'h-3.5 w-3.5 fill-current',
                isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </article>
  );
};

export interface AnimatedTestimonialsProps {
  data: MarqueeTestimonial[];
  className?: string;
  cardClassName?: string;
}

export const AnimatedTestimonials = ({
  data,
  className,
  cardClassName,
}: AnimatedTestimonialsProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[entries.length - 1]?.isIntersecting ?? false);
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data.length) return null;

  const midpoint = Math.ceil(data.length / 2);
  const firstRow = data.slice(0, midpoint);
  const secondRow = data.slice(midpoint);
  const rows = secondRow.length > 0 ? [firstRow, secondRow] : [firstRow];

  return (
    <div ref={containerRef} className={cn('w-full overflow-x-clip py-2 space-y-4', className)}>
      {rows.map((rowItems, rowIndex) => {
        const isReverse = rowIndex % 2 === 1;
        const duration = isReverse ? '68s' : '60s';
        return (
          <Canopy
            key={`testimonial-row-${rowIndex}`}
            reverse={isReverse}
            pauseOnHover
            paused={!inView}
            applyMask
            duration={duration}
          >
            {rowItems.map((testimonial, itemIndex) => (
              <TestimonialCard
                key={testimonial.id ?? `${testimonial.name}-${itemIndex}`}
                testimonial={testimonial}
                className={cardClassName}
              />
            ))}
          </Canopy>
        );
      })}
    </div>
  );
};

export default AnimatedTestimonials;
