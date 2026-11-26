'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, RotateCw, Scissors } from 'lucide-react';
import Lanyard from './ui/Lanyard';
import { createSocialCardTextures, type SocialCardProfile } from '../lib/socialCardTextures';
import type { ThemeMode } from '../data/barbershopData';
import './SocialLanyardCard.css';

const PLATFORM_ICON_SVGS: Record<string, string> = {
  instagram:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#DEC094" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
  facebook:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z"/></svg>',
  google:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.31 0 3.26 2.69 1.29 6.61l3.67 2.85C5.83 6.86 8.67 5 12 5Z"/><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.71-4.94 3.71-8.7Z"/><path fill="#FBBC05" d="M4.96 14.54A7.2 7.2 0 0 1 4.58 12c0-.88.15-1.74.38-2.54L1.29 6.61A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.29 5.39l3.67-2.85Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.33 0-6.17-1.86-7.04-4.46l-3.67 2.85C3.26 21.31 7.31 24 12 24Z"/></svg>',
  youtube:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E52D27"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>',
};

export function SocialLanyardCard({
  profile,
  index,
  theme,
  review,
  children,
  getStage,
}: {
  profile: SocialCardProfile;
  index: number;
  theme: ThemeMode;
  review?: { name: string; quote: string };
  children: ReactNode;
  isSelected: boolean;
  getStage: () => HTMLElement | null;
}) {
  const [back, setBack] = useState(false);
  const [flipSignal, setFlipSignal] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [textures, setTextures] = useState<{
    front: HTMLCanvasElement;
    back: HTMLCanvasElement;
    strap: HTMLCanvasElement;
  } | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const actionLinkRef = useRef<HTMLAnchorElement>(null);
  const grip = useRef<{ x: number; y: number; pointer: number } | null>(null);

  const reviewName = review?.name;
  const reviewQuote = review?.quote;

  useEffect(() => {
    let cancelled = false;
    const iconSvg = PLATFORM_ICON_SVGS[profile.id] ?? PLATFORM_ICON_SVGS.instagram;
    createSocialCardTextures(
      profile,
      index,
      theme,
      iconSvg,
      reviewName && reviewQuote ? { name: reviewName, quote: reviewQuote } : undefined
    )
      .then((next) => {
        if (!cancelled) setTextures(next);
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback');
      });

    return () => {
      cancelled = true;
    };
  }, [profile, index, theme, reviewName, reviewQuote]);

  const handleReady = useCallback(() => setStatus('ready'), []);
  const handleError = useCallback(() => setStatus('fallback'), []);
  const handleFlip = useCallback((isBack: boolean) => setBack(isBack), []);
  const handleCardAction = useCallback(() => {
    actionLinkRef.current?.click();
  }, []);

  const handleTurnClick = () => {
    if (status === 'ready') {
      setFlipSignal((count) => count + 1);
    } else {
      setBack((value) => !value);
    }
  };

  const resetFallbackSwing = () => {
    grip.current = null;
    if (root.current) {
      root.current.style.setProperty('--card-swing', '0deg');
      root.current.style.setProperty('--card-shift', '0px');
      root.current.removeAttribute('data-dragging');
    }
  };

  const isDarkFace = profile.id === 'instagram' || theme === 'dark';

  return (
    <div
      ref={root}
      className="social-lanyard"
      data-ready={status === 'ready' ? 'true' : 'false'}
      data-face={back ? 'back' : 'front'}
      data-status={status}
    >
      <a
        ref={actionLinkRef}
        href={profile.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {profile.action}
      </a>

      <div className="social-lanyard__rail-pin" aria-hidden="true">
        <i />
      </div>

      {status !== 'fallback' && textures && (
        <div className="social-lanyard__canvas">
          <Lanyard
            frontImage={textures.front}
            backImage={textures.back}
            strapImage={textures.strap}
            cardColor={isDarkFace ? '#1C1612' : '#FFFDF8'}
            strapColor="#1E1712"
            strapWidth={0.72}
            strapLength={0.25}
            anchorInset={0.014}
            size={0.68}
            cornerRadius={0.32}
            finish="glossy"
            metal="gold"
            gravity={1}
            damping={0.48}
            elasticity={0.55}
            breeze={0.42}
            interactive={true}
            touchScroll={true}
            intro={true}
            flipSignal={flipSignal}
            getStage={getStage}
            onReady={handleReady}
            onError={handleError}
            onFlip={handleFlip}
            onAction={handleCardAction}
          />
        </div>
      )}

      <div
        className="social-lanyard__fallback"
        aria-hidden={status === 'ready' || undefined}
        onPointerDown={(event) => {
          if (status === 'ready') return;
          if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('a,button')) return;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          grip.current = { x: event.clientX, y: event.clientY, pointer: event.pointerId };
          root.current?.setPointerCapture(event.pointerId);
          if (root.current) root.current.dataset.dragging = 'true';
        }}
        onPointerMove={(event) => {
          const start = grip.current;
          if (!start || start.pointer !== event.pointerId || !root.current) return;
          const dx = event.clientX - start.x;
          root.current.style.setProperty('--card-swing', `${Math.max(-35, Math.min(35, -dx / 8))}deg`);
          root.current.style.setProperty('--card-shift', `${Math.max(-180, Math.min(180, dx / 2))}px`);
        }}
        onPointerUp={(event) => {
          if (grip.current?.pointer === event.pointerId) {
            resetFallbackSwing();
            if (root.current?.hasPointerCapture(event.pointerId)) {
              root.current.releasePointerCapture(event.pointerId);
            }
          }
        }}
        onPointerCancel={resetFallbackSwing}
        onLostPointerCapture={resetFallbackSwing}
      >
        <div className="social-lanyard__swing">
          <div className="social-lanyard__strap" aria-hidden="true">
            <span>JOIE</span>
          </div>
          <div className="social-lanyard__turn" style={{ '--card-turn': back ? '180deg' : '0deg' } as CSSProperties}>
            <div className="social-lanyard__front" inert={back || status === 'ready'} aria-hidden={back || status === 'ready' || undefined}>
              {children}
            </div>
            <div className="social-lanyard__back" inert={!back || status === 'ready'} aria-hidden={!back || status === 'ready' || undefined}>
              <Scissors size={32} strokeWidth={1.4} aria-hidden="true" />
              <span>JOIE SALON</span>
              <h3>
                Good style.
                <br />
                Better company.
              </h3>
              <p>
                Find us on {profile.platform}.
                <br />
                {profile.handle}
              </p>
              <a href={profile.href} target="_blank" rel="noopener noreferrer">
                {profile.action}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="social-lanyard__controls">
        <button
          type="button"
          aria-label={`Turn ${profile.platform} card to ${back ? 'front' : 'back'}`}
          aria-pressed={back}
          onClick={handleTurnClick}
        >
          <RotateCw size={13} aria-hidden="true" />
          <span>{back ? 'Front' : 'Turn card'}</span>
        </button>
        <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.action} — Joie Salon`}>
          {profile.action.replace(' on ', ' ')}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
