'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, memo, Suspense, useCallback, useState, useEffect } from 'react';
import {
  DEFAULT_HERO_CROP,
  HeroCropConfig,
  ThemeMode,
  getNextThemeMode,
} from './data/barbershopData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { GroomingPackagesSection } from './components/GroomingPackagesSection';
import { OurBridalsSection } from './components/OurBridalsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ProductsSection } from './components/ProductsSection';
import { MeetYourBarberSection } from './components/MeetYourBarberSection';
import { TransformationGallerySection } from './components/TransformationGallerySection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { FaqSection } from './components/FaqSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { VisitAndBookSection } from './components/VisitAndBookSection';
import { Footer } from './components/Footer';
import { FloatingWhatsAppWidget } from './components/FloatingWhatsAppWidget';
const DesignSystemPreviewModal = lazy(() => import('./components/DesignSystemPreviewModal').then(module => ({ default: module.DesignSystemPreviewModal })));

const SiteSections = memo(function SiteSections() {
  return (
    <>
      <ServicesSection />
      <GroomingPackagesSection />
      <OurBridalsSection />
      <WhyChooseUsSection />
      <ProductsSection />
      <MeetYourBarberSection />
      <TransformationGallerySection />
      <CustomerReviewsSection />
      <FaqSection />
      <SocialMediaSection />
      <VisitAndBookSection />
    </>
  );
});

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [cropConfig, setCropConfig] = useState<HeroCropConfig>(DEFAULT_HERO_CROP);
  const [customCutoutUrl, setCustomCutoutUrl] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'layers' | 'tokens' | 'docs'>('layers');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('joie-salon-theme') ?? window.localStorage.getItem('relook-theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {
      // Keep the default theme when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('joie-salon-theme', theme);
    } catch {
      // Ignore storage quota errors in restricted iframes
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => getNextThemeMode(prev));
  }, []);

  const handleOpenInspector = useCallback((tab: 'layers' | 'tokens' | 'docs' = 'layers') => {
    setInspectorTab(tab);
    setInspectorOpen(true);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-[#F5F6F7] text-[#232C3B]'
          : 'bg-[#0C0907] text-[#F7F1E8]'
      }`}
    >
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:px-4 focus:py-2 focus:bg-[#F58A16] focus:text-[#0C0907] focus:font-bold focus:rounded-[4px]"
      >
        Skip to main content
      </a>

      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenBlueprintInspector={() => handleOpenInspector('docs')}
      />

      <main id="main-content" className="flex-1">
        <HeroSection />

        <SiteSections />
      </main>

      <Footer theme={theme} onOpenInspector={handleOpenInspector} />

      <FloatingWhatsAppWidget />

      {inspectorOpen && <Suspense fallback={null}><DesignSystemPreviewModal
        isOpen={inspectorOpen}
        initialTab={inspectorTab}
        onClose={() => setInspectorOpen(false)}
        cropConfig={cropConfig}
        onChangeCropConfig={setCropConfig}
        customCutoutUrl={customCutoutUrl}
        onChangeCustomCutoutUrl={setCustomCutoutUrl}
      /></Suspense>}
    </div>
  );
}
