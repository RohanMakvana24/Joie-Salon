'use client';

import React from 'react';
import ReceiptTiers from './ui/receipt-tiers';
import type { Plan } from './ui/receipt-tiers-utils/types';
import { SIGNATURE_PACKAGES, buildPackageWhatsAppUrl } from '../data/salonPackages';

const RECEIPT_PACKAGE_PLANS: Plan[] = [
  SIGNATURE_PACKAGES[0], // Signature Hair & Glow Combo
  SIGNATURE_PACKAGES[1], // Royal Bridal & Pre-Bridal Edit (center tilted-up)
  SIGNATURE_PACKAGES[3], // Party Glam & Mani-Pedi Duo
].map((pkg) => ({
  id: pkg.id,
  name: pkg.name,
  tagline: pkg.subtitle,
  price: null,
  duration: pkg.duration,
  rateLabel: 'ON WHATSAPP',
  cta: 'Book This Package',
  ctaHref: buildPackageWhatsAppUrl(pkg),
  badge: pkg.badge,
  features: pkg.features,
}));

export const GroomingPackagesSection: React.FC = () => {
  return (
    <ReceiptTiers
      eyebrow="Curated Experiences · Rajkot"
      heading="Signature Packages"
      subheading="Thoughtfully crafted hair, skin, and bridal sessions for your monthly self-care, festive looks, and wedding celebrations in Rajkot."
      merchant="JOIE SALON"
      merchantLine="HAIR · SKIN · BRIDAL · FOR LADIES · RAJKOT"
      variant="Tilted"
      plans={RECEIPT_PACKAGE_PLANS}
    />
  );
};
