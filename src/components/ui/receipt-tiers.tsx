'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useActivity';
import {
  REVEAL_KEYFRAMES,
  revealClass,
  revealDelay,
  useReveal,
} from './receipt-tiers-utils/reveal';
import type { Plan } from './receipt-tiers-utils/types';

export type ReceiptTiersVariant = 'Tilted' | 'Straight';

export interface ReceiptTiersProps {
  plans: Plan[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  merchant?: string;
  merchantLine?: string;
  variant?: ReceiptTiersVariant;
  className?: string;
}

const DESKTOP_TILTS = [
  'md:-rotate-1',
  'md:rotate-[0.5deg] md:-translate-y-2',
  'md:rotate-[1.5deg]',
];

function Rule({ isLight }: { isLight: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'my-2.5 block border-t border-dashed',
        isLight ? 'border-[#b9b6ad]' : 'border-[#3f3f45]'
      )}
    />
  );
}

export function ReceiptTiers({
  plans,
  eyebrow,
  heading,
  subheading,
  merchant = 'JOIE SALON',
  merchantLine = 'LADIES STUDIO · RAJKOT',
  variant = 'Tilted',
  className,
}: ReceiptTiersProps) {
  const { ref, shown } = useReveal<HTMLElement>();
  const theme = useTheme();
  const isLight = theme === 'light';

  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const defaultMobileIndex = plans.length >= 3 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(defaultMobileIndex);

  const apply3DTransforms = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobileCarousel = window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isMobileCarousel) {
      innerCardRefs.current.forEach((inner) => {
        if (!inner) return;
        inner.style.transform = '';
        inner.style.opacity = '';
      });
      slotRefs.current.forEach((slot) => {
        if (!slot) return;
        slot.style.zIndex = '';
      });
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDist = Number.POSITIVE_INFINITY;

    slotRefs.current.forEach((slot, idx) => {
      const inner = innerCardRefs.current[idx];
      if (!slot || !inner) return;

      const rect = slot.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = cardCenter - trackCenter;
      const absDist = Math.abs(distance);

      if (absDist < closestDist) {
        closestDist = absDist;
        closestIndex = idx;
      }

      const basis = Math.max(rect.width * 0.92, 240);
      const offset = Math.max(-1.3, Math.min(1.3, distance / basis));
      const absOffset = Math.abs(offset);

      slot.style.zIndex = String(20 - Math.round(absOffset * 10));

      if (reducedMotion) {
        inner.style.transform = '';
        inner.style.opacity = String(Math.max(0.75, 1 - absOffset * 0.2));
        return;
      }

      const rotateY = -offset * 22;
      const rotateZ = offset * 2.2;
      const scale = 1 - absOffset * 0.11;
      const translateZ = -absOffset * 56;
      const translateY = absOffset * 10;
      const opacity = Math.max(0.68, 1 - absOffset * 0.28);

      inner.style.transform = `perspective(1100px) translate3d(0, ${translateY.toFixed(1)}px, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      inner.style.opacity = opacity.toFixed(3);
    });

    setActiveIndex(closestIndex);
  }, []);

  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(plans.length - 1, index));
    const slot = slotRefs.current[clamped];
    if (!track || !slot) return;
    const targetLeft = slot.offsetLeft - (track.clientWidth - slot.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, targetLeft), behavior });
    setActiveIndex(clamped);
  }, [plans.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        apply3DTransforms();
      });
    };

    // On mobile, start centered on the middle featured card so both side cards visibly peek in 3D
    if (window.innerWidth < 768) {
      const initialSlot = slotRefs.current[defaultMobileIndex];
      if (initialSlot) {
        const targetLeft =
          initialSlot.offsetLeft - (track.clientWidth - initialSlot.clientWidth) / 2;
        track.scrollLeft = Math.max(0, targetLeft);
      }
    }

    apply3DTransforms();

    track.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      track.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [apply3DTransforms, defaultMobileIndex]);

  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      ref={ref}
      className={cn(
        'w-full py-16 md:py-24 border-b transition-colors duration-300 overflow-x-clip',
        isLight
          ? 'bg-[#e9e8e3] border-[#232C3B]/15'
          : 'bg-[#111113] border-white/10',
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: REVEAL_KEYFRAMES }} />

      {heading && (
        <div
          className={cn(
            'site-container mx-auto mb-8 md:mb-12 max-w-2xl text-center',
            revealClass(shown)
          )}
        >
          {eyebrow && (
            <div className="inline-flex items-center justify-center gap-2.5 mb-3">
              <span className={cn('h-px w-6', isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]')} />
              <p
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.26em]',
                  isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
                )}
              >
                {eyebrow}
              </p>
              <span className={cn('h-px w-6', isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]')} />
            </div>
          )}
          <h2
            id="packages-heading"
            className={cn(
              'font-display uppercase text-3xl sm:text-5xl md:text-[3.25rem] tracking-[-0.01em] leading-tight',
              isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
            )}
          >
            {(() => {
              const parts = heading.trim().split(/\s+/);
              if (parts.length < 2) return heading;
              const last = parts.pop();
              return (
                <>
                  {parts.join(' ')}{' '}
                  <span className={isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'}>
                    {last}
                  </span>
                </>
              );
            })()}
          </h2>
          {subheading && (
            <p
              className={cn(
                'mt-2.5 text-sm sm:text-base leading-relaxed max-w-xl mx-auto',
                isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Mobile: 3D Perspective Horizontal Snap Carousel | Desktop: 3-Column Tilted Grid */}
      <div
        ref={trackRef}
        aria-label="Signature salon packages"
        className={cn(
          'flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory px-[11vw] py-5',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain',
          'md:mx-auto md:grid md:max-w-[1040px] md:grid-cols-3 md:items-start md:gap-7 md:overflow-visible md:px-6 md:py-2 font-mono',
          revealClass(shown)
        )}
      >
        {plans.map((plan, position) => {
          const isMobileActive = position === activeIndex;
          return (
            <div
              key={plan.id}
              ref={(el) => {
                slotRefs.current[position] = el;
              }}
              style={revealDelay(shown, position)}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileActive) {
                  scrollToCard(position);
                }
              }}
              className="relative w-[78vw] max-w-[318px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink"
            >
              <div
                ref={(el) => {
                  innerCardRefs.current[position] = el;
                }}
                className={cn(
                  'relative px-5 pb-5 pt-6 text-[12px] leading-snug will-change-transform',
                  'shadow-[0_16px_38px_-16px_rgba(0,0,0,0.38)] md:transition-transform md:duration-300 md:hover:-translate-y-1',
                  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-7px),97%_100%,94%_calc(100%-7px),91%_100%,88%_calc(100%-7px),85%_100%,82%_calc(100%-7px),79%_100%,76%_calc(100%-7px),73%_100%,70%_calc(100%-7px),67%_100%,64%_calc(100%-7px),61%_100%,58%_calc(100%-7px),55%_100%,52%_calc(100%-7px),49%_100%,46%_calc(100%-7px),43%_100%,40%_calc(100%-7px),37%_100%,34%_calc(100%-7px),31%_100%,28%_calc(100%-7px),25%_100%,22%_calc(100%-7px),19%_100%,16%_calc(100%-7px),13%_100%,10%_calc(100%-7px),7%_100%,4%_calc(100%-7px),1%_100%,0_calc(100%-7px))]',
                  isLight ? 'bg-[#fefdf8] text-[#2a2a26]' : 'bg-[#1c1c1f] text-[#d8d8d2]',
                  variant === 'Tilted' && DESKTOP_TILTS[position % DESKTOP_TILTS.length]
                )}
              >
              {/* Compact Stamp Badge */}
              {plan.badge && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute right-3.5 top-10 -rotate-12 rounded border-[1.5px] border-[#c93a28] px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.12em] text-[#c93a28]',
                    isLight ? 'opacity-80 mix-blend-multiply' : 'opacity-90'
                  )}
                >
                  {plan.badge.toUpperCase()}
                </span>
              )}

              {/* Compact Single-Header Receipt Stamp */}
              <p className="text-center text-[12px] font-bold tracking-[0.12em]">
                {merchant}
              </p>
              <p
                className={cn(
                  'mt-0.5 text-center text-[9.5px] tracking-[0.1em]',
                  isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                )}
              >
                {merchantLine}
              </p>

              <Rule isLight={isLight} />

              {/* Concise Title + Duration */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-bold tracking-[0.06em]">
                  {plan.name.toUpperCase()}
                </span>
                {plan.duration && (
                  <span
                    className={cn(
                      'shrink-0 text-[10.5px] tabular-nums',
                      isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                    )}
                  >
                    {plan.duration.toUpperCase()}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'mt-1 text-[11px]',
                  isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                )}
              >
                {plan.tagline}
              </p>

              <Rule isLight={isLight} />

              {/* Short 3-Item Included Services List */}
              <ul className="space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-baseline gap-2">
                    <span className="min-w-0 truncate text-[11.5px]">
                      {feature.toUpperCase()}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mb-1 min-w-3 flex-1 border-b border-dotted',
                        isLight ? 'border-[#b9b6ad]' : 'border-[#3f3f45]'
                      )}
                    />
                    <span
                      className={cn(
                        'shrink-0 text-[10.5px]',
                        isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                      )}
                    >
                      INCL
                    </span>
                  </li>
                ))}
              </ul>

              <Rule isLight={isLight} />

              {/* Single Clean Rate Row */}
              <div className="mb-3 flex items-baseline justify-between text-[13.5px] font-bold">
                <span>RATE</span>
                <span>{plan.rateLabel ? plan.rateLabel.toUpperCase() : 'ON QUOTE'}</span>
              </div>

              {plan.ctaHref ? (
                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    if (typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileActive) {
                      event.preventDefault();
                      scrollToCard(position);
                    }
                  }}
                  className={cn(
                    'flex min-h-[44px] w-full items-center justify-center py-2.5 text-center text-[11.5px] font-bold tracking-[0.1em]',
                    'transition-all duration-150 active:scale-[0.98]',
                    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#232C3B] focus-visible:ring-offset-2',
                    isLight
                      ? 'bg-[#232C3B] text-[#F8F6F2] hover:bg-[#161C26] focus-visible:ring-offset-[#fefdf8]'
                      : 'bg-[#232C3B] text-[#F8F6F2] border border-white/20 hover:bg-[#2F3B4F] focus-visible:ring-offset-[#1c1c1f]'
                  )}
                >
                  {plan.cta.toUpperCase()}
                </a>
              ) : (
                <button
                  type="button"
                  className={cn(
                    'flex min-h-[44px] w-full items-center justify-center py-2.5 text-[11.5px] font-bold tracking-[0.1em]',
                    'transition-all duration-150 active:scale-[0.98]',
                    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#232C3B] focus-visible:ring-offset-2',
                    isLight
                      ? 'bg-[#232C3B] text-[#F8F6F2] hover:bg-[#161C26] focus-visible:ring-offset-[#fefdf8]'
                      : 'bg-[#232C3B] text-[#F8F6F2] border border-white/20 hover:bg-[#2F3B4F] focus-visible:ring-offset-[#1c1c1f]'
                  )}
                >
                  {plan.cta.toUpperCase()}
                </button>
              )}

              {/* Compact Barcode Stamp */}
              <div
                aria-hidden="true"
                className="mx-auto mt-3.5 h-6 w-3/4 opacity-75 [background-image:repeating-linear-gradient(90deg,currentColor_0,currentColor_2px,transparent_2px,transparent_5px,currentColor_5px,currentColor_6px,transparent_6px,transparent_9px)]"
              />
              <p
                className={cn(
                  'mt-1.5 text-center text-[9.5px] tracking-[0.18em] tabular-nums',
                  isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                )}
              >
                {`NO. 00${position + 1} · JOIE SALON`}
              </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile 3D Carousel Controls & Card Indicator */}
      <div className="mt-3 flex items-center justify-center gap-4 px-6 md:hidden">
        <button
          type="button"
          onClick={() => scrollToCard(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous package"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default focus-ring',
            isLight
              ? 'border-[#232C3B]/20 bg-white/80 text-[#232C3B] hover:border-[#232C3B]/50'
              : 'border-white/25 bg-[#1c1c1f] text-[#F5F6F7] hover:border-white/50'
          )}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Select signature package">
          {plans.map((plan, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={plan.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View ${plan.name}`}
                onClick={() => scrollToCard(idx)}
                className={cn(
                  'flex h-10 items-center justify-center px-1 cursor-pointer focus-ring'
                )}
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-200',
                    isSelected
                      ? isLight
                        ? 'w-7 bg-[#232C3B]'
                        : 'w-7 bg-[#F5F6F7]'
                      : isLight
                      ? 'w-2 bg-[#232C3B]/25'
                      : 'w-2 bg-white/25'
                  )}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollToCard(activeIndex + 1)}
          disabled={activeIndex === plans.length - 1}
          aria-label="Next package"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default focus-ring',
            isLight
              ? 'border-[#232C3B]/20 bg-white/80 text-[#232C3B] hover:border-[#232C3B]/50'
              : 'border-white/25 bg-[#1c1c1f] text-[#F5F6F7] hover:border-white/50'
          )}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p
        className={cn(
          'mt-1 text-center font-mono text-[11px] tabular-nums md:hidden',
          isLight ? 'text-[#5A6475]' : 'text-[#A99A88]'
        )}
      >
        0{activeIndex + 1} / 0{plans.length} · Swipe cards to explore
      </p>
    </section>
  );
}

export default ReceiptTiers;
