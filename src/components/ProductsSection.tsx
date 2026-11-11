import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { DishOrbitCarousel } from './ui/dish-orbit-carousel';
import {
  PRODUCT_ITEMS,
  ProductCategoryFilter,
  filterProductsByCategory,
  buildProductWhatsAppUrl,
} from '../data/barbershopData';

const CATEGORY_TABS: { id: ProductCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hair', label: 'Hair' },
  { id: 'beard', label: 'Beard' },
  { id: 'skin', label: 'Skin' },
];

const PRODUCT_CUTOUT: Record<string, string> = {
  'matte-molding-hair-clay': '/assets/products/cutout/matte-molding-hair-clay.webp',
  'royal-oud-argan-beard-oil': '/assets/products/cutout/royal-oud-argan-beard-oil.webp',
  'charcoal-detan-face-scrub': '/assets/products/cutout/charcoal-detan-face-scrub.webp',
  'sea-salt-volume-spray': '/assets/products/cutout/sea-salt-volume-spray.webp',
  'sandalwood-cooling-aftershave': '/assets/products/cutout/sandalwood-cooling-aftershave.webp',
  'keratin-repair-hair-serum': '/assets/products/cutout/keratin-repair-hair-serum.webp',
};

const FALLBACK_PHOTO = '/assets/products/cutout/matte-molding-hair-clay.webp';

export const ProductsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleProducts = useMemo(
    () => filterProductsByCategory(PRODUCT_ITEMS, selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const dishes = useMemo(
    () =>
      visibleProducts.map((product, index) => ({
        title: product.name.split(' ').slice(0, 2).join(' '),
        subtitle: product.name.split(' ').slice(2).join(' ') || 'Salon formula',
        image: PRODUCT_CUTOUT[product.id] || FALLBACK_PHOTO,
        alt: product.name,
        eyebrow: `#${String(index + 1).padStart(2, '0')} Most loved`,
        label: `${product.name} · ${product.volume}`,
        rating: 4.9,
        chef: product.categoryLabel,
        kitchen: product.holdOrFinish,
        description: product.description,
        likes: 420 + index * 79,
        ingredients: product.keyBenefits,
        accent: index % 2 === 0 ? '#d9a34b' : '#b98356',
      })),
    [visibleProducts],
  );

  const activeProduct = visibleProducts[activeIndex] ?? visibleProducts[0];
  const orderUrl = activeProduct
    ? buildProductWhatsAppUrl([`${activeProduct.name} — ${activeProduct.priceInr}`])
    : buildProductWhatsAppUrl([]);

  return (
    <section id="products" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,163,75,0.18),_transparent_35%),linear-gradient(180deg,_rgba(12,9,7,0.92),_rgba(18,13,10,1))]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d9a34b]">
              salon essentials
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.08em] text-[#f7f1e8] sm:text-5xl">
              Our Products
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={[
                  'rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition',
                  selectedCategory === tab.id
                    ? 'border-[#d9a34b]/40 bg-[#d9a34b]/10 text-[#f7f1e8]'
                    : 'border-white/10 bg-white/[0.02] text-[#cbbba7] hover:border-white/20 hover:text-[#f7f1e8]',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <DishOrbitCarousel
          dishes={dishes}
          onChange={(index) => setActiveIndex(index)}
          onOrder={() => {
            if (typeof window !== 'undefined') {
              window.open(orderUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="min-h-[620px]"
        />

        <div className="mt-8 flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#17110d]/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9a34b]/12 text-[#f6d7a0]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d2b998]">Featured</p>
              <p className="mt-1 text-lg font-semibold text-[#f7f1e8]">
                {activeProduct?.name ?? 'Signature collection'}
              </p>
            </div>
          </div>

          <a
            href={orderUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#d9a34b]/40 bg-[#d9a34b]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f7f1e8] transition hover:bg-[#d9a34b]/16"
          >
            Chat on WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
