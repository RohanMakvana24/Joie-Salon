'use client';

import { useEffect, useState } from 'react';
import { Header } from './Header';
import { getNextThemeMode, type ThemeMode } from '../data/barbershopData';

export function BlogChrome({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('relook-theme');
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch { /* Keep the default when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('relook-theme', theme); } catch { /* Storage may be unavailable. */ }
  }, [theme]);

  return (
    <div className="journal" data-journal-theme={theme}>
      <a href="#journal-main" className="journal-skip">Skip to content</a>
      <Header theme={theme} onToggleTheme={() => setTheme(getNextThemeMode)} />
      {children}
    </div>
  );
}
