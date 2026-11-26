export interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: { monthly: number; annual: number } | null;
  duration?: string;
  rateLabel?: string;
  cta: string;
  ctaHref?: string;
  badge?: string;
  features: string[];
}
