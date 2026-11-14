'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, ArrowRight, Sun, Moon } from 'lucide-react';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenBlueprintInspector?: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Packages', href: '#packages' },
  { label: 'Products', href: '#products' },
  { label: 'The Shop', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
  { label: 'Blog', href: '/blog' },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
}) => {
  const pathname = usePathname();
  const isInteriorPage = pathname !== '/';
  const navigationLinks = NAV_LINKS.map((link) => ({
    ...link,
    href: isInteriorPage && link.href.startsWith('#') ? `/${link.href}` : link.href,
  }));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#top');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const navigationCleanupRef = useRef<(() => void) | null>(null);
  const isLight = theme === 'light';
  // In the Hero section (before scrolling), keep the navbar 100% transparent with dark/gold foreground against hero artwork.
  // When scrolled, seamlessly match the user's selected theme (dark studio glass or warm light glass).
  const surfaceTheme: ThemeMode = isScrolled || isInteriorPage ? theme : 'dark';
  const useLightSurface = surfaceTheme === 'light';

  useEffect(() => () => navigationCleanupRef.current?.(), []);

  useEffect(() => {
    const bar = headerBarRef.current;
    if (!bar) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty('--salon-header-h', `${bar.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInteriorPage) {
      setActiveSection(pathname.startsWith('/blog') ? '/blog' : '');
      return;
    }
    let frameId = 0;
    const checkScrollAndSection = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      // Track active section for Scroll Spy
      const sections = [...NAV_LINKS].reverse().map((link) => link.href).filter((href) => href.startsWith('#'));
      const scrollPosition = (headerBarRef.current?.getBoundingClientRect().height ?? 60) + 24;

      for (const sectionId of sections) {
        if (sectionId === '#top') {
          setActiveSection('#top');
          break;
        }
        const element = document.querySelector(sectionId);
        if (element instanceof HTMLElement) {
          const top = element.getBoundingClientRect().top;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(checkScrollAndSection);
    };

    checkScrollAndSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [isInteriorPage, pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => firstMobileLinkRef.current?.focus(), 50);
      }
      return next;
    });
  };

  const handleSectionNavigation = (event: React.MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    const href = link?.getAttribute('href');
    const target = href ? document.getElementById(href.slice(1)) : null;
    if (!target || !href) return;
    event.preventDefault();
    navigationCleanupRef.current?.();
    setMobileMenuOpen(false);
    if (window.location.hash !== href) window.history.pushState(null, '', href);
    requestAnimationFrame(() => {
      const destination = () => {
        const headerHeight = headerBarRef.current?.getBoundingClientRect().height ?? 60;
        return href === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      };
      if (Math.abs(window.scrollY - Math.max(0, destination())) < 1) return;
      const cleanup = () => {
        window.removeEventListener('scrollend', alignTarget);
        window.removeEventListener('wheel', cleanup);
        window.removeEventListener('touchstart', cleanup);
        window.removeEventListener('keydown', cleanup);
        window.removeEventListener('popstate', cleanup);
        navigationCleanupRef.current = null;
      };
      const alignTarget = () => {
        cleanup();
        // Responsive assets can settle during a long jump. Align once after scrolling ends.
        window.scrollTo({ top: destination(), behavior: 'instant' });
      };
      window.addEventListener('scrollend', alignTarget, { once: true });
      window.addEventListener('wheel', cleanup, { passive: true });
      window.addEventListener('touchstart', cleanup, { passive: true });
      window.addEventListener('keydown', cleanup);
      window.addEventListener('popstate', cleanup);
      navigationCleanupRef.current = cleanup;
      window.scrollTo({
        top: destination(),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
  };

  return (
    <header
      onClick={handleSectionNavigation}
      className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${
        !isScrolled && !isInteriorPage
          ? 'bg-transparent border-b border-transparent shadow-none'
          : useLightSurface
          ? 'bg-[#FAF6EE]/92 backdrop-blur-md border-b border-[#C28B37]/25 shadow-[0_4px_20px_rgba(20,14,10,0.08)]'
          : 'bg-[#0C0907]/92 backdrop-blur-md border-b border-[#DFAF63]/20 shadow-[0_8px_32px_rgba(0,0,0,0.65)]'
      }`}
    >
      <div ref={headerBarRef} className="site-container flex items-center justify-between gap-4 sm:gap-6 py-2 sm:py-2.5">
        {/* Zone 1: Redesigned Luxury Barber Crest & Wordmark */}
        <BrandLogo theme={useLightSurface ? 'light' : 'dark'} href={isInteriorPage ? '/' : '#top'} />

        {/* Zone 2: Center Navigation Links */}
        <nav
          aria-label="Primary section navigation"
          className="hidden xl:flex items-center gap-7 lg:gap-9 text-[12.5px] font-medium tracking-[0.04em]"
        >
          {navigationLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 focus-ring ${
                  isActive
                    ? useLightSurface
                      ? 'text-[#B87314] font-semibold'
                      : 'text-[#E5B96F] font-semibold'
                    : useLightSurface
                    ? 'text-[#1A130E]/85 hover:text-[#B87314]'
                    : 'text-[#F7F1E8]/85 hover:text-[#E5B96F]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                      useLightSurface ? 'bg-[#B87314]' : 'bg-[#E5B96F]'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switcher (Light / Dark) + Book Now Pill CTA + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Interactive Light / Dark Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            title={isLight ? 'Switch to Dark Studio theme' : 'Switch to Warm Light theme'}
            className={`inline-flex items-center justify-center gap-1.5 w-9 h-9 lg:w-auto lg:px-3.5 rounded-full border text-xs font-medium tracking-[0.04em] transition-all cursor-pointer focus-ring ${
              useLightSurface
                ? 'border-[#C28B37]/50 bg-[#F2EAE0] text-[#1A130E] hover:bg-[#E6D9C6]'
                : 'border-[#DFAF63]/50 bg-[#120E0B]/60 text-[#F7F1E8] hover:border-[#E5B96F] hover:text-[#E5B96F]'
            }`}
          >
            {isLight ? (
              <>
                <Moon className={`w-4 h-4 shrink-0 ${useLightSurface ? 'text-[#9A6519]' : 'text-[#E5B96F]'}`} />
                <span className="hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className={`w-4 h-4 shrink-0 ${useLightSurface ? 'text-[#9A6519]' : 'text-[#E5B96F]'}`} />
                <span className="hidden lg:inline">Light</span>
              </>
            )}
          </button>

          <a
            href={BUSINESS_INFO.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden hidden sm:inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full border text-xs font-semibold tracking-[0.06em] transition-all group focus-ring ${
              useLightSurface
                ? 'border-[#B87314] bg-[#1A130E] text-[#FAF6EE] hover:bg-[#B87314] hover:text-[#0C0907] shadow-[0_4px_16px_rgba(26,19,14,0.15)]'
                : 'border-[#DFAF63]/60 bg-[#120E0B]/80 hover:bg-[#DFAF63] text-[#F7F1E8] hover:text-[#0C0907] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Calendar
              className={`w-3.5 h-3.5 transition-colors ${
                useLightSurface
                  ? 'text-[#E5B96F] group-hover:text-[#0C0907]'
                  : 'text-[#DFAF63] group-hover:text-[#0C0907]'
              }`}
            />
            <span>WhatsApp Booking</span>
            <ArrowRight
              className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all ${
                useLightSurface
                  ? 'text-[#E5B96F] group-hover:text-[#0C0907]'
                  : 'text-[#DFAF63] group-hover:text-[#0C0907]'
              }`}
            />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={handleToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors cursor-pointer focus-ring ${
              useLightSurface
                ? 'border-[#C28B37]/50 bg-[#F2EAE0] text-[#1A130E] hover:bg-[#E6D9C6]'
                : 'border-[#DFAF63]/50 bg-[#120E0B]/60 text-[#F7F1E8] hover:border-[#E5B96F] hover:text-[#E5B96F]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop & Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[var(--salon-header-h)] bg-black/60 backdrop-blur-xs z-[99] xl:hidden animate-fade-in"
          />
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile section navigation"
            className={`relative z-[100] xl:hidden max-h-[calc(100dvh-var(--salon-header-h))] overflow-y-auto border-b px-5 pt-3 pb-6 shadow-2xl transition-all ${
              useLightSurface
                ? 'bg-[#FAF6EE]/98 border-[#C28B37]/35 text-[#1A130E]'
                : 'bg-[#120E0B]/98 border-[#DFAF63]/40 text-[#F7F1E8]'
            }`}
          >
            <ul className="flex flex-col space-y-1">
              {navigationLinks.map((link, idx) => {
                const isActive = activeSection === link.href;
                return (
                  <li key={link.label}>
                    <a
                      ref={idx === 0 ? firstMobileLinkRef : undefined}
                      href={link.href}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between min-h-[44px] px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                        isActive
                          ? useLightSurface
                            ? 'bg-[#EAE0D0] text-[#B87314] font-semibold'
                            : 'bg-[#241A14] text-[#E5B96F] font-semibold'
                          : useLightSurface
                          ? 'text-[#1A130E] hover:bg-[#EFE6D5] hover:text-[#B87314]'
                          : 'text-[#F7F1E8] hover:bg-[#1E1612] hover:text-[#E5B96F]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="text-[#C28B37] text-xs font-mono">0{idx + 1}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 pt-3 border-t border-[#C28B37]/20 flex flex-col sm:flex-row gap-2.5">
              <a
                href={BUSINESS_INFO.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] bg-gradient-to-r from-[#E8C27A] to-[#C89643] text-[#0C0907] rounded-full transition-colors whitespace-nowrap focus-ring shadow-[0_4px_16px_rgba(200,150,67,0.35)]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book on WhatsApp</span>
              </a>
              <a
                href={BUSINESS_INFO.phoneHref}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] border rounded-full transition-colors whitespace-nowrap focus-ring ${
                  useLightSurface
                    ? 'border-[#1A130E]/40 text-[#1A130E] hover:border-[#B87314]'
                    : 'border-[#DFAF63]/60 text-[#F7F1E8] hover:border-[#E5B96F]'
                }`}
              >
                Call {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
