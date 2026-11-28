import { lazy, Suspense, useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { GALLERY_ITEMS, LOOKBOOK_VOLUMES } from '../data/lookbookBooks';
import { getLookbookPageImageSources, loadGalleryImage } from '../lib/lookbookImages';
import { useElementInView, useTheme } from '../hooks/useActivity';
import { GallerySkeleton } from './ui/gallery-skeleton';
import { BlurRevealHeading } from './ui/blur-reveal-heading';

export { GALLERY_ITEMS };

const LookbookGallery3D = lazy(() => import('./LookbookGallery3D'));

export const TransformationGallerySection = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const stageRef = useRef<HTMLDivElement>(null);
  const nearby = useElementInView(stageRef, { once: true, rootMargin: '1000px' });

  useEffect(() => {
    const sources = new Set(LOOKBOOK_VOLUMES.flatMap((volume) => volume.pages.flatMap(getLookbookPageImageSources)));
    void Promise.allSettled([...sources].map(loadGalleryImage));
  }, []);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden border-b border-white/10 bg-[#0C0907] py-16 sm:py-24"
    >
      <div className="site-container relative">
        <header className="mb-7 flex flex-col gap-5 sm:mb-9 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className={`mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] before:h-px before:w-8 before:bg-current ${
                isLight ? 'text-[#795b3f]' : 'text-[#DFC28C]'
              }`}
            >
              Ladies Lookbook · Rajkot
            </p>
            <BlurRevealHeading
              id="gallery-heading"
              className={`font-display uppercase text-[clamp(26px,7.4vw,39px)] leading-none sm:text-5xl md:text-[3.5rem] ${
                isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
              }`}
              segments={[
                { text: 'BEAUTY IN' },
                { text: 'MOTION', className: isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]' },
              ]}
            />
            <p className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${isLight ? 'text-[#535a63]' : 'text-[#C9B8A6]'}`}>
              Explore signature hairstyles, balayage colour, hydra-glow facials, nail art, and bridal looks crafted at Joie Salon.
            </p>
          </div>
          <a
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-instagram focus-ring inline-flex min-h-11 shrink-0 items-center self-start gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] lg:self-end"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            See more on Instagram
          </a>
        </header>

        <div ref={stageRef} className="lookbook-gallery-stage relative min-h-[600px] pb-5 sm:min-h-[660px] sm:pb-7">
          {nearby ? (
            <Suspense fallback={<div className="relative h-[480px] sm:h-[560px]"><GallerySkeleton /></div>}>
              <LookbookGallery3D theme={theme} />
            </Suspense>
          ) : (
            <div className="relative h-[480px] sm:h-[560px]">
              <GallerySkeleton />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

