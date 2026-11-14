import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import '../src/site-layout.css';
import { BUSINESS_INFO, buildHairSalonSchemaJsonLd } from '../src/data/barbershopData';
import { SEO_TITLE, SEO_DESCRIPTION, SITE_URL } from '../src/lib/seo';

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [
    'best salon in rajkot',
    'best men salon in rajkot',
    'hair salon rajkot',
    'pedak road salon rajkot',
    'classic cut salon rajkot',
    'beard styling rajkot',
    'skin fade haircut rajkot',
    'groom wedding package rajkot',
    'arya nagar salon rajkot',
    'barbershop in rajkot',
  ],
  ...(SITE_URL ? {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/` },
  } : {}),
  ...(process.env.GOOGLE_SITE_VERIFICATION ? {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  } : {}),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SEO_TITLE,
    ...(SITE_URL ? { url: `${SITE_URL}/` } : {}),
    description:
      "Premier men's grooming salon on Pedak Road, Arya Nagar, Rajkot. Master fades, royal beard grooming, groom packages & de-tan facials. Book via WhatsApp or call +91 82828 48453.",
    siteName: BUSINESS_INFO.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/brand/classic-cut-luxury-logo.jpg',
        width: 1024,
        height: 1024,
        alt: 'Classic Cut Salon Rajkot - Best Men Salon on Pedak Road',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_TITLE,
    description:
      'Book your next haircut, fade, or beard styling session at Classic Cut Salon, Rajkot. Call +91 82828 48453.',
    images: ['/assets/brand/classic-cut-luxury-logo.jpg'],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%230C0907' stroke='%23DFAF63' stroke-width='4'/%3E%3Ctext x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' fill='%23DFAF63' font-family='Impact,sans-serif' font-size='28' font-weight='bold' letter-spacing='1'%3ECC%3C/text%3E%3C/svg%3E",
  },
};

const salonSchema = {
  ...buildHairSalonSchemaJsonLd(BUSINESS_INFO),
  description: SEO_DESCRIPTION,
  ...(SITE_URL ? {
    '@id': `${SITE_URL}/#salon`,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/assets/brand/classic-cut-icon-cropped.png`,
  } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="bg-[#0C0907] text-[#F7F1E8] antialiased selection:bg-[#F58A16] selection:text-[#0C0907]">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try { const theme = localStorage.getItem('relook-theme'); document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'; } catch { document.documentElement.dataset.theme = 'light'; }`}
        </Script>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
