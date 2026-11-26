import { SkeletonImage } from './ui/skeleton-image';
import React, { useState } from 'react';
import {
  Shield,
  ArrowUpRight,
  PhoneCall,
  Calendar,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_ITEMS,
  ServiceCategoryFilter,
  filterServicesByCategory,
} from '../data/barbershopData';
import './ServicesSection.css';
import { SalonServiceIcon } from './SalonServiceIcon';
import { useTheme } from '../hooks/useActivity';

const CATEGORY_TABS: { id: ServiceCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Services (6)' },
  { id: 'hair', label: 'Hair & Colour' },
  { id: 'skin', label: 'Skin & Beauty' },
  { id: 'bridal', label: 'Bridal & Nails' },
];

const SERVICE_VISUALS: Record<string, { image: string; alt: string; title: string; detail: string; tags: string[]; word: string }> = {
  'ladies-haircuts-styling': {
    image: '/assets/characters/services/ladies-haircut.png',
    alt: '3D woman showing glossy layered hair and a fresh bouncy blowout',
    title: 'Haircuts & Blow-Dry',
    detail: 'Layer, feather and step cuts shaped around your face with a silky salon blow-dry.',
    tags: ['Layer & feather', 'Blow-dry finish'],
    word: 'CHIC',
  },
  'hair-color-keratin': {
    image: '/assets/characters/services/ladies-color.png',
    alt: '3D woman with caramel balayage highlights and smooth shiny hair',
    title: 'Colour, Balayage & Keratin',
    detail: 'Dimensional balayage, root touch-ups, keratin smoothing and nourishing hair spa.',
    tags: ['Balayage & colour', 'Keratin spa'],
    word: 'RADIANT',
  },
  'facials-skin-rituals': {
    image: '/assets/characters/services/ladies-facial.png',
    alt: '3D woman with glowing skin holding a luxury facial serum dropper',
    title: 'Facials & Hydra Glow',
    detail: 'Clean-ups, hydra-glow facials and gentle de-tan rituals for luminous skin.',
    tags: ['Hydra facial', 'De-tan glow'],
    word: 'GLOW',
  },
  'threading-waxing-care': {
    image: '/assets/characters/services/ladies-threading.png',
    alt: '3D woman with neatly shaped eyebrows holding a sleek salon mirror',
    title: 'Threading & Waxing',
    detail: 'Precision brow shaping, Rica & chocolate waxing, and soothing post-care hydration.',
    tags: ['Brow shaping', 'Rica waxing'],
    word: 'SMOOTH',
  },
  'bridal-party-makeup': {
    image: '/assets/characters/services/ladies-bridal.png',
    alt: '3D Indian bride-to-be in maroon and gold lehenga with soft glam bridal makeup',
    title: 'Bridal & Party Makeup',
    detail: 'HD & airbrush bridal glam, floral bun styling and traditional saree draping.',
    tags: ['HD & airbrush', 'Hair & draping'],
    word: 'BRIDAL',
  },
  'manicure-pedicure-nails': {
    image: '/assets/characters/services/ladies-nails.png',
    alt: '3D woman admiring her freshly manicured glossy nails',
    title: 'Mani-Pedi & Nail Art',
    detail: 'Spa manicure & pedicure, gel polish, French tips and custom festive nail art.',
    tags: ['Spa mani-pedi', 'Gel & nail art'],
    word: 'GLAM',
  },
};

