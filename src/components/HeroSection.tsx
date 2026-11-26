'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Pause,
  Phone,
  Play,
  Plus,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useTheme } from '../hooks/useActivity';
import bridalPortrait from '../assets/images/hero_joie_bridal_1795666427366.jpg';
import balayagePortrait from '../assets/images/hero_joie_balayage_1795666428204.jpg';
import facialPortrait from '../assets/images/hero_joie_facial_1795666428836.jpg';
import haircutPortrait from '../assets/images/hero_joie_haircut_1795666428837.jpg';
import './HeroSection.css';

interface LookPin {
  id: string;
  label: string;
  category: string;
  detail: string;
  x: number;
  y: number;
}

interface StudioRitual {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  occasion: string;
  duration: string;
  summary: string;
  image: StaticImageData;
  imageAlt: string;
  whatsappText: string;
  pins: [LookPin, LookPin, LookPin];
}

const STUDIO_RITUALS: StudioRitual[] = [
  {
    id: 'bridal-couture',
    index: '01',
    title: 'Bridal Couture',
    shortTitle: 'Bridal Glam',
    occasion: 'Wedding Phera & Reception',
    duration: '150–180 mins',
    summary: 'Sweat-proof HD airbrush makeup, fresh mogra floral bun, and precision lehenga draping.',
    image: bridalPortrait,
    imageAlt: 'Radiant Indian bride at Joie Salon wearing maroon and gold lehenga with soft-glam HD makeup and fresh jasmine gajra bun',
    whatsappText: 'Hi Joie Salon, I would like to enquire about the Bridal Couture makeup & draping session.',
    pins: [
      {
        id: 'bridal-base',
        label: 'HD Airbrush Base',
        category: 'Makeup',
        detail: '16-hour breathable luminous finish calibrated for Rajkot evening photography.',
        x: 49,
        y: 34,
      },
      {
        id: 'bridal-bun',
        label: 'Mogra Gajra Bun',
        category: 'Hairstyle',
        detail: 'Sculpted low bridal chignon secured with fresh jasmine garlands and maang tikka balance.',
        x: 64,
        y: 33,
      },
      {
        id: 'bridal-drape',
        label: 'Double Dupatta Pin',
        category: 'Draping',
        detail: 'Clean, weightless lehenga pleating and veil anchoring for effortless movement.',
        x: 36,
        y: 58,
      },
    ],
  },
  {
    id: 'balayage-silk',
    index: '02',
    title: 'Balayage & Silk',
    shortTitle: 'Balayage',
    occasion: 'Dimensional Colour & Gloss',
    duration: '90–150 mins',
    summary: 'Hand-painted caramel ribbons, ammonia-free gloss sealing, and keratin frizz control.',
    image: balayagePortrait,
    imageAlt: 'Young Indian woman with seamless warm caramel and honey balayage waves styled at Joie Salon',
    whatsappText: 'Hi Joie Salon, I would like to book a Balayage, Hair Colour & Keratin consultation.',
    pins: [
      {
        id: 'balayage-melt',
        label: 'Seamless Root Melt',
        category: 'Colour',
        detail: 'Natural dark-to-warm blend designed to grow out cleanly without harsh regrowth lines.',
        x: 43,
        y: 23,
      },
      {
        id: 'balayage-waves',
        label: 'Caramel Ribbons',
        category: 'Dimension',
        detail: 'Warm honey and toffee hand-painted highlights tailored to Indian brunette undertones.',
        x: 72,
        y: 55,
      },
      {
        id: 'balayage-gloss',
        label: 'Keratin Shine Seal',
        category: 'Treatment',
        detail: 'Deep moisture mask and humidity shield for mirror-like softness.',
        x: 27,
        y: 57,
      },
    ],
  },
  {
    id: 'hydra-glow',
    index: '03',
    title: 'Hydra Glow Facial',
    shortTitle: 'Hydra Facial',
    occasion: 'Pre-Event & Glass Skin',
    duration: '45–60 mins',
    summary: 'Deep gentle exfoliation, brightening de-tan therapy, and lymphatic serum infusion.',
    image: facialPortrait,
    imageAlt: 'Woman with luminous dewy glass-skin complexion after a Hydra Glow Facial ritual at Joie Salon',
    whatsappText: 'Hi Joie Salon, I would like to book a Luxury Hydra Glow Facial session.',
    pins: [
      {
        id: 'facial-glow',
        label: '24K Hydra-Glow Dew',
        category: 'Infusion',
        detail: 'Multi-layer hyaluronic and vitamin C hydration for instant sunlit clarity.',
        x: 50,
        y: 36,
      },
      {
        id: 'facial-sculpt',
        label: 'Lymphatic Contour',
        category: 'Massage',
        detail: 'Calming acupressure massage that reduces puffiness and restores circulation.',
        x: 38,
        y: 46,
      },
      {
        id: 'facial-detan',
        label: 'Botanical De-Tan',
        category: 'Prep',
        detail: 'Sensitive-skin brightening veil crafted for Rajkot sun exposure.',
        x: 59,
        y: 22,
      },
    ],
  },
  {
    id: 'precision-blowout',
    index: '04',
    title: 'Precision Blowout',
    shortTitle: 'Cut & Blow-Dry',
    occasion: 'Everyday Signature Styling',
    duration: '40–55 mins',
    summary: 'Face-framing feather layers, clean split-end sculpting, and bouncy silk blow-dry volume.',
    image: haircutPortrait,
    imageAlt: 'Confident woman with precision face-framing layered haircut and glossy bouncy salon blowout',
    whatsappText: 'Hi Joie Salon, I would like to book a Haircut & Bouncy Blow-Dry session.',
    pins: [
      {
        id: 'cut-layers',
        label: 'Face-Framing Layers',
        category: 'Haircut',
        detail: 'Custom cheekbone-skimming graduation shaped around your natural hair fall.',
        x: 37,
        y: 43,
      },
      {
        id: 'cut-crown',
        label: 'Crown Volume Lift',
        category: 'Styling',
        detail: 'Tension-balanced round-brush lift for weightless bounce that holds all day.',
        x: 53,
        y: 22,
      },
      {
        id: 'cut-finish',
        label: 'Silk Press Ends',
        category: 'Finish',
        detail: 'Heat-protected curved ends that resist frizz and keep natural movement.',
        x: 65,
        y: 59,
      },
    ],
  },
];

