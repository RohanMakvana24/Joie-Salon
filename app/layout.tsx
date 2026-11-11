import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { BUSINESS_INFO, buildHairSalonSchemaJsonLd } from '../src/data/barbershopData';

export const metadata: Metadata = {
  title: 'Classic Cut Salon | Rajkot, Gujarat',
  description:
    "Visit Classic Cut Salon at Pedak Cross Road, Arya Nagar, Rajkot. Precision men's haircuts, skin fades, beard styling, de-tan facials, and kids' cuts.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Classic Cut Salon | Rajkot, Gujarat',
    description:
      "Premium men's grooming salon on Pedak Road, Arya Nagar, Rajkot. Book via WhatsApp or call +91 82828 48453.",
    siteName: BUSINESS_INFO.name,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Classic Cut Salon | Rajkot, Gujarat',
    description:
      'Book your next haircut, fade, or beard styling session at Classic Cut Salon, Rajkot.',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%230C0907' stroke='%23DFAF63' stroke-width='4'/%3E%3Ctext x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' fill='%23DFAF63' font-family='Impact,sans-serif' font-size='28' font-weight='bold' letter-spacing='1'%3ECC%3C/text%3E%3C/svg%3E",
  },
};

const salonSchema = buildHairSalonSchemaJsonLd(BUSINESS_INFO);

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema) }}
        />
      </body>
    </html>
  );
}
