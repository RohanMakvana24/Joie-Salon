'use client';

import React from 'react';
import MiniatureSalonFooter, { type FooterColumn } from './MiniatureSalonFooter';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';

interface FooterProps {
  theme?: ThemeMode;
  onOpenInspector?: (tab: 'layers' | 'tokens' | 'docs') => void;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Signature Packages', href: '#packages' },
      { label: 'Our Bridals', href: '#bridals' },
      { label: 'Products', href: '#products' },
    ],
  },
  {
    title: 'Salon',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Visit & Book', href: '#contact' },
      { label: 'Blog & Guides', href: '/blog' },
      { label: 'Google Maps', href: BUSINESS_INFO.googleMapsUrl, external: true },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'WhatsApp Booking', href: BUSINESS_INFO.bookingUrl, external: true },
      { label: BUSINESS_INFO.phoneDisplay, href: BUSINESS_INFO.phoneHref },
      { label: BUSINESS_INFO.instagramHandle, href: BUSINESS_INFO.instagramUrl, external: true },
    ],
  },
];

export const Footer: React.FC<FooterProps> = () => {
  const year = new Date().getFullYear();

  return (
    <MiniatureSalonFooter
      name="Joie Salon · For Ladies"
      tagline="Hair · Skin · Bridal — Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot."
      columns={FOOTER_COLUMNS}
      legal={[
        { label: 'Mon–Sun · 10 AM – 8 PM', href: '#contact' },
        { label: 'Back to top', href: '#top' },
      ]}
      copyright={`© ${year} Joie Salon · Rajkot, Gujarat`}
    />
  );
};
