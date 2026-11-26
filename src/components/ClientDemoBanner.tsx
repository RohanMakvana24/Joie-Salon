'use client';

import React, { useState, useEffect } from 'react';
import { Scissors, Check, X, ShieldCheck } from 'lucide-react';

export const ClientDemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Show banner after short delay on mount
    const timer = setTimeout(() => {
      const isClosed = sessionStorage.getItem('cc-demo-banner-closed');
      if (!isClosed) setDismissed(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('cc-demo-banner-closed', 'true');
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Demo notice for salon owner"
      className="fixed bottom-4 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md bg-[#16110D]/95 text-[#F7F1E8] border border-[#DFAF63]/50 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#E5B96F]">
          <div className="w-7 h-7 rounded-lg bg-[#DFAF63]/20 flex items-center justify-center shrink-0">
            <Scissors size={16} />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider font-bold">
            Demo Preview Mode
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notice"
          className="text-[#A69786] hover:text-white p-1 transition-colors cursor-pointer rounded-lg hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[#D2C5B6]">
        <strong>Joie Salon Demo:</strong> The layout, speed, and local Rajkot SEO are fully optimized. All images, services, and team details will be updated with your original salon photos and official rates upon your approval!
      </p>

      <div className="mt-3 pt-2.5 border-t border-[#DFAF63]/20 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] text-[#25D366] font-medium">
          <Check size={13} />
          100% Ready for WhatsApp Bookings
        </span>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[11px] font-bold uppercase tracking-wider text-[#E5B96F] hover:underline cursor-pointer"
        >
          Got it
        </button>
      </div>
    </aside>
  );
};
