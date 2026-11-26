'use client';

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

const TILTS = [
  '@3xl:-rotate-1',
  '@3xl:rotate-[0.5deg] @3xl:-translate-y-2',
  '@3xl:rotate-[1.5deg]',
];

function Rule({ isLight }: { isLight: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'my-3 block border-t border-dashed',
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
  merchantLine = 'RAJKOT · GUJARAT · FOR LADIES',
  variant = 'Tilted',
  className,
}: ReceiptTiersProps) {
  const { ref, shown } = useReveal<HTMLElement>();
  const theme = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      ref={ref}
      className={cn(
        '@container w-full px-6 py-20 md:py-28 sm:px-10 border-b transition-colors duration-300',
        isLight
          ? 'bg-[#e9e8e3] border-[#232C3B]/15'
          : 'bg-[#111113] border-[#DFAF63]/15',
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: REVEAL_KEYFRAMES }} />

      {heading && (
        <div
          className={cn(
            'mx-auto mb-12 max-w-3xl text-center',
            revealClass(shown)
          )}
        >
          {eyebrow && (
            <div className="inline-flex items-center justify-center gap-2.5 mb-3.5">
              <span className={cn('h-px w-7', isLight ? 'bg-[#363D49]' : 'bg-[#E5B96F]')} />
              <p
                className={cn(
                  'font-mono text-xs uppercase tracking-[0.28em]',
                  isLight ? 'text-[#363D49]' : 'text-[#E5B96F]'
                )}
              >
                {eyebrow}
              </p>
              <span className={cn('h-px w-7', isLight ? 'bg-[#363D49]' : 'bg-[#E5B96F]')} />
            </div>
          )}
          <h2
            id="packages-heading"
            className={cn(
              'font-display uppercase text-4xl sm:text-5xl md:text-[3.5rem] tracking-[-0.01em] leading-tight',
              isLight ? 'text-[#232C3B]' : 'text-[#F7F1E8]'
            )}
          >
            {(() => {
              const parts = heading.trim().split(/\s+/);
              if (parts.length < 2) return heading;
              const last = parts.pop();
              return (
                <>
                  {parts.join(' ')}{' '}
                  <span
                    className={cn(
                      'bg-gradient-to-b bg-clip-text text-transparent',
                      isLight
                        ? 'from-[#5C392E] via-[#4C2E26] to-[#2A170F]'
                        : 'from-[#FFF2C6] via-[#E5B96F] to-[#C28B37]'
                    )}
                  >
                    {last}
                  </span>
                </>
              );
            })()}
          </h2>
          {subheading && (
            <p
              className={cn(
                'mt-3 text-sm sm:text-base leading-relaxed',
                isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-8 font-mono @3xl:grid-cols-3 @3xl:gap-7">
        {plans.map((plan, position) => (
          <div
            key={plan.id}
            style={revealDelay(shown, position)}
            className={cn(
              'relative px-6 pb-7 pt-8 text-[12.5px] leading-relaxed shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1',
              '[clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),97%_100%,94%_calc(100%-8px),91%_100%,88%_calc(100%-8px),85%_100%,82%_calc(100%-8px),79%_100%,76%_calc(100%-8px),73%_100%,70%_calc(100%-8px),67%_100%,64%_calc(100%-8px),61%_100%,58%_calc(100%-8px),55%_100%,52%_calc(100%-8px),49%_100%,46%_calc(100%-8px),43%_100%,40%_calc(100%-8px),37%_100%,34%_calc(100%-8px),31%_100%,28%_calc(100%-8px),25%_100%,22%_calc(100%-8px),19%_100%,16%_calc(100%-8px),13%_100%,10%_calc(100%-8px),7%_100%,4%_calc(100%-8px),1%_100%,0_calc(100%-8px))]',
              isLight ? 'bg-[#fefdf8] text-[#2a2a26]' : 'bg-[#1c1c1f] text-[#d8d8d2]',
              revealClass(shown),
              variant === 'Tilted' && TILTS[position % TILTS.length]
            )}
          >
            {plan.badge && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute right-4 top-16 -rotate-12 rounded border-2 border-[#c93a28] px-2 py-1 text-[10.5px] font-bold tracking-[0.14em] text-[#c93a28]',
                  isLight ? 'opacity-80 mix-blend-multiply' : 'opacity-90'
                )}
              >
                {plan.badge.toUpperCase()}
              </span>
            )}

            <p className="text-center text-[13.5px] font-bold tracking-[0.08em]">
              {merchant}
            </p>
            <p
              className={cn(
                'mt-1 text-center text-[10.5px] tracking-[0.06em]',
                isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
              )}
            >
              {merchantLine}
            </p>

            <Rule isLight={isLight} />

            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold tracking-[0.08em]">
                {plan.name.toUpperCase()}
              </span>
              <span className={isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'}>
                ×1
              </span>
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

            <ul className="space-y-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-baseline gap-2">
                  <span className="min-w-0 flex-shrink truncate">
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
                      'shrink-0',
                      isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
                    )}
                  >
                    INCL
                  </span>
                </li>
              ))}
            </ul>

            <Rule isLight={isLight} />

            <div
              className={cn(
                'flex items-baseline justify-between text-[11.5px]',
                isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
              )}
            >
              <span>DURATION</span>
              <span>{plan.duration ? plan.duration.toUpperCase() : 'CUSTOM'}</span>
            </div>
            <div
              className={cn(
                'flex items-baseline justify-between text-[11.5px]',
                isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
              )}
            >
              <span>CONSULTATION</span>
              <span>INCLUDED</span>
            </div>

            <div className="mt-2 flex items-baseline justify-between text-[16px] font-bold">
              <span>PACKAGE RATE</span>
              <span>{plan.rateLabel ? plan.rateLabel.toUpperCase() : 'ON QUOTE'}</span>
            </div>

            <Rule isLight={isLight} />

            {plan.ctaHref ? (
              <a
                href={plan.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'block w-full py-3 text-center text-[12.5px] font-bold tracking-[0.1em]',
                  'transition-transform duration-150 active:scale-[0.98]',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#c93a28] focus-visible:ring-offset-2',
                  isLight
                    ? 'bg-[#2a2a26] text-[#fefdf8] hover:bg-black focus-visible:ring-offset-[#fefdf8]'
                    : 'bg-[#ecece6] text-[#1c1c1f] hover:bg-white focus-visible:ring-offset-[#1c1c1f]'
                )}
              >
                {plan.cta.toUpperCase()}
              </a>
            ) : (
              <button
                type="button"
                className={cn(
                  'w-full py-3 text-[12.5px] font-bold tracking-[0.1em]',
                  'transition-transform duration-150 active:scale-[0.98]',
                  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#c93a28] focus-visible:ring-offset-2',
                  isLight
                    ? 'bg-[#2a2a26] text-[#fefdf8] hover:bg-black focus-visible:ring-offset-[#fefdf8]'
                    : 'bg-[#ecece6] text-[#1c1c1f] hover:bg-white focus-visible:ring-offset-[#1c1c1f]'
                )}
              >
                {plan.cta.toUpperCase()}
              </button>
            )}

            <div
              aria-hidden="true"
              className="mx-auto mt-5 h-10 w-4/5 opacity-80 [background-image:repeating-linear-gradient(90deg,currentColor_0,currentColor_2px,transparent_2px,transparent_5px,currentColor_5px,currentColor_6px,transparent_6px,transparent_9px)]"
            />
            <p
              className={cn(
                'mt-2 text-center text-[10px] tracking-[0.2em]',
                isLight ? 'text-[#7c7a72]' : 'text-[#8f8f95]'
              )}
            >
              {`NO. 00${28 + position} · THANK YOU`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReceiptTiers;
