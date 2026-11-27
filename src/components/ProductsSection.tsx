import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Calendar, MousePointerClick, SprayCan } from 'lucide-react';
import { DishOrbitCarousel } from './ui/dish-orbit-carousel';
import {
  PRODUCT_ITEMS,
  ProductCategoryFilter,
  filterProductsByCategory,
  buildProductWhatsAppUrl,
} from '../data/barbershopData';
import { useTheme } from '../hooks/useActivity';
import { BlurRevealHeading } from './ui/blur-reveal-heading';

const CATEGORY_TABS: { id: ProductCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hair', label: 'Hair Care' },
  { id: 'styling', label: 'Styling' },
  { id: 'skin', label: 'Skin & Glow' },
];

const PRODUCT_CUTOUT: Record<string, string> = {
  'matte-molding-hair-clay': '/assets/products/joie/matte-molding-hair-clay.png',
  'argan-rose-hair-elixir': '/assets/products/joie/argan-rose-hair-elixir-transparent.webp',
  'charcoal-detan-face-scrub': '/assets/products/joie/charcoal-detan-face-scrub.png',
  'sea-salt-volume-spray': '/assets/products/joie/sea-salt-volume-spray.png',
  'rose-glow-soothing-mist': '/assets/products/joie/rose-glow-soothing-mist.jpg',
  'keratin-repair-hair-serum': '/assets/products/joie/keratin-repair-hair-serum.png',
};

/** Slate charcoal tones so the orbit band morphs subtly within the unified brand palette. */
const PRODUCT_ACCENT: Record<string, string> = {
  'matte-molding-hair-clay': '#232C3B',
  'argan-rose-hair-elixir': '#334155',
  'charcoal-detan-face-scrub': '#1E293B',
  'sea-salt-volume-spray': '#3B485E',
  'rose-glow-soothing-mist': '#2A3547',
  'keratin-repair-hair-serum': '#475569',
};

const WISHLIST_STORAGE_KEY = 'joie-salon-product-wishlist';

function readWishlist(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? '[]');
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id): id is string =>
          typeof id === 'string' && PRODUCT_ITEMS.some((product) => product.id === id)
        ))]
      : [];
  } catch {
    return [];
  }
}

const FALLBACK_PHOTO = '/assets/products/joie/matte-molding-hair-clay.png';

/**
 * Split a product name into the two title weights the carousel renders:
 * a thin qualifier line and a heavy product line. A dangling "&" always
 * joins the thin line so the heavy line never opens on a stray symbol.
 */
function splitProductName(name: string): { title: string; subtitle: string } {
  const words = name.split(' ').filter(Boolean);
  if (words.length <= 2) return { title: words[0] ?? name, subtitle: words[1] ?? '' };

  let cut = Math.min(2, words.length - 1);
  if (words[cut]?.startsWith('&')) cut += 1;
  return {
    title: words.slice(0, cut).join(' '),
    subtitle: words.slice(cut).join(' '),
  };
}

