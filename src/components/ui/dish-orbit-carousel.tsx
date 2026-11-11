'use client'

import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, Star } from 'lucide-react';

export type Dish = {
  title: string;
  subtitle: string;
  image: string;
  alt?: string;
  eyebrow?: string;
  label?: string;
  rating: number;
  chef: string;
  kitchen?: string;
  description: string;
  likes: number;
  ingredients?: string[];
  accent: string;
};

export type DishOrbitCarouselProps = {
  dishes: Dish[];
  className?: string;
  onChange?: (index: number) => void;
  onOrder?: (dish: Dish, index: number) => void;
};

const cn = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(' ');

export function DishOrbitCarousel({
  dishes,
  className,
  onChange,
  onOrder,
}: DishOrbitCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const [tab, setTab] = React.useState<'overview' | 'ingredients'>('overview');
  const activeDish = dishes[index] ?? dishes[0];

  React.useEffect(() => {
    if (!dishes.length) return;
    setIndex((current) => (current >= dishes.length ? 0 : current));
  }, [dishes]);

  React.useEffect(() => {
    onChange?.(index);
  }, [index, onChange]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((current) => (current + 1) % dishes.length);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((current) => (current - 1 + dishes.length) % dishes.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dishes.length]);

  if (!dishes.length || !activeDish) {
    return null;
  }

  const step = (direction: 1 | -1) => {
    setIndex((current) => {
      const next = (current + direction + dishes.length) % dishes.length;
      return next;
    });
  };

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#120d0a] shadow-[0_30px_80px_rgba(0,0,0,0.42)]',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,190,110,0.18),_transparent_38%),linear-gradient(180deg,_rgba(18,13,10,0.96),_rgba(10,8,7,0.98))]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative z-10 p-4 sm:p-6 xl:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d9a34b]">
              our collection
            </p>
            <h3 className="mt-3 font-display text-3xl tracking-[-0.06em] text-[#f7f1e8] sm:text-4xl">
              Essential grooming, styled to perform.
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => step(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f7f1e8] transition hover:border-[#d9a34b]/60 hover:bg-[#d9a34b]/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => step(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f7f1e8] transition hover:border-[#d9a34b]/60 hover:bg-[#d9a34b]/10"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div className="relative h-[360px] sm:h-[430px]">
            <div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9a34b]/25 bg-[radial-gradient(circle,_rgba(217,163,75,0.18),_transparent_60%)]" />
            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

            {dishes.map((dish, dishIndex) => {
              const isActive = dishIndex === index;
              const angle = ((dishIndex - index) * 28) % 360;
              const offsetX = Math.sin((angle * Math.PI) / 180) * 142;
              const offsetY = Math.cos((angle * Math.PI) / 180) * 82;

              return (
                <motion.div
                  key={`${dish.title}-${dish.subtitle}`}
                  animate={{
                    x: isActive ? 12 : offsetX,
                    y: isActive ? -4 : offsetY,
                    scale: isActive ? 1 : 0.78,
                    rotate: isActive ? 0 : angle * 0.5,
                    opacity: isActive ? 1 : 0.18,
                    zIndex: isActive ? 20 : 5,
                  }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className="relative flex h-[220px] w-[220px] items-center justify-center rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(16,11,9,0.4))] shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
                    style={{
                      boxShadow: isActive ? `0 24px 48px ${dish.accent}22` : undefined,
                    }}
                  >
                    <div
                      className="absolute inset-x-6 bottom-5 h-7 rounded-full blur-xl"
                      style={{ backgroundColor: `${dish.accent}55` }}
                    />
                    <motion.img
                      src={dish.image}
                      alt={dish.alt ?? dish.title}
                      className="relative z-10 h-[180px] w-[180px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)]"
                      animate={{ y: isActive ? 0 : 10 }}
                      transition={{ duration: 0.55, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            key={activeDish.title + activeDish.subtitle}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-[26px] border border-white/10 bg-[#19120f]/90 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-[#d9a34b]/30 bg-[#d9a34b]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f6d7a0]">
                {activeDish.eyebrow ?? 'Most loved'}
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[#f7f1e8]">
                <Star className="h-3.5 w-3.5 fill-[#f5c768] text-[#f5c768]" />
                <span className="text-sm font-semibold">{activeDish.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-xl uppercase tracking-[0.12em] text-[#f7f1e8]">
                {activeDish.title}
              </span>
              <span className="font-semibold text-[#d9a34b]">•</span>
              <span className="text-sm uppercase tracking-[0.18em] text-[#cbbba7]">
                {activeDish.subtitle}
              </span>
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: activeDish.accent }}
                />
                <p className="text-sm font-medium text-[#f7f1e8]">{activeDish.chef}</p>
              </div>
              <p className="text-sm leading-6 text-[#c9b9a8]">{activeDish.description}</p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {(['overview', 'ingredients'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition',
                    tab === item
                      ? 'bg-[#f7f1e8] text-[#120d0a]'
                      : 'border border-white/10 bg-transparent text-[#d6c5b2]',
                  )}
                >
                  {item === 'overview' ? 'Overview' : 'Ingredients'}
                </button>
              ))}
            </div>

            <div className="mt-5 min-h-[112px]">
              {tab === 'overview' ? (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-[#d5c4ae]">
                    {activeDish.kitchen ?? 'Crafted for everyday performance and polished finishing.'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-[#e8d3a8]">
                    <span className="rounded-full border border-[#d9a34b]/20 bg-[#d9a34b]/5 px-2.5 py-1">
                      {activeDish.kitchen ?? 'Salon formula'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                      {activeDish.likes.toLocaleString()} likes
                    </span>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2 text-sm text-[#d9ceb8]">
                  {(activeDish.ingredients ?? ['Clean ingredients', 'Performance-ready finish', 'Lightweight comfort']).map((ingredient) => (
                    <li key={ingredient} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d9a34b]" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#d2b998]">Available now</p>
                <p className="mt-2 text-2xl font-semibold text-[#f7f1e8]">₹{activeDish.likes}</p>
              </div>

              <button
                type="button"
                onClick={() => onOrder?.(activeDish, index)}
                className="inline-flex items-center gap-2 rounded-full bg-[#f7f1e8] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#120d0a] transition hover:bg-[#f1d7a8]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Reserve
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dishes.map((dish, dishIndex) => (
            <button
              key={`${dish.title}-${dish.subtitle}-thumb`}
              type="button"
              onClick={() => setIndex(dishIndex)}
              className={cn(
                'group min-w-[110px] rounded-2xl border px-2 py-2 transition',
                dishIndex === index
                  ? 'border-[#d9a34b]/40 bg-[#d9a34b]/10'
                  : 'border-white/10 bg-white/[0.02]',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1a130f]">
                  <img src={dish.image} alt="" className="h-8 w-8 object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#d2b998]">{dish.title}</p>
                  <p className="mt-1 text-[10px] text-[#f7f1e8]">{dish.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DishOrbitCarousel;
