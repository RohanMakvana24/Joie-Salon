'use client';

import React from 'react';
import { Scissors, UserCheck, MapPin } from 'lucide-react';
import { useTheme } from '../hooks/useActivity';

const PILLARS = [
  {
    icon: Scissors,
    title: 'A look that fits your day',
    detail:
      'A soft layer trim, glossy blow-dry, or full bridal transformation. Tell us what you have in mind when you book.',
  },
  {
    icon: UserCheck,
    title: 'Bring your lookbook photo',
    detail:
      'Share an inspiration photo you love. Talk through hair length, balayage tone, skin comfort, and how you style daily.',
  },
  {
    icon: MapPin,
    title: 'Behind Crystal Mall, Rajkot',
    detail:
      'Jyoti Nagar Main Road, Near Masoom School, Ghanshyam Nagar. Get directions below or message us before your visit.',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="experience"
      aria-labelledby="why-choose-heading"
      className={`relative py-20 md:py-28 border-b overflow-hidden transition-colors duration-300 ${
        isLight ? 'border-[#232C3B]/12' : 'border-white/10'
      }`}
      style={{
        backgroundColor: isLight ? '#FAF4E8' : '#0B0806',
      }}
    >
      <div className="site-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <span className={`h-[1px] w-6 ${isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'}`} />
            <p
              className={`font-mono text-xs uppercase tracking-[0.26em] ${
                isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'
              }`}
            >
              THE JOIE SALON STANDARD
            </p>
            <span className={`h-[1px] w-6 ${isLight ? 'bg-[#232C3B]' : 'bg-[#CBD5E1]'}`} />
          </div>

          <h2
            id="why-choose-heading"
            className={`font-display text-4xl sm:text-5xl md:text-[3.5rem] tracking-[-0.01em] leading-tight ${
              isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
            }`}
          >
            Luxury care.{' '}
            <span className={isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'}>
              Close to home.
            </span>
          </h2>

          <p
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
            }`}
          >
            Your neighbourhood ladies sanctuary for precision haircuts, glowing skin rituals, and bridal artistry.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`relative flex flex-col rounded-xl p-6 sm:p-7 border transition-colors duration-300 group ${
                  isLight
                    ? 'bg-white border-[#232C3B]/12 shadow-sm hover:shadow-md hover:border-[#232C3B]/40'
                    : 'bg-[#140F0C] border-white/10 hover:border-white/25 hover:bg-[#1A1410]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-10 h-10 flex items-center ${isLight ? 'text-[#232C3B]' : 'text-[#CBD5E1]'}`}>
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3
                    className={`font-display text-xl font-bold leading-tight ${
                      isLight ? 'text-[#232C3B]' : 'text-[#F5F6F7]'
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isLight ? 'text-[#4B5563]' : 'text-[#B8A897]'
                    }`}
                  >
                    {pillar.detail}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
