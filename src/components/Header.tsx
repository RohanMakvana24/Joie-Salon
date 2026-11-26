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
  { label: 'Bridal', href: '#bridals' },
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
  // Keep the default 3-zone navbar seamlessly blended (transparent) over the hero before scrolling,
  // adapting its foreground ink directly to the active Light or Dark theme.
  const useLightSurface = isLight;

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
          ? useLightSurface
            ? 'bg-gradient-to-b from-[#F5F6F7]/85 via-[#F5F6F7]/35 to-transparent border-b border-transparent shadow-none'
            : 'bg-gradient-to-b from-[#0C0907]/85 via-[#0C0907]/35 to-transparent border-b border-transparent shadow-none'
          : useLightSurface
          ? 'bg-[#F5F6F7]/94 backdrop-blur-md border-b border-[#232C3B]/15 shadow-[0_4px_20px_rgba(35,44,59,0.08)]'
          : 'bg-[#0C0907]/92 backdrop-blur-md border-b border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.65)]'
      }`}
    >
      <div
        ref={headerBarRef}
        className={`site-container flex items-center justify-between gap-4 sm:gap-6 transition-[padding] duration-300 ${
          !isScrolled && !isInteriorPage ? 'py-3.5 sm:py-4' : 'py-2 sm:py-2.5'
        }`}
      >
        {/* Zone 1: Default Left-Aligned Joie Salon Brand Wordmark */}
        <BrandLogo
          theme={useLightSurface ? 'light' : 'dark'}
          href={isInteriorPage ? '/' : '#top'}
          className="translate-y-[1px]"
        />

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
                      ? 'text-[#232C3B] font-semibold'
                      : 'text-[#F5F6F7] font-semibold'
                    : useLightSurface
                    ? 'text-[#232C3B]/75 hover:text-[#232C3B]'
                    : 'text-[#F5F6F7]/75 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                      useLightSurface ? 'bg-[#232C3B]' : 'bg-[#F5F6F7]'
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
                ? 'border-[#232C3B]/25 bg-[#EAEDF0] text-[#232C3B] hover:bg-[#DFE4EA]'
                : 'border-white/25 bg-[#181B22]/75 text-[#F5F6F7] hover:border-white/50 hover:bg-[#232C3B]'
            }`}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 shrink-0 text-[#232C3B]" />
                <span className="hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 shrink-0 text-[#F5F6F7]" />
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
                ? 'border-[#232C3B] bg-[#232C3B] text-[#F8F6F2] hover:bg-[#161C26] shadow-[0_4px_16px_rgba(35,44,59,0.18)]'
                : 'border-white/25 bg-[#232C3B] hover:bg-[#2F3B4F] text-[#F8F6F2] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Calendar className="w-3.5 h-3.5 text-[#F8F6F2]/90 transition-colors" />
            <span>WhatsApp Booking</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F8F6F2]/90 group-hover:translate-x-0.5 transition-all" />
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
                ? 'border-[#232C3B]/25 bg-[#EAEDF0] text-[#232C3B] hover:bg-[#DFE4EA]'
                : 'border-white/25 bg-[#181B22]/75 text-[#F5F6F7] hover:border-white/50 hover:bg-[#232C3B]'
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
                ? 'bg-[#F5F6F7]/98 border-[#232C3B]/15 text-[#232C3B]'
                : 'bg-[#12151C]/98 border-white/15 text-[#F5F6F7]'
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
                            ? 'bg-[#232C3B]/10 text-[#232C3B] font-semibold'
                            : 'bg-[#232C3B] text-[#F5F6F7] font-semibold'
                          : useLightSurface
                          ? 'text-[#232C3B] hover:bg-[#232C3B]/6'
                          : 'text-[#F5F6F7] hover:bg-white/8'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="opacity-55 text-xs font-mono">0{idx + 1}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 pt-3 border-t border-current/15 flex flex-col sm:flex-row gap-2.5">
              <a
                href={BUSINESS_INFO.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] bg-[#232C3B] hover:bg-[#161C26] text-[#F8F6F2] border border-white/20 rounded-full transition-colors whitespace-nowrap focus-ring shadow-[0_4px_16px_rgba(35,44,59,0.28)]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book on WhatsApp</span>
              </a>
              <a
                href={BUSINESS_INFO.phoneHref}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] border rounded-full transition-colors whitespace-nowrap focus-ring ${
                  useLightSurface
                    ? 'border-[#232C3B]/35 text-[#232C3B] hover:border-[#232C3B]'
                    : 'border-white/30 text-[#F5F6F7] hover:border-white/60'
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
