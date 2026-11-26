'use client';

import React from 'react';
import Pricing6 from './ui/components-pricings-pricing-6';
import { BRIDAL_EVENT_PLANS, SALON_CARE_PLANS } from '../data/salonPackages';
import { useTheme } from '../hooks/useActivity';

export const GroomingPackagesSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      className={`relative w-full py-16 md:py-24 border-b transition-colors duration-300 ${
        isLight
          ? 'bg-[#F5F6F7] border-[#232C3B]/14'
          : 'bg-[#0C0907] border-white/10'
      }`}
    >
      <div className="site-container mx-auto max-w-[1200px]">
        <Pricing6
          eyebrow="Curated Experiences · Rajkot"
          title="Signature Packages"
          subtitle="Curated hair, skin, nails, and bridal sessions tailored for everyday care, festive nights, and weddings."
          individualsLabel="Salon & Hair"
          teamsLabel="Bridal & Events"
          defaultTab="individuals"
          individualPlans={SALON_CARE_PLANS}
          teamsPlans={BRIDAL_EVENT_PLANS}
        />
      </div>
    </section>
  );
};