const AUTOPLAY_MS = 6800;

function buildWhatsAppBookingHref(message: string) {
  return `${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent(message)}`;
}

export function HeroSection() {
  const theme = useTheme();
  const isLight = theme === 'light';
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isStageHovered, setIsStageHovered] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);

  const activeRitual = STUDIO_RITUALS[activeIndex];
  const activePin = activeRitual.pins[activePinIndex] ?? activeRitual.pins[0];

  // Pointer-responsive 3D perspective tilt + warm studio light sweep (compositor-only)
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlowX = useMotionValue(50);
  const rawGlowY = useMotionValue(35);

  const springConfig = { stiffness: 170, damping: 24, mass: 0.6 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const glowX = useSpring(rawGlowX, { stiffness: 120, damping: 26 });
  const glowY = useSpring(rawGlowY, { stiffness: 120, damping: 26 });
  const specularSheen = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(255, 241, 214, 0.22), transparent 65%)`;

  const selectRitual = useCallback((nextIndex: number, pauseAutoplay = false) => {
    const normalized = (nextIndex + STUDIO_RITUALS.length) % STUDIO_RITUALS.length;
    setActiveIndex(normalized);
    setActivePinIndex(0);
    if (pauseAutoplay) {
      setIsAutoPlaying(false);
    }
  }, []);

  // Gentle autoplay cycle when active, not hovered, and motion allowed
  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying || isStageHovered) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDIO_RITUALS.length);
      setActivePinIndex(0);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isAutoPlaying, isStageHovered]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse') return;
    const frame = stageFrameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * 6.5);
    rawRotateX.set((0.5 - py) * 5.5);
    rawGlowX.set(px * 100);
    rawGlowY.set(py * 100);
  };

  const handlePointerLeave = () => {
    setIsStageHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlowX.set(50);
    rawGlowY.set(35);
  };

  const handleSwipeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleSwipeEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      selectRitual(dx < 0 ? activeIndex + 1 : activeIndex - 1, true);
    }
  };

  const handleKeyboardSwitch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectRitual(activeIndex + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectRitual(activeIndex - 1, true);
    }
  };

  const bookingHref = buildWhatsAppBookingHref(
    `${activeRitual.whatsappText} (Interested in: ${activePin.label})`
  );

  return (
    <section
      id="top"
      aria-labelledby="joie-hero-heading"
      className="joie-atelier-hero"
    >
      {/* Subtle architectural editorial columns in background */}
      <div aria-hidden="true" className="joie-atelier-hero__grid-lines" />

      <div className="site-container relative z-10 pt-[calc(var(--salon-header-h,68px)+28px)] sm:pt-[calc(var(--salon-header-h,68px)+40px)] lg:pt-[calc(var(--salon-header-h,68px)+44px)] pb-10 lg:pb-12">
        {/* Primary 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-12 items-stretch">
          {/* LEFT COLUMN: Editorial Narrative, Primary Action & Interactive Studio Rituals */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 lg:py-2">
            <div className="space-y-5 sm:space-y-6">
              {/* Quiet unboxed metadata kicker (zero pills, zero status dots) */}
              <div
                className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-[13px] tracking-[0.06em] ${
                  isLight ? 'text-[#5A6475]' : 'text-[#B6C0CE]'
                }`}
              >
                <span className={isLight ? 'font-semibold text-[#232C3B]' : 'font-semibold text-[#F5F6F7]'}>
                  Ladies Hair, Skin &amp; Bridal Atelier
                </span>
                <span aria-hidden="true">·</span>
                <span>Jyoti Nagar, Behind Crystal Mall, Rajkot</span>
              </div>

              {/* Dominant Display Headline */}
              <h1
                id="joie-hero-heading"
                className={`joie-atelier-hero__display max-w-[16ch] ${
                  isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
                }`}
              >
                Tailored Hair, Luminous Skin &amp;{' '}
                <span className={isLight ? 'text-[#232C3B] italic' : 'text-[#CBD5E1] italic'}>
                  Bridal Couture.
                </span>
              </h1>

              {/* Concrete, grounded value proposition */}
              <p
                className={`max-w-[54ch] text-[15px] sm:text-base leading-[1.68] ${
                  isLight ? 'text-[#4B5565]' : 'text-[#B6C0CE]'
                }`}
              >
                Precision layer cuts, dimensional caramel balayage, hydra-glow facials, and
                sweat-proof HD bridal glam — thoughtfully styled in a calm ladies-only studio in Rajkot.
              </p>

              {/* Focused CTA Row: 1 Dominant Primary Action + Quiet Secondary Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-lg text-sm font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 transition-all duration-200 focus-ring ${
                    isLight
                      ? 'bg-[#232C3B] text-[#F8F6F2] hover:bg-[#161C26] shadow-[0_12px_28px_-10px_rgba(35,44,59,0.45)]'
                      : 'bg-[#232C3B] text-[#F8F6F2] border border-white/20 hover:bg-[#2F3B4F] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Book {activeRitual.shortTitle}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>

                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg border text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-ring ${
                    isLight
                      ? 'border-[#232C3B]/20 bg-white/70 text-[#232C3B] hover:border-[#232C3B]/45 hover:bg-white'
                      : 'border-white/20 bg-[#181B22]/75 text-[#F5F6F7] hover:border-white/40 hover:bg-[#232C3B]/70'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Get Directions</span>
                </a>

                <a
                  href="#services"
                  className={`inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-ring ${
                    isLight
                      ? 'text-[#5A6475] hover:text-[#232C3B]'
                      : 'text-[#B6C0CE] hover:text-[#F5F6F7]'
                  }`}
                >
                  <span>Full menu</span>
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Interactive Studio Ritual Selector (4 Clickable Chapters Synchronized with Portrait) */}
            <div
              className="pt-2"
              onKeyDown={handleKeyboardSwitch}
              aria-label="Explore signature salon rituals"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <p
                  className={`text-xs font-medium tracking-[0.04em] ${
                    isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'
                  }`}
                >
                  Select a signature look to inspect craft details
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying((prev) => !prev)}
                    aria-label={isAutoPlaying ? 'Pause lookbook rotation' : 'Play lookbook rotation'}
                    className={`inline-flex items-center justify-center gap-1.5 min-h-[34px] px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer focus-ring ${
                      isLight
                        ? 'text-[#4B5565] hover:bg-[#232C3B]/8 hover:text-[#232C3B]'
                        : 'text-[#B6C0CE] hover:bg-white/8 hover:text-[#F5F6F7]'
                    }`}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Auto</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Signature Joie Salon looks"
                className="grid grid-cols-2 gap-2.5 sm:gap-3"
              >
                {STUDIO_RITUALS.map((ritual, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={ritual.id}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="hero-studio-portrait-panel"
                      onClick={() => selectRitual(idx, true)}
                      className={`group relative overflow-hidden text-left rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer focus-ring ${
                        isActive
                          ? isLight
                            ? 'border-[#232C3B]/55 bg-white shadow-[0_10px_24px_-14px_rgba(35,44,59,0.22)]'
                            : 'border-white/35 bg-[#1B212D] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.7)]'
                          : isLight
                          ? 'border-[#232C3B]/12 bg-white/45 hover:bg-white/80 hover:border-[#232C3B]/28'
                          : 'border-white/10 bg-[#14171F]/65 hover:bg-[#1B212D]/85 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span
                          className={`text-sm font-semibold tracking-[-0.01em] truncate ${
                            isActive
                              ? isLight
                                ? 'text-[#232C3B]'
                                : 'text-[#F5F6F7]'
                              : isLight
                              ? 'text-[#394354]'
                              : 'text-[#CBD5E1]'
                          }`}
                        >
                          {ritual.title}
                        </span>
                        <span
                          className={`text-xs font-mono tabular-nums shrink-0 ${
                            isActive
                              ? isLight
                                ? 'text-[#232C3B]'
                                : 'text-[#F5F6F7]'
                              : isLight
                              ? 'text-[#7C8696]'
                              : 'text-[#8390A3]'
                          }`}
                        >
                          {ritual.index}
                        </span>
                      </div>

                      <p
                        className={`text-xs truncate ${
                          isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'
                        }`}
                      >
                        {ritual.occasion} · <span className="tabular-nums">{ritual.duration}</span>
                      </p>

                      {/* Hairline active progress track */}
                      {isActive && (
                        <div
                          aria-hidden="true"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                            isLight ? 'bg-[#232C3B]/15' : 'bg-white/15'
                          }`}
                        >
                          {isAutoPlaying && !isStageHovered && !prefersReducedMotion ? (
                            <motion.div
                              key={`${ritual.id}-progress`}
                              className={`joie-atelier-hero__progress-bar h-full ${
                                isLight ? 'bg-[#232C3B]' : 'bg-[#F5F6F7]'
                              }`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                            />
                          ) : (
                            <div
                              className={`h-full w-full ${
                                isLight ? 'bg-[#232C3B]' : 'bg-[#F5F6F7]'
                              }`}
                            />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Editorial Portrait Stage with 3D Depth & Technique Pins */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              id="hero-studio-portrait-panel"
              role="tabpanel"
              aria-label={`${activeRitual.title} interactive preview`}
              className="joie-atelier-hero__stage flex-1 flex flex-col"
            >
              <motion.div
                ref={stageFrameRef}
                style={
                  prefersReducedMotion
                    ? undefined
                    : {
                        rotateX,
                        rotateY,
                      }
                }
                onPointerEnter={() => setIsStageHovered(true)}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handleSwipeStart}
                onPointerUp={handleSwipeEnd}
                className="joie-atelier-hero__frame w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[540px] lg:h-full max-h-[620px]"
              >
                {/* Crossfading Editorial Studio Portrait */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRitual.id}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    {failedImages[activeRitual.id] ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#232C3B] to-[#121721] p-8 text-center">
                        <Scissors className="w-8 h-8 text-[#F5F6F7]" aria-hidden="true" />
                        <p className="font-crest-serif text-xl text-[#F5F6F7]">{activeRitual.title}</p>
                        <p className="text-xs text-[#B6C0CE] max-w-xs">{activeRitual.summary}</p>
                      </div>
                    ) : (
                      <Image
                        src={activeRitual.image}
                        alt={activeRitual.imageAlt}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 44vw"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [activeRitual.id]: true }))
                        }
                        className="object-cover object-top"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Live Pointer Specular Sheen */}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden="true"
                    style={{ background: specularSheen }}
                    className="pointer-events-none absolute inset-0 z-10 opacity-85"
                  />
                )}

                {/* Measured Top & Bottom Editorial Scrims for WCAG AAA Text Legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/55 via-black/20 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] z-10 bg-gradient-to-t from-[#0C0907]/95 via-[#0C0907]/62 to-transparent"
                />

                {/* Top Portrait Controls: Look Counter + Prev / Next */}
                <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between gap-3">
                  <div className="text-xs font-medium tracking-[0.08em] text-[#F5F6F7]/92 tabular-nums">
                    <span>{activeRitual.index}</span>
                    <span className="mx-1.5 text-[#F5F6F7]/45">/</span>
                    <span className="text-[#F5F6F7]/65">0{STUDIO_RITUALS.length}</span>
                    <span className="mx-2 text-[#F5F6F7]/45">·</span>
                    <span className="text-white">{activeRitual.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => selectRitual(activeIndex - 1, true)}
                      aria-label="Previous signature look"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/25 bg-[#232C3B]/75 text-[#F5F6F7] backdrop-blur-md hover:bg-[#232C3B] hover:border-white/60 transition-colors cursor-pointer focus-ring"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => selectRitual(activeIndex + 1, true)}
                      aria-label="Next signature look"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/25 bg-[#232C3B]/75 text-[#F5F6F7] backdrop-blur-md hover:bg-[#232C3B] hover:border-white/60 transition-colors cursor-pointer focus-ring"
                    >
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Interactive Technique Hotspots on the Portrait */}
                {activeRitual.pins.map((pin, pinIdx) => {
                  const isPinSelected = pinIdx === activePinIndex;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => {
                        setActivePinIndex(pinIdx);
                        setIsAutoPlaying(false);
                      }}
                      onMouseEnter={() => setActivePinIndex(pinIdx)}
                      aria-label={`Inspect ${pin.label}: ${pin.detail}`}
                      aria-pressed={isPinSelected}
                      data-active={isPinSelected}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      className="joie-atelier-hero__pin focus-ring rounded-full"
                    >
                      <span className="joie-atelier-hero__pin-core">
                        {isPinSelected ? (
                          <Sparkles className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  );
                })}

                {/* Interactive Editorial Craft Inspector Docked over Bottom Contrast Scrim */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
                  {/* Tactile Technique Selector Tabs (3 pins) */}
                  <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2.5 border-b border-white/15 pb-2.5"
                    role="group"
                    aria-label="Inspect techniques in this look"
                  >
                    {activeRitual.pins.map((pin, pinIdx) => {
                      const isPinSelected = pinIdx === activePinIndex;
                      return (
                        <button
                          key={pin.id}
                          type="button"
                          onClick={() => {
                            setActivePinIndex(pinIdx);
                            setIsAutoPlaying(false);
                          }}
                          className={`relative text-xs font-medium whitespace-nowrap transition-colors cursor-pointer py-1 focus-ring ${
                            isPinSelected
                              ? 'text-white'
                              : 'text-[#F5F6F7]/65 hover:text-white'
                          }`}
                        >
                          <span>{pin.label}</span>
                          {isPinSelected && (
                            <span
                              aria-hidden="true"
                              className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-white"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Pin Craft Detail */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePin.id}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-end justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium tracking-[0.06em] text-[#CBD5E1] mb-0.5">
                          {activePin.category} · {activeRitual.duration}
                        </p>
                        <p className="text-sm text-[#F5F6F7]/92 leading-snug line-clamp-2">
                          {activePin.detail}
                        </p>
                      </div>
                      <a
                        href={bookingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#CBD5E1] whitespace-nowrap shrink-0 pb-0.5 focus-ring"
                      >
                        <span>Enquire</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Full-Width Studio Proof & Quick-Access Strip Below the Hero Split */}
        <div
          className={`mt-10 lg:mt-12 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 ${
            isLight ? 'border-[#232C3B]/12' : 'border-white/12'
          }`}
        >
          <div>
            <p
              className={`text-lg font-semibold tabular-nums ${
                isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
              }`}
            >
              {BUSINESS_INFO.googleSnapshot.rating}
            </p>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'}`}>
              <span className="tabular-nums">{BUSINESS_INFO.googleSnapshot.reviewCount}+</span> verified Rajkot client ratings
            </p>
          </div>

          <div>
            <a
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors focus-ring ${
                isLight
                  ? 'text-[#232C3B] hover:text-[#475569]'
                  : 'text-[#F5F6F7] hover:text-[#CBD5E1]'
              }`}
            >
              <span>Jyoti Nagar Main Road</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'}`}>
              Near Masoom School, Behind Crystal Mall
            </p>
          </div>

          <div>
            <a
              href={BUSINESS_INFO.phoneHref}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums transition-colors focus-ring ${
                isLight
                  ? 'text-[#232C3B] hover:text-[#475569]'
                  : 'text-[#F5F6F7] hover:text-[#CBD5E1]'
              }`}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'}`}>
              Direct salon desk &amp; WhatsApp bookings
            </p>
          </div>

          <div className="sm:flex sm:flex-col sm:items-start lg:items-end justify-center">
            <a
              href="#bridals"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors whitespace-nowrap focus-ring ${
                isLight
                  ? 'text-[#232C3B] hover:text-[#475569]'
                  : 'text-[#F5F6F7] hover:text-[#CBD5E1]'
              }`}
            >
              <span>Explore Bridal Lookbook</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-[#5A6475]' : 'text-[#9CA7B8]'}`}>
              Interactive 360° wedding &amp; festive archive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
