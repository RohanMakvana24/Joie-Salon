'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export const REVEAL_KEYFRAMES = `
@keyframes receiptRevealUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}

export function revealClass(shown: boolean): string {
  return shown
    ? 'opacity-100 transition-all duration-700 ease-out'
    : 'opacity-0 translate-y-4 transition-all duration-700 ease-out';
}

export function revealDelay(shown: boolean, position: number): CSSProperties {
  return {
    transitionDelay: shown ? `${position * 110}ms` : '0ms',
  };
}
