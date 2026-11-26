'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Crown,
  Flower2,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';
import './Footer.css';

interface FooterProps {
  theme?: ThemeMode;
  onOpenInspector?: (tab: 'layers' | 'tokens' | 'docs') => void;
}

type AmbiencePreset = 'champagne' | 'rose' | 'moonlight';
type ServiceFocusKey = 'hair' | 'skin' | 'bridal';

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterNavGroup {
  title: string;
  links: FooterLinkItem[];
}

const FOOTER_NAV_GROUPS: FooterNavGroup[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Signature Packages', href: '#packages' },
      { label: 'Our Bridals', href: '#bridals' },
      { label: 'Products', href: '#products' },
    ],
  },
  {
    title: 'Salon',
    links: [
      { label: 'Gallery', href: '#gallery' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Visit & Book', href: '#contact' },
      { label: 'Blog & Guides', href: '/blog' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'WhatsApp Booking', href: BUSINESS_INFO.bookingUrl, external: true },
      { label: BUSINESS_INFO.phoneDisplay, href: BUSINESS_INFO.phoneHref },
      { label: BUSINESS_INFO.instagramHandle, href: BUSINESS_INFO.instagramUrl, external: true },
      { label: 'Google Maps', href: BUSINESS_INFO.googleMapsUrl, external: true },
    ],
  },
];

const SERVICE_FOCUS_OPTIONS: {
  id: ServiceFocusKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  ctaLabel: string;
  whatsappText: string;
}[] = [
  {
    id: 'hair',
    label: 'Hair',
    icon: Scissors,
    summary: 'Precision cuts, bouncy blow-dries, keratin smoothing & rich glossy color.',
    ctaLabel: 'Book Hair Session on WhatsApp',
    whatsappText: 'Hi Joie Salon, I would like to book a Haircut & Styling appointment.',
  },
  {
    id: 'skin',
    label: 'Skin',
    icon: Flower2,
    summary: 'Hydra glow facials, de-tan rituals & calming barrier-repair skincare.',
    ctaLabel: 'Book Skin Ritual on WhatsApp',
    whatsappText: 'Hi Joie Salon, I would like to book a Skin & Glow Facial appointment.',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    icon: Crown,
    summary: 'Custom HD & airbrush bridal styling, trial sessions & draping care.',
    ctaLabel: 'Book Bridal Trial on WhatsApp',
    whatsappText: 'Hi Joie Salon, I would like to enquire about a Bridal Studio consultation.',
  },
];

const AMBIENCE_PRESETS: {
  id: AmbiencePreset;
  label: string;
  swatch: string;
  ribbonDark: [string, string, string];
  ribbonLight: [string, string, string];
  moteColor: string;
  spotlightDark: string;
  spotlightLight: string;
}[] = [
  {
    id: 'champagne',
    label: 'Champagne',
    swatch: '#E5B96F',
    ribbonDark: ['rgba(229, 185, 111, 0.34)', 'rgba(217, 163, 75, 0.22)', 'rgba(255, 232, 188, 0.16)'],
    ribbonLight: ['rgba(166, 115, 40, 0.22)', 'rgba(202, 146, 61, 0.16)', 'rgba(35, 44, 59, 0.1)'],
    moteColor: '229, 185, 111',
    spotlightDark: 'rgba(229, 185, 111, 0.14)',
    spotlightLight: 'rgba(166, 115, 40, 0.1)',
  },
  {
    id: 'rose',
    label: 'Rose Silk',
    swatch: '#E88FA8',
    ribbonDark: ['rgba(232, 143, 168, 0.3)', 'rgba(229, 185, 111, 0.2)', 'rgba(248, 198, 212, 0.14)'],
    ribbonLight: ['rgba(190, 92, 124, 0.2)', 'rgba(166, 115, 40, 0.14)', 'rgba(232, 143, 168, 0.14)'],
    moteColor: '232, 143, 168',
    spotlightDark: 'rgba(232, 143, 168, 0.14)',
    spotlightLight: 'rgba(190, 92, 124, 0.1)',
  },
  {
    id: 'moonlight',
    label: 'Moonlight',
    swatch: '#94A3B8',
    ribbonDark: ['rgba(148, 163, 184, 0.32)', 'rgba(226, 232, 240, 0.18)', 'rgba(229, 185, 111, 0.14)'],
    ribbonLight: ['rgba(51, 65, 85, 0.2)', 'rgba(100, 116, 139, 0.16)', 'rgba(166, 115, 40, 0.1)'],
    moteColor: '203, 213, 225',
    spotlightDark: 'rgba(148, 163, 184, 0.15)',
    spotlightLight: 'rgba(51, 65, 85, 0.1)',
  },
];

