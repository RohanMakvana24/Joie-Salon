'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SALON_FAQS } from '../data/salonFaqs';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useTheme } from '../hooks/useActivity';

export const FaqSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
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
      className="relative py-20 md:py-28 border-b border-[#DFAF63]/15 overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#FAF6EE' : '#0C0907',
      }}
    >
      <div className="site-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#E5B96F]">
              EVERYTHING YOU NEED TO KNOW
            </p>
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
          </div>

          <h2
            id="faq-heading"
            className={`font-display text-4xl sm:text-5xl md:text-[3.5rem] tracking-[-0.01em] leading-tight ${
              isLight ? 'text-[#1A130E]' : 'text-[#F7F1E8]'
            }`}
          >
            FREQUENTLY ASKED{' '}
            <span className="bg-gradient-to-r from-[#FFF2C6] via-[#E5B96F] to-[#C28B37] bg-clip-text text-transparent">
              QUESTIONS
            </span>
          </h2>

          <p
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-[#6A5040]' : 'text-[#C9B8A6]'
            }`}
          >
            Have a question before stepping into our Arya Nagar salon? Find direct answers below.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {SALON_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? isLight
                      ? 'bg-white border-[#DFAF63] shadow-md'
                      : 'bg-[#16110D] border-[#DFAF63]/70 shadow-lg'
                    : isLight
                    ? 'bg-white/70 border-[#E8DEC9] hover:border-[#DFAF63]/50'
                    : 'bg-[#120E0B] border-[#2B2017] hover:border-[#DFAF63]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus-ring gap-4"
                >
                  <span
                    className={`font-display text-base sm:text-lg font-bold leading-snug ${
                      isOpen
                        ? 'text-[#E5B96F]'
                        : isLight
                        ? 'text-[#1A130E]'
                        : 'text-[#F7F1E8]'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#E5B96F] text-[#0C0907] rotate-180'
                        : 'bg-[#E5B96F]/10 text-[#E5B96F]'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    className={`px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t border-[#DFAF63]/15 ${
                      isLight ? 'text-[#5C4B3B]' : 'text-[#C9B8A6]'
                    }`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Help CTA */}
        <div className={`faq-help mt-12 p-6 sm:p-7 rounded-2xl border text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isLight ? 'bg-[#FFFCF6] border-[#D8C5A7] shadow-sm' : 'bg-[#19120D] border-[#DFAF63]/30'}`}>
          <div className="min-w-0 max-w-xl">
            <h4 className={`font-display text-lg sm:text-xl font-bold leading-snug ${isLight ? 'text-[#2D2118]' : 'text-[#F7F1E8]'}`}>
              Have a specific question or custom requirement?
            </h4>
            <p className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-[#6B5744]' : 'text-[#C9B8A6]'}`}>
              Talk directly with our head stylist or message us on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={BUSINESS_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 justify-center items-center gap-2 px-5 py-3 rounded-full bg-[#137A3D] hover:bg-[#106632] text-white font-bold text-xs uppercase tracking-wider transition-colors focus-ring"
            >
              <FaWhatsapp size={15} />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={BUSINESS_INFO.phoneHref}
              className={`inline-flex min-h-11 justify-center items-center gap-2 px-5 py-3 rounded-full border font-bold text-xs uppercase tracking-wider transition-colors focus-ring ${isLight ? 'bg-[#F3EADB] hover:bg-[#EADAC0] text-[#704819] border-[#CBB18B]' : 'bg-[#2A1E15] hover:bg-[#38281D] text-[#E5B96F] border-[#DFAF63]/40'}`}
            >
              <PhoneCall size={14} />
              <span>Call Salon</span>
            </a>
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
