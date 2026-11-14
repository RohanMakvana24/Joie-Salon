'use client';

import React from 'react';
import { Scissors, UserCheck, MapPin } from 'lucide-react';
import { useTheme } from '../hooks/useActivity';

const PILLARS = [
  {
    icon: Scissors,
    title: 'A cut that fits your day',
    detail:
      'A regular trim, a shorter fade or a new style. Tell us what you have in mind when you book.',
  },
  {
    icon: UserCheck,
    title: 'Bring your reference photo',
    detail:
      'Share a photo of the look you like. Talk through the length, beard shape and how you usually style your hair.',
  },
  {
    icon: MapPin,
    title: 'Find us on Pedak Road',
    detail:
      'Opposite Umiya R.O. at Pedak Cross Road, Arya Nagar. Get directions below or message us before your visit.',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="experience"
      aria-labelledby="why-choose-heading"
      className="relative py-20 md:py-28 border-b border-[#DFAF63]/15 overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#FAF4E8' : '#0B0806',
      }}
    >
      <div className="site-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#E5B96F]">
              THE CLASSIC CUT STANDARD
            </p>
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
          </div>

          <h2
            id="why-choose-heading"
            className={`font-display text-4xl sm:text-5xl md:text-[3.5rem] tracking-[-0.01em] leading-tight ${
              isLight ? 'text-[#1A130E]' : 'text-[#F7F1E8]'
            }`}
          >
            A good cut.{' '}
            <span className="bg-gradient-to-r from-[#FFF2C6] via-[#E5B96F] to-[#C28B37] bg-clip-text text-transparent">
              Close to home.
            </span>
          </h2>

          <p
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-[#6A5040]' : 'text-[#C9B8A6]'
            }`}
          >
            Your neighbourhood salon for haircuts, beard styling and a fresh start to the week.
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
                    ? 'bg-white border-[#E7DACB] shadow-sm hover:shadow-md hover:border-[#DFAF63]'
                    : 'bg-[#140F0C] border-[#2A1F17] hover:border-[#DFAF63]/50 hover:bg-[#1A1410]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-10 h-10 flex items-center ${isLight ? 'text-[#8A5B26]' : 'text-[#E5B96F]'}`}>
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3
                    className={`font-display text-xl font-bold leading-tight ${
                      isLight ? 'text-[#1A130E]' : 'text-[#F7F1E8]'
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isLight ? 'text-[#5C4B3B]' : 'text-[#B8A897]'
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