const WORDMARK_TOKENS = ['J', 'O', 'I', 'E', ' ', 'S', 'A', 'L', 'O', 'N'];

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
}

export const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const [ambience, setAmbience] = useState<AmbiencePreset>('rose');
  const [serviceFocus, setServiceFocus] = useState<ServiceFocusKey>('hair');
  const [copied, setCopied] = useState(false);

  // Kinetic wordmark pointer proximity & ripple state
  const [pointerNormX, setPointerNormX] = useState<number | null>(null);
  const [rippleOrigin, setRippleOrigin] = useState<number | null>(null);
  const [rippleTick, setRippleTick] = useState(0);

  // Smooth spring values for footer spotlight
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(45);
  const smoothSpotX = useSpring(spotX, { stiffness: 140, damping: 24 });
  const smoothSpotY = useSpring(spotY, { stiffness: 140, damping: 24 });

  // 3D Concierge card spring tilt
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const cardGlareX = useMotionValue(50);
  const cardGlareY = useMotionValue(50);
  const smoothCardRx = useSpring(cardRotateX, { stiffness: 220, damping: 24 });
  const smoothCardRy = useSpring(cardRotateY, { stiffness: 220, damping: 24 });
  const cardGlareBg = useMotionTemplate`radial-gradient(circle at ${cardGlareX}% ${cardGlareY}%, rgba(255, 245, 224, 0.16), transparent 62%)`;

  const currentPreset = useMemo(
    () => AMBIENCE_PRESETS.find((p) => p.id === ambience) ?? AMBIENCE_PRESETS[0],
    [ambience]
  );

  const spotlightTint = theme === 'light' ? currentPreset.spotlightLight : currentPreset.spotlightDark;
  const spotlightBackground = useMotionTemplate`radial-gradient(580px circle at ${smoothSpotX}% ${smoothSpotY}%, ${spotlightTint}, transparent 72%)`;

  const activeService = useMemo(
    () => SERVICE_FOCUS_OPTIONS.find((s) => s.id === serviceFocus) ?? SERVICE_FOCUS_OPTIONS[0],
    [serviceFocus]
  );

  const whatsappHref = useMemo(
    () => `${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent(activeService.whatsappText)}`,
    [activeService.whatsappText]
  );

  // Pointer reference for the interactive Canvas 2D wave simulation
  const canvasPointerRef = useRef<{ x: number; y: number; active: boolean; energy: number }>({
    x: 0.5,
    y: 0.5,
    active: false,
    energy: 0,
  });

  // Pause canvas loop cleanly when off-screen
  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.04 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Real interactive Canvas 2D fluid silk wave + bokeh particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    const motes: Mote[] = Array.from({ length: 24 }, (_, idx) => ({
      x: ((idx * 73) % 100) / 100,
      y: ((idx * 41) % 100) / 100,
      vx: (Math.sin(idx) * 0.00018),
      vy: -(0.00018 + (idx % 5) * 0.00005),
      r: 1.4 + (idx % 4) * 0.85,
      alpha: 0.25 + (idx % 5) * 0.1,
      phase: idx * 0.8,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ribbonColors = theme === 'light' ? currentPreset.ribbonLight : currentPreset.ribbonDark;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const ptr = canvasPointerRef.current;
      ptr.energy *= 0.94;
      const mx = ptr.x * width;
      const my = ptr.y * height;

      // Draw 3 interactive silk ribbon strata
      ribbonColors.forEach((strokeColor, layerIdx) => {
        const baseY = height * (0.48 + layerIdx * 0.14);
        const amp = 18 + layerIdx * 9;
        const freq = 0.0042 - layerIdx * 0.0007;
        const speed = 0.9 + layerIdx * 0.25;

        ctx.beginPath();
        const step = Math.max(18, Math.floor(width / 46));
        for (let x = -step; x <= width + step; x += step) {
          const wave =
            Math.sin(x * freq + time * speed + layerIdx * 1.4) * amp +
            Math.cos(x * freq * 0.55 - time * 0.65) * (amp * 0.42);

          // Interactive cursor magnetic wave deflection
          let deflect = 0;
          if (ptr.active || ptr.energy > 0.02) {
            const dx = x - mx;
            const dy = baseY - my;
            const distSq = dx * dx + dy * dy;
            const radius = 260;
            if (distSq < radius * radius) {
              const factor = Math.pow(1 - Math.sqrt(distSq) / radius, 2);
              deflect = Math.sin(dx * 0.018 - time * 3) * 34 * factor * (0.65 + ptr.energy);
            }
          }

          const y = baseY + wave + deflect;
          if (x === -step) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = layerIdx === 0 ? 1.8 : 1.25;
        ctx.stroke();

        // Soft ribbon under-glow fill
        ctx.lineTo(width + step, height);
        ctx.lineTo(-step, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, baseY - 40, 0, height);
        grad.addColorStop(0, strokeColor.replace(/[\d.]+\)$/, '0.07)'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw floating bokeh dust motes
      for (const m of motes) {
        if (!prefersReducedMotion) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -0.05) m.y = 1.05;
          if (m.x < -0.05) m.x = 1.05;
          if (m.x > 1.05) m.x = -0.05;
        }

        let px = m.x * width;
        let py = m.y * height;

        // Subtle pointer repulsion / swirl
        if (ptr.active && !prefersReducedMotion) {
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 170 && dist > 1) {
            const push = (1 - dist / 170) * 18;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }

        const pulse = 0.72 + Math.sin(time * 1.8 + m.phase) * 0.28;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${currentPreset.moteColor}, ${(m.alpha * pulse).toFixed(3)})`;
        ctx.fill();
      }
    };

    const tick = () => {
      time += 0.016;
      drawFrame();
      if (inView && !prefersReducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    drawFrame();
    if (inView && !prefersReducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [currentPreset, inView, prefersReducedMotion, theme]);

  const handleFooterPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = footerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      spotX.set(nx * 100);
      spotY.set(ny * 100);
      canvasPointerRef.current = { x: nx, y: ny, active: true, energy: 1 };
    },
    [spotX, spotY]
  );

  const handleFooterPointerLeave = useCallback(() => {
    canvasPointerRef.current.active = false;
  }, []);

  const handleCardPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cardRotateX.set((0.5 - py) * 9);
      cardRotateY.set((px - 0.5) * 11);
      cardGlareX.set(px * 100);
      cardGlareY.set(py * 100);
    },
    [cardGlareX, cardGlareY, cardRotateX, cardRotateY, prefersReducedMotion]
  );

  const handleCardPointerLeave = useCallback(() => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  }, [cardRotateX, cardRotateY]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.fullAddress);
    } catch {
      // Clipboard fallback when iframe restricts permissions
      const area = document.createElement('textarea');
      area.value = BUSINESS_INFO.fullAddress;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(area);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }, []);

  const handleWordmarkMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = wordmarkRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPointerNormX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    },
    [prefersReducedMotion]
  );

  const rippleTimerRef = useRef<number | null>(null);

  const handleLetterClick = useCallback((index: number) => {
    setRippleOrigin(index);
    setRippleTick((n) => n + 1);
    if (rippleTimerRef.current) {
      window.clearTimeout(rippleTimerRef.current);
    }
    rippleTimerRef.current = window.setTimeout(() => {
      setRippleOrigin(null);
      rippleTimerRef.current = null;
    }, 820);
  }, []);

  useEffect(() => {
    return () => {
      if (rippleTimerRef.current) {
        window.clearTimeout(rippleTimerRef.current);
      }
    };
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion]);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="js-footer"
      data-ambience={ambience}
      onPointerMove={handleFooterPointerMove}
      onPointerLeave={handleFooterPointerLeave}
      aria-label="Joie Salon Footer"
    >
      <canvas ref={canvasRef} className="js-footer__canvas" aria-hidden="true" />
      <motion.div
        className="js-footer__spotlight"
        style={prefersReducedMotion ? undefined : { background: spotlightBackground }}
        aria-hidden="true"
      />

      <div className="js-footer__container">
        <div className="js-footer__grid">
          {/* Column 1: Brand Identity, Quick Copy Address & Socials */}
          <div>
            <BrandLogo size="lg" theme={theme} />
            <p className="js-footer__tagline">
              Hair, skincare &amp; bridal studio crafted exclusively for women at Jyoti Nagar Main Road, Rajkot.
            </p>

            <div className="js-footer__address-wrap">
              <button
                type="button"
                className="js-footer__copy-btn"
                data-copied={copied}
                onClick={handleCopyAddress}
                aria-label="Copy salon address to clipboard"
              >
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[26ch]">
                  {copied ? 'Address copied to clipboard' : 'Jyoti Nagar, Behind Crystal Mall'}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="inline-flex"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="inline-flex opacity-70"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <div className="js-footer__socials">
              <motion.a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Joie Salon on Instagram"
                className="js-footer__social-link"
                whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href={BUSINESS_INFO.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book on WhatsApp"
                className="js-footer__social-link"
                whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href={BUSINESS_INFO.phoneHref}
                aria-label={`Call ${BUSINESS_INFO.phoneDisplay}`}
                className="js-footer__social-link"
                whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Joie Salon in Google Maps"
                className="js-footer__social-link"
                whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </motion.a>
            </div>
          </div>

          {/* Column 2: Clean Editorial Navigation Columns */}
          <nav className="js-footer__nav" aria-label="Footer navigation">
            {FOOTER_NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="js-footer__col-title">{group.title}</p>
                <ul className="js-footer__link-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="js-footer__link"
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          className="js-footer__link-arrow w-3.5 h-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Column 3: Interactive 3D Tilt Quick Concierge Card */}
          <div className="js-footer__card-perspective">
            <motion.div
              className="js-footer__card"
              style={
                prefersReducedMotion
                  ? undefined
                  : { rotateX: smoothCardRx, rotateY: smoothCardRy }
              }
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
            >
              <motion.div
                className="js-footer__card-glare"
                style={prefersReducedMotion ? undefined : { background: cardGlareBg }}
                aria-hidden="true"
              />

              <div className="js-footer__card-head">
                <h3 className="js-footer__card-title">Quick Concierge</h3>
                <span className="js-footer__hours">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  10 AM – 8 PM
                </span>
              </div>

              <div className="js-footer__tabs" role="tablist" aria-label="Choose a service category">
                {SERVICE_FOCUS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = serviceFocus === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className="js-footer__tab"
                      onClick={() => setServiceFocus(option.id)}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="footer-service-pill"
                          className="js-footer__tab-indicator"
                          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeService.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="js-footer__service-summary"
                >
                  {activeService.summary}
                </motion.p>
              </AnimatePresence>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="js-footer__cta"
              >
                <span>{activeService.ctaLabel}</span>
                <ArrowUpRight className="js-footer__cta-icon w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Control Strip: Copyright, Live Canvas Ambience Switcher & Back-to-Top */}
        <div className="js-footer__bar">
          <p className="js-footer__meta">
            <span>© {year} Joie Salon · Rajkot, Gujarat</span>
            <span aria-hidden="true">·</span>
            <span>Open Mon–Sun</span>
          </p>

          <div className="js-footer__ambience" role="group" aria-label="Footer lighting ambience">
            {AMBIENCE_PRESETS.map((preset) => {
              const active = ambience === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={active}
                  className="js-footer__ambience-btn"
                  onClick={() => setAmbience(preset.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="footer-ambience-bg"
                      className="js-footer__ambience-bg"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span
                    className="js-footer__swatch"
                    style={{ backgroundColor: preset.swatch }}
                    aria-hidden="true"
                  />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="js-footer__top-btn"
            onClick={handleBackToTop}
          >
            <span>Back to top</span>
            <ArrowUp className="js-footer__top-arrow w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Kinetic Interactive 3D Wordmark Stage */}
        <div
          ref={wordmarkRef}
          className="js-footer__stage"
          onPointerMove={handleWordmarkMove}
          onPointerLeave={() => setPointerNormX(null)}
        >
          <div className="js-footer__wordmark" role="group" aria-label="Interactive Joie Salon wordmark">
            {WORDMARK_TOKENS.map((char, idx) => {
              if (char === ' ') {
                return <span key={`space-${idx}`} className="js-footer__word-gap" aria-hidden="true" />;
              }

              const tokenNorm = idx / (WORDMARK_TOKENS.length - 1);
              const dist = pointerNormX === null ? 1 : Math.abs(pointerNormX - tokenNorm);
              const influence = pointerNormX === null ? 0 : Math.max(0, 1 - dist * 3.4);
              const liftY = -influence * 22;
              const tiltX = influence * 14;
              const tiltY = pointerNormX === null ? 0 : (tokenNorm - pointerNormX) * 26 * influence;
              const scale = 1 + influence * 0.08;

              const isRippling = rippleOrigin !== null;
              const rippleDistance = isRippling ? Math.abs(idx - rippleOrigin) : 0;

              return (
                <motion.button
                  key={`${char}-${idx}`}
                  type="button"
                  data-lit={influence > 0.45 || (isRippling && rippleDistance <= 2)}
                  aria-label={`Animate letter ${char}`}
                  className="js-footer__letter-btn"
                  onClick={() => handleLetterClick(idx)}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : isRippling
                        ? {
                            y: liftY - Math.max(0, 26 - rippleDistance * 4.5),
                            rotateX: tiltX + 12,
                            rotateY: tiltY,
                            scale: scale * (1 + Math.max(0, 0.1 - rippleDistance * 0.02)),
                          }
                        : {
                            y: liftY,
                            rotateX: tiltX,
                            rotateY: tiltY,
                            scale,
                          }
                  }
                  transition={
                    isRippling
                      ? {
                          type: 'spring',
                          stiffness: 380,
                          damping: 18,
                          delay: rippleDistance * 0.04,
                        }
                      : {
                          type: 'spring',
                          stiffness: 320,
                          damping: 22,
                        }
                  }
                  data-ripple={rippleTick}
                >
                  {char}
                </motion.button>
              );
            })}
          </div>
          <p className="js-footer__stage-hint">
            Move across or tap any letter for a ripple wave
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
