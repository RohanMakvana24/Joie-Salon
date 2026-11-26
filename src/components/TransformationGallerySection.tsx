import { lazy, Suspense, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { GALLERY_ITEMS } from '../data/lookbookBooks';
import { useElementInView, useTheme } from '../hooks/useActivity';
import { GallerySkeleton } from './ui/gallery-skeleton';
import { RisingInk } from './ui/rising-ink';

export { GALLERY_ITEMS };

const LookbookGallery3D = lazy(() => import('./LookbookGallery3D'));

export const TransformationGallerySection = () => {
  const theme = useTheme();
  const stageRef = useRef<HTMLDivElement>(null);
  const nearby = useElementInView(stageRef, { once: true, rootMargin: '260px' });

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden border-b border-white/10 bg-[#0C0907] py-20 sm:py-28"
    >
      <div className="site-container relative">
        <div className="mx-auto mb-6 max-w-2xl px-4 text-center sm:mb-8">
          <p
            className={`mb-3 font-mono text-[11px] uppercase tracking-[0.28em] ${
              theme === 'light' ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
            }`}
          >
            Ladies Lookbook · Rajkot
          </p>
          <RisingInk
            as="h2"
            id="gallery-heading"
            text="BEAUTY IN MOTION"
            color={theme === 'light' ? '#232C3B' : '#F5F6F7'}
            colors={theme === 'light' ? ['#232C3B', '#475569'] : ['#F5F6F7', '#94A3B8']}
            lift={0.48}
            radius={1.5}
            className="font-display text-4xl leading-none sm:text-5xl md:text-[3.5rem]"
          />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#C9B8A6] sm:text-base">
            Explore signature hairstyles, balayage colour, hydra-glow facials, nail art, and bridal looks crafted at Joie Salon.
          </p>
        </div>

        <div ref={stageRef} className="lookbook-gallery-stage relative min-h-[540px] sm:min-h-[620px]">
          {nearby ? (
            <Suspense fallback={<div className="relative h-[420px] sm:h-[520px]"><GallerySkeleton /></div>}>
              <LookbookGallery3D theme={theme} />
            </Suspense>
          ) : (
            <div className="relative h-[420px] sm:h-[520px]">
              <GallerySkeleton />
            </div>
          )}
        </div>

        <div className="mt-9 flex justify-center">
          <a
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-instagram focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em]"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

