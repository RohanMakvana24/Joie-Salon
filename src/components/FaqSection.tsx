'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Minus, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SALON_FAQS, SalonFaqItem } from '../data/salonFaqs';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useTheme } from '../hooks/useActivity';

type FaqCategory = 'all' | SalonFaqItem['category'];

const FAQ_CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'booking', label: 'Booking' },
  { id: 'services', label: 'Services' },
  { id: 'hygiene', label: 'Hygiene' },
  { id: 'location', label: 'Location' },
];

export const FaqSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [category, setCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(SALON_FAQS[0]?.id ?? null);

  const visibleFaqs = useMemo(() => {
    if (category === 'all') return SALON_FAQS;
    return SALON_FAQS.filter((item) => item.category === category);
  }, [category]);

  const handleCategoryChange = (next: FaqCategory) => {
    setCategory(next);
    const first = next === 'all' ? SALON_FAQS[0] : SALON_FAQS.find((f) => f.category === next);
    setOpenId(first?.id ?? null);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SALON_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-20 md:py-28 border-b transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#F5F6F7' : '#0C0907',
        borderColor: isLight ? 'rgba(35, 44, 59, 0.12)' : 'rgba(223, 175, 99, 0.15)',
      }}
    >
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Sticky Column: Title, Category Filters & Concierge Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className={`h-[1px] w-7 ${isLight ? 'bg-[#363D49]' : 'bg-[#E5B96F]'}`} />
              <p
                className={`font-mono text-xs uppercase tracking-[0.26em] ${
                  isLight ? 'text-[#363D49]' : 'text-[#E5B96F]'
                }`}
              >
                EVERYTHING YOU NEED TO KNOW
              </p>
            </div>

            <h2
              id="faq-heading"
              className={`font-display uppercase text-4xl sm:text-5xl md:text-[3.25rem] tracking-[-0.01em] leading-[1.02] ${
                isLight ? 'text-[#232C3B]' : 'text-[#F7F1E8]'
              }`}
            >
              FREQUENTLY ASKED{' '}
              <span
                className={`bg-gradient-to-b bg-clip-text text-transparent ${
                  isLight
                    ? 'from-[#5C392E] via-[#4C2E26] to-[#2A170F]'
                    : 'from-[#FFF2C6] via-[#E5B96F] to-[#C28B37]'
                }`}
              >
                QUESTIONS
              </span>
            </h2>

            <p
              className={`mt-4 text-sm sm:text-base leading-relaxed max-w-md ${
                isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
              }`}
            >
              Quick answers on bridal trials, hair &amp; skin treatments, hygiene, and booking at Joie Salon, Rajkot.
            </p>

            {/* Category Filter Pills */}
            <div
              role="tablist"
              aria-label="Filter FAQs by topic"
              className="mt-6 flex flex-wrap gap-2"
            >
              {FAQ_CATEGORIES.map((tab) => {
                const isActive = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.04em] transition-all cursor-pointer focus-ring ${
                      isActive
                        ? isLight
                          ? 'bg-[#232C3B] text-[#F5F7FA] shadow-[0_4px_12px_rgba(35,44,59,0.2)]'
                          : 'bg-[#E5B96F] text-[#0C0907] shadow-[0_4px_14px_rgba(229,185,111,0.25)]'
                        : isLight
                        ? 'bg-white text-[#4B5563] border border-[#232C3B]/15 hover:text-[#232C3B]'
                        : 'bg-[#16110D] text-[#C9B8A6] border border-[#DFAF63]/20 hover:text-[#F7F1E8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Direct Concierge Box */}
            <div
              className={`mt-8 p-6 rounded-2xl border transition-colors ${
                isLight
                  ? 'bg-white border-[#232C3B]/12 shadow-[0_8px_24px_rgba(35,44,59,0.05)]'
                  : 'bg-[#140F0C] border-[#DFAF63]/25'
              }`}
            >
              <p
                className={`font-display text-lg font-bold leading-snug ${
                  isLight ? 'text-[#232C3B]' : 'text-[#F7F1E8]'
                }`}
              >
                Still have a specific question?
              </p>
              <p
                className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                  isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
                }`}
              >
                Message our stylists directly on WhatsApp or call us for instant slot &amp; bridal consultation details.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={BUSINESS_INFO.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#137A3D] hover:bg-[#106632] text-white font-semibold text-xs uppercase tracking-wider transition-colors focus-ring"
                >
                  <FaWhatsapp size={15} />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-xs uppercase tracking-wider transition-colors focus-ring ${
                    isLight
                      ? 'bg-[#EAEDF0] hover:bg-[#DFE4EA] text-[#232C3B] border-[#232C3B]/20'
                      : 'bg-[#211812] hover:bg-[#2C2018] text-[#E5B96F] border-[#DFAF63]/35'
                  }`}
                >
                  <PhoneCall size={14} />
                  <span>Call Salon</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Numbered Editorial Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              const num = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? isLight
                        ? 'bg-white border-[#232C3B]/25 shadow-[0_12px_30px_-12px_rgba(35,44,59,0.12)]'
                        : 'bg-[#16110D] border-[#DFAF63]/55 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]'
                      : isLight
                      ? 'bg-white/70 border-[#232C3B]/10 hover:bg-white hover:border-[#232C3B]/20'
                      : 'bg-[#120E0B]/80 border-[#DFAF63]/15 hover:border-[#DFAF63]/35'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId((prev) => (prev === faq.id ? null : faq.id))}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-ring rounded-2xl"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span
                        className={`font-mono text-xs font-semibold pt-1 shrink-0 ${
                          isOpen
                            ? isLight
                              ? 'text-[#5C392E]'
                              : 'text-[#E5B96F]'
                            : isLight
                            ? 'text-[#4B5563]/70'
                            : 'text-[#C9B8A6]/60'
                        }`}
                      >
                        {num}
                      </span>
                      <span
                        className={`font-display text-base sm:text-lg font-semibold leading-snug transition-colors ${
                          isOpen
                            ? isLight
                              ? 'text-[#232C3B]'
                              : 'text-[#FFF2C6]'
                            : isLight
                            ? 'text-[#232C3B]/90'
                            : 'text-[#F7F1E8]'
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? isLight
                            ? 'bg-[#232C3B] text-[#F5F7FA]'
                            : 'bg-[#E5B96F] text-[#0C0907]'
                          : isLight
                          ? 'bg-[#EAEDF0] text-[#232C3B]'
                          : 'bg-[#DFAF63]/10 text-[#E5B96F]'
                      }`}
                    >
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>

                  {/* Smooth Grid-Row Accordion Body */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.25rem] sm:pl-[3.5rem] text-xs sm:text-sm leading-relaxed ${
                          isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'
                        }`}
                      >
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Structured Data for Google FAQ Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    </section>
  );
};
