import { lazy, Suspense, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useElementInView, useTheme } from '../hooks/useActivity';
import { GallerySkeleton } from './ui/gallery-skeleton';
import { RisingInk } from './ui/rising-ink';

const InfiniteMenu = lazy(() => import('./ui/InfiniteMenu'));

const GALLERY_ITEMS = [
  { image: '/assets/gallery/feather-layers-blowout.jpg', title: 'Feather Layers & Blowout', description: 'Face-framing feather layers with a bouncy salon blow-dry.' },
  { image: '/assets/gallery/caramel-balayage-waves.jpg', title: 'Caramel Honey Balayage', description: 'Sun-lit hand-painted balayage curls with glossy keratin shine.' },
  { image: '/assets/gallery/curtain-bangs-soft-waves.jpg', title: 'Curtain Bangs & Waves', description: 'Wispy soft curtain bangs paired with silky chocolate waves.' },
  { image: '/assets/gallery/mogra-gajra-bridal-bun.jpg', title: 'Mogra Gajra Bridal Bun', description: 'Sculpted bridal chignon adorned with fresh jasmine and gold pins.' },
  { image: '/assets/gallery/hydra-glow-glass-skin.jpg', title: 'Hydra-Glow Facial & Brows', description: 'Dewy glass-skin radiance with cleanly shaped eyebrows.' },
  { image: '/assets/gallery/rose-chrome-nail-couture.jpg', title: 'Rose & Gold Nail Couture', description: 'Almond rose-nude gel extensions with delicate gold-leaf artistry.' },
  { image: '/assets/bridals/royal-maroon-bridal.png', title: 'Royal Maroon Bridal', description: 'HD airbrush bridal makeup, mogra bun & timeless lehenga draping.' },
  { image: '/assets/bridals/sangeet-caramel-glam.png', title: 'Sangeet Caramel Glam', description: 'Soft bronze smokey eyes and glossy Hollywood waves.' },
  { image: '/assets/bridals/reception-couture-blowout.png', title: 'Reception Couture Blowout', description: 'Lifted crown volume with sleek face-framing layers.' },
  { image: '/assets/bridals/haldi-dewy-glow.png', title: 'Haldi Dewy Glow', description: 'Breathable sunlit makeup with floral-ready messy bun.' },
  { image: '/assets/bridals/mehndi-nail-couture.png', title: 'Mehndi Nail Couture', description: 'Festive gel polish paired with half-up romantic curls.' },
  { image: '/assets/bridals/engagement-sculpt.png', title: 'Engagement Brow Sculpt', description: 'Precision brow framing and camera-ready satin skin finish.' },
];

export const TransformationGallerySection = () => {
  const theme = useTheme();
  const stageRef = useRef<HTMLDivElement>(null);
  const nearby = useElementInView(stageRef, { once: true, rootMargin: '240px' });
  return (
  <section id="gallery" aria-labelledby="gallery-heading" className="relative overflow-hidden border-b border-white/10 bg-[#0C0907] py-20 sm:py-28">
    <div className="site-container relative">
      <div className="mx-auto mb-4 max-w-2xl px-5 text-center sm:mb-6">
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

      <div ref={stageRef} className="gallery-immersive-stage relative h-[420px] sm:h-[560px]">
        {nearby ? <Suspense fallback={<GallerySkeleton />}><InfiniteMenu items={GALLERY_ITEMS} count={160} tileSize={0.63} roundness={0.2}
          zoom={1.65} pullBack={1} stretch={0.6} inertia={0.6} autoplay={3}
          grayscale dim={0.5} intro showInfo theme={theme} accentColor={theme === 'light' ? '#232C3B' : '#CBD5E1'} /></Suspense> : <GallerySkeleton />}
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
