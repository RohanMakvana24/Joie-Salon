'use client';

import React from 'react';
import ReceiptTiers from './ui/receipt-tiers';
import type { Plan } from './ui/receipt-tiers-utils/types';
import { SIGNATURE_PACKAGES, buildPackageWhatsAppUrl } from '../data/salonPackages';

const SHORT_PACKAGE_COPY: Record<
  string,
  { name: string; tagline: string; features: string[] }
> = {
  'signature-hair-glow-combo': {
    name: 'Hair & Glow Combo',
    tagline: 'Monthly ladies refresh & blow-dry',
    features: [
      'Layer / Feather Haircut',
      'Keratin Hair Spa',
      'Hydra-Glow & Blow-Dry',
    ],
  },
  'royal-bridal-edit': {
    name: 'Royal Bridal Edit',
    tagline: 'Wedding, sangeet & reception glam',
    features: [
      'HD / Airbrush Makeup',
      'Floral Bun & Styling',
      'Saree & Lehenga Draping',
    ],
  },
  'party-ready-glam-nails': {
    name: 'Party Glam & Nails',
    tagline: 'Festive makeup, waves & gel nails',
    features: [
      'Soft Glam Party Makeup',
      'Curls or Silk Blow-Dry',
      'Spa Mani-Pedi & Gel Art',
    ],
  },
};

const RECEIPT_PACKAGE_PLANS: Plan[] = [
  SIGNATURE_PACKAGES[0], // Hair & Glow Combo
  SIGNATURE_PACKAGES[1], // Royal Bridal Edit (center featured)
  SIGNATURE_PACKAGES[3], // Party Glam & Nails
].map((pkg) => {
  const compact = SHORT_PACKAGE_COPY[pkg.id];
  return {
    id: pkg.id,
    name: compact?.name ?? pkg.name,
    tagline: compact?.tagline ?? pkg.subtitle,
    price: null,
    duration: pkg.duration,
    rateLabel: 'ON WHATSAPP',
    cta: 'Book This Package',
    ctaHref: buildPackageWhatsAppUrl(pkg),
    badge: pkg.badge,
    features: compact?.features ?? pkg.features.slice(0, 3),
  };
});

export const GroomingPackagesSection: React.FC = () => {
  return (
    <ReceiptTiers
      eyebrow="Curated Experiences · Rajkot"
      heading="Signature Packages"
      subheading="Three curated hair, skin, and bridal sessions tailored for everyday care, festive nights, and weddings."
      merchant="JOIE SALON"
      merchantLine="LADIES STUDIO · RAJKOT"
      variant="Tilted"
      plans={RECEIPT_PACKAGE_PLANS}
    />
  );
};
