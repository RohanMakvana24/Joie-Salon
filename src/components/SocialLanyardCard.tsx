import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, RotateCw, Scissors } from 'lucide-react';
import type { SocialCardProfile } from '../lib/socialCardTextures';
import type { ThemeMode } from '../data/barbershopData';
import './SocialLanyardCard.css';

export function SocialLanyardCard({ profile, children }: {
  profile: SocialCardProfile;
  index: number;
  theme: ThemeMode;
  review?: { name: string; quote: string };
  children: ReactNode;
  isSelected: boolean;
  getStage: () => HTMLElement | null;
}) {
  const [back, setBack] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const grip = useRef<{ x: number; y: number; pointer: number } | null>(null);
  const reset = () => {
    grip.current = null;
    if (root.current) {
      root.current.style.setProperty('--card-swing', '0deg');
      root.current.style.setProperty('--card-shift', '0px');
      root.current.removeAttribute('data-dragging');
    }
  };
  return <div ref={root} className="social-lanyard" data-ready="true" data-face={back ? 'back' : 'front'} data-status="ready"
    onPointerDown={event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('a,button')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      grip.current = { x: event.clientX, y: event.clientY, pointer: event.pointerId };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = 'true';
    }}
    onPointerMove={event => {
      const start = grip.current;
      if (!start || start.pointer !== event.pointerId) return;
      const dx = event.clientX - start.x;
      event.currentTarget.style.setProperty('--card-swing', `${Math.max(-35, Math.min(35, -dx / 8))}deg`);
      event.currentTarget.style.setProperty('--card-shift', `${Math.max(-180, Math.min(180, dx / 2))}px`);
    }}
    onPointerUp={event => { if (grip.current?.pointer === event.pointerId) { reset(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); } }}
    onPointerCancel={reset} onLostPointerCapture={reset}>
    <div className="social-lanyard__swing">
      <div className="social-lanyard__strap" aria-hidden="true"><span>CC</span></div>
      <div className="social-lanyard__turn" style={{ '--card-turn': back ? '180deg' : '0deg' } as CSSProperties}>
        <div className="social-lanyard__front" inert={back} aria-hidden={back || undefined}>{children}</div>
        <div className="social-lanyard__back" inert={!back} aria-hidden={!back || undefined}>
          <Scissors size={32} strokeWidth={1.4} aria-hidden="true" />
          <span>CLASSIC CUT SALON</span><h3>Good cuts.<br />Better connections.</h3>
          <p>Find us on {profile.platform}.<br />{profile.handle}</p>
          <a href={profile.href} target="_blank" rel="noopener noreferrer">{profile.action}<ArrowUpRight size={16} /></a>
        </div>
      </div>
    </div>
    <div className="social-lanyard__controls">
      <button type="button" aria-label={`Turn ${profile.platform} card to ${back ? 'front' : 'back'}`} aria-pressed={back} onClick={() => setBack(value => !value)}><RotateCw size={13} aria-hidden="true" /><span>{back ? 'Front' : 'Turn card'}</span></button>
      <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.action} — Classic Cut Salon`}>{profile.action.replace(' on ', ' ')}<ArrowUpRight size={13} aria-hidden="true" /></a>
    </div>
  </div>;
}