export const ProductsSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    setWishlistIds(readWishlist());
    const syncWishlist = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY || event.key === null) {
        setWishlistIds(readWishlist());
      }
    };
    window.addEventListener('storage', syncWishlist);
    return () => window.removeEventListener('storage', syncWishlist);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlistIds((current) => {
      const next = current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Keep the wishlist usable for this visit if storage is unavailable.
      }
      return next;
    });
  }, []);

  const visibleProducts = useMemo(
    () => filterProductsByCategory(PRODUCT_ITEMS, selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const dishes = useMemo(
    () =>
      visibleProducts.map((product) => {
        const { title, subtitle } = splitProductName(product.name);
        return {
          id: product.id,
          title,
          subtitle,
          image: PRODUCT_CUTOUT[product.id] ?? FALLBACK_PHOTO,
          alt: `${product.name} — ${product.volume}`,
          eyebrow: `#${product.indexLabel} · ${product.categoryLabel}`,
          label: `${product.name} · ${product.volume}`,
          chef: product.categoryLabel,
          kitchen: product.holdOrFinish,
          description: product.description,
          ingredients: product.keyBenefits,
          accent: PRODUCT_ACCENT[product.id] ?? '#232C3B',
        };
      }),
    [visibleProducts]
  );

  const activeProduct = visibleProducts[activeIndex] ?? visibleProducts[0];

  const openWhatsApp = useCallback((productName: string, price: string) => {
    if (typeof window === 'undefined') return;
    window.open(
      buildProductWhatsAppUrl([`${productName} — ${price}`]),
      '_blank',
      'noopener,noreferrer'
    );
  }, []);

  const orderActiveProduct = useCallback(
    (index: number) => {
      const product = visibleProducts[index];
      if (!product) return;
      openWhatsApp(product.name, product.priceInr);
    },
    [openWhatsApp, visibleProducts]
  );

  const scrollToGallery = useCallback(() => {
    if (typeof window === 'undefined') return;
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      id="products"
      className="relative bg-[var(--color-background)] py-16 text-[var(--color-foreground)] sm:py-20"
    >
      <div className="site-container relative z-10">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className={`h-[1px] w-7 ${isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'}`} />
              <p
                className={`font-mono text-xs uppercase tracking-[0.26em] ${
                  isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
                }`}
              >
                SALON ESSENTIALS · RAJKOT, GUJARAT
              </p>
            </div>
            <BlurRevealHeading
              id="products-heading"
              className={`font-display text-4xl uppercase leading-none tracking-[-0.01em] sm:text-5xl md:text-[3.5rem] ${
                isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
              }`}
              segments={[
                { text: 'OUR' },
                { text: 'PRODUCTS', className: isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]' },
              ]}
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              Counter-sold hair and skin formulas used at every Joie Salon ritual. Explore
              the collection and find your everyday essentials.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div
              role="tablist"
              aria-label="Filter salon products by category"
              className="grid w-full grid-cols-2 items-center gap-1.5 rounded-2xl bg-[var(--color-card)] p-1.5 sm:inline-flex sm:w-auto sm:rounded-full"
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-center text-[11px] font-semibold tracking-[0.03em] transition-all focus-ring sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.06em] ${
                      isActive
                        ? 'bg-[#232C3B] text-[#F8F6F2] border border-white/15 shadow-[0_4px_16px_rgba(35,44,59,0.28)]'
                        : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <p
              className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
              }`}
            >
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
              Swipe or tap to browse
            </p>
          </div>
        </div>

        <DishOrbitCarousel
          key={selectedCategory}
          dishes={dishes}
          wishlistIds={wishlistIds}
          onToggleWishlist={toggleWishlist}
          loop={false}
          scrollWithPage={false}
          height="clamp(520px, 54vw, 720px)"
          stickyTop="var(--salon-header-h)"
          style={
            {
              '--dsh-surface': 'var(--color-background)',
              '--dsh-fg': 'var(--color-foreground)',
              '--dsh-muted': 'var(--color-muted-foreground)',
              '--dsh-ring': 'var(--color-primary)',
            } as React.CSSProperties
          }
          itemNoun="product"
          ariaLabel="Joie Salon product collection"
          primaryActionLabel="See the result"
          secondaryActionLabel="Order on WhatsApp"
          overviewLabel="Overview"
          detailsLabel="Benefits"
          onPlay={scrollToGallery}
          onOrder={(_dish, index) => orderActiveProduct(index)}
          onMenu={() => orderActiveProduct(activeIndex)}
          onChange={(index) => setActiveIndex(index)}
        />

        {/* Bottom Featured & Booking Strip */}
        <div className="mt-10 flex flex-col justify-between gap-6 rounded-2xl bg-[var(--color-card)] p-6 shadow-sm sm:mt-12 sm:p-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isLight ? 'bg-[#232C3B]/10 text-[#232C3B]' : 'bg-white/10 text-[#CBD5E1]'
                }`}
              >
                <SprayCan className="h-5 w-5" />
              </div>
              <div>
                <p
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
                  }`}
                >
                  Featured · {activeProduct?.categoryLabel ?? 'Signature collection'}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-foreground)]">
                  {activeProduct?.name ?? 'Signature collection'}
                  {activeProduct ? (
                    <span className="ml-2 font-mono text-sm font-normal text-[var(--color-muted-foreground)]">
                      {activeProduct.priceInr} · {activeProduct.volume}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>

          <a
            href={
              activeProduct
                ? buildProductWhatsAppUrl([
                    `${activeProduct.name} — ${activeProduct.priceInr}`,
                  ])
                : buildProductWhatsAppUrl([])
            }
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#F8F6F2] transition-all focus-ring sm:rounded-full ${
              isLight
                ? 'bg-[#232C3B] hover:bg-[#161C26] shadow-[0_8px_24px_rgba(35,44,59,0.24)]'
                : 'bg-[#232C3B] hover:bg-[#2F3B4F] border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Chat on WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