export const ServicesSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryFilter>('all');
  const [activeCard, setActiveCard] = useState(0);
  const deckRef = React.useRef<HTMLDivElement>(null);
  const dragX = React.useRef(0);
  const dragFrame = React.useRef(0);
  React.useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);
  const paintDrag = () => {
    dragFrame.current = 0;
    const deck = deckRef.current; if (!deck) return;
    deck.dataset.dragging = String(dragX.current !== 0);
    deck.style.setProperty('--deck-drag', `${dragX.current}px`);
    deck.style.setProperty('--deck-drag-tilt', `${dragX.current / 35}deg`);
  };
  const resetDrag = () => { cancelAnimationFrame(dragFrame.current); dragX.current = 0; paintDrag(); touchStart.current = null; };
  const touchStart = React.useRef<{ x: number; y: number; axis: 'horizontal' | 'vertical' | null } | null>(null);
  const didSwipe = React.useRef(false);
  const visibleServices = filterServicesByCategory(SERVICE_ITEMS, selectedCategory);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-[#0C0907] py-20 md:py-28 border-b border-white/10 overflow-hidden"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 hidden md:block -translate-x-1/2 w-[900px] h-[380px] rounded-full bg-[#CBD5E1]/[0.05] blur-[100px]"
      />

      <div className="site-container relative z-10">
        {/* Section Header + Category Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className={`h-[1px] w-7 ${isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'}`} />
              <p className={`font-mono text-xs uppercase tracking-[0.26em] ${isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'}`}>
                HAIR, SKIN &amp; BRIDAL MENU · RAJKOT, GUJARAT
              </p>
            </div>
            <h2
              id="services-heading"
              className="font-display uppercase text-4xl sm:text-5xl md:text-[3.5rem] text-[#F7F1E8] tracking-[-0.01em] leading-none"
            >
              OUR{' '}
              <span className={isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'}>
                SERVICES
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sleek Category Filter Bar — 2x2 Rounded Grid on Mobile, Pill Bar on sm+ */}
            <div
              role="tablist"
              aria-label="Filter salon services by category"
              className={`grid grid-cols-2 sm:inline-flex sm:flex-wrap items-center gap-1.5 rounded-2xl sm:rounded-full border p-1.5 w-full sm:w-auto self-start lg:self-auto ${
                isLight ? 'border-[#232C3B]/15 bg-white' : 'border-white/15 bg-[#14171F]'
              }`}
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => { setSelectedCategory(tab.id); setActiveCard(0); resetDrag(); }}
                    className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.03em] sm:tracking-[0.06em] text-center transition-all cursor-pointer focus-ring ${
                      isActive
                        ? 'bg-[#232C3B] text-[#F8F6F2] shadow-[0_4px_16px_rgba(35,44,59,0.28)]'
                        : isLight
                        ? 'text-[#4B5563] hover:text-[#232C3B]'
                        : 'text-[#B6C0CE] hover:text-[#F5F6F7]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Character-led service cards, with mobile swipe navigation. */}
        <div
          ref={deckRef}
          className="service-deck grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          data-dragging="false"
          role="region"
          aria-label="Services — swipe left or right on mobile"
          onTouchStart={(event) => {
            resetDrag();
            didSwipe.current = false;
            if (event.touches.length !== 1 || window.innerWidth >= 768) return;
            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, axis: null };
          }}
          onTouchMove={(event) => {
            if (!touchStart.current || event.touches.length !== 1) return;
            const dx = event.touches[0].clientX - touchStart.current.x;
            const dy = event.touches[0].clientY - touchStart.current.y;
            if (!touchStart.current.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
              touchStart.current.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
            }
            if (touchStart.current.axis === 'horizontal') {
              didSwipe.current = true;
              dragX.current = Math.max(-110, Math.min(110, dx));
              if (!dragFrame.current) dragFrame.current = requestAnimationFrame(paintDrag);
            }
          }}
          onTouchEnd={() => {
            // Capture direction before resetting the ref; React may run the updater later.
            const direction = dragX.current < 0 ? 1 : -1;
            if (Math.abs(dragX.current) > 40) setActiveCard((current) => (current + direction + visibleServices.length) % visibleServices.length);
            resetDrag();
          }}
          onTouchCancel={resetDrag}
          onClickCapture={(event) => {
            if (didSwipe.current) { event.preventDefault(); event.stopPropagation(); }
          }}
        >
          {visibleServices.map((service, index) => {
            const isFeatured = Boolean(service.featuredOrangeCard);
            const visual = SERVICE_VISUALS[service.id];
            const offset = (index - activeCard + visibleServices.length) % visibleServices.length;
            const position = offset > visibleServices.length / 2 ? offset - visibleServices.length : offset;
            return (
              <div
                key={service.id}
                className="service-deck-card"
                data-active={position === 0}
                data-visible={Math.abs(position) <= 1}
                style={{
                  '--deck-position': position,
                  '--deck-depth': Math.abs(position),
                  '--deck-tilt': position === 0 ? 'var(--deck-drag-tilt, 0deg)' : '0deg',
                  '--deck-opacity': position === 0 ? 1 : 0.6,
                  zIndex: visibleServices.length - Math.abs(position),
                } as React.CSSProperties}
              >
              <article className="service-character-card" data-featured={isFeatured}>
                <div className="service-character-card__stage">
                  <div className="service-character-card__arch" aria-hidden="true"><span>{visual.word}</span></div>
                  <span className="service-character-card__spark" aria-hidden="true"><SalonServiceIcon serviceId={service.id} /></span>
                  <SkeletonImage skeletonClassName="image-skeleton--portrait" src={visual.image} alt={visual.alt} loading="lazy" decoding="async" draggable={false} width="1024" height="1024" />
                  {isFeatured && <span className="service-character-card__signature">THE SIGNATURE LOOK</span>}
                </div>
                <div className="service-character-card__body">
                  <div className="service-character-card__eyebrow">
                    <span>SERVICE {service.indexLabel}</span>
                    <span className="flex items-center gap-2">
                      {service.duration && (
                        <span className="text-[9px] tracking-normal font-medium text-[var(--service-gold)] border border-[var(--service-line)] px-2 py-0.5 rounded-full bg-[var(--service-panel)]">
                          {service.duration}
                        </span>
                      )}
                      <SalonServiceIcon serviceId={service.id} size={15} />
                    </span>
                  </div>
                  <h3>{visual.title}</h3>
                  <p>{visual.detail}</p>
                  <div className="service-character-card__tags">{visual.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="service-character-card__actions"><a href={`${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent('Hi Joie Salon, I would like to book ' + visual.title + '.')}`} target="_blank" rel="noopener noreferrer">Book this look <ArrowUpRight size={16} /></a><a href={BUSINESS_INFO.phoneHref} aria-label={`Call for ${visual.title} pricing`}>Call for pricing</a></div>
                </div>
              </article>

              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col items-center gap-4 md:hidden">
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Previous service" onClick={() => setActiveCard((activeCard - 1 + visibleServices.length) % visibleServices.length)} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border focus-ring ${isLight ? 'border-[#232C3B]/25 text-[#232C3B]' : 'border-white/25 text-[#F5F6F7]'}`}><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
            <div className="flex items-center gap-2" aria-label="Choose a service">
              {visibleServices.map((service, index) => (
                <button key={service.id} type="button" aria-label={`Show ${service.title}`} aria-pressed={activeCard === index} onClick={() => setActiveCard(index)} className={`h-2 rounded-full transition-all duration-300 focus-ring ${activeCard === index ? (isLight ? 'w-7 bg-[#232C3B]' : 'w-7 bg-[#F5F6F7]') : (isLight ? 'w-2 bg-[#232C3B]/25' : 'w-2 bg-white/25')}`} />
              ))}
            </div>
            <button type="button" aria-label="Next service" onClick={() => setActiveCard((activeCard + 1) % visibleServices.length)} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border focus-ring ${isLight ? 'border-[#232C3B]/25 text-[#232C3B]' : 'border-white/25 text-[#F5F6F7]'}`}><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9B8A6]" aria-live="polite">Swipe to explore · {activeCard + 1} / {visibleServices.length}</p>
        </div>

        {/* Bottom Custom Consultation & Direct Booking Strip */}
        <div className="luxury-card-shadow mt-10 sm:mt-12 rounded-2xl border border-[#232C3B]/15 bg-[#140F0C] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg font-bold text-[#F7F1E8]">
              Looking for a custom haircut, bridal makeup trial, or skin ritual in Rajkot?
            </p>
            <p className="text-xs sm:text-sm text-[#C9B8A6] mt-1 leading-relaxed">
              Every session at Joie Salon is tailored to your hair texture, skin type, and occasion. Message us on WhatsApp or call our Rajkot ladies salon directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={BUSINESS_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-[#232C3B] hover:bg-[#161C26] text-[#F8F6F2] border border-white/15 font-bold text-xs uppercase tracking-[0.08em] transition-all shadow-[0_8px_24px_rgba(35,44,59,0.28)] focus-ring"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">Booking</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href={BUSINESS_INFO.phoneHref}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-full border font-semibold text-xs uppercase tracking-[0.08em] transition-colors focus-ring ${
                isLight
                  ? 'border-[#232C3B]/30 text-[#232C3B] hover:border-[#232C3B]'
                  : 'border-white/25 text-[#F5F6F7] hover:border-white/60'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
