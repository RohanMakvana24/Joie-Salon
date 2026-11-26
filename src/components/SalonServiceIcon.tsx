import { Scissors, Sparkles, Palette, Heart } from 'lucide-react';

export function SalonServiceIcon({ serviceId, size = 16 }: { serviceId: string; size?: number }) {
  if (serviceId === 'hair-color-keratin') return <Palette size={size} strokeWidth={1.6} aria-hidden="true" />;
  if (serviceId === 'facials-skin-rituals' || serviceId === 'manicure-pedicure-nails') {
    return <Sparkles size={size} strokeWidth={1.6} aria-hidden="true" />;
  }
  if (serviceId === 'bridal-party-makeup') return <Heart size={size} strokeWidth={1.6} aria-hidden="true" />;
  return <Scissors size={size} strokeWidth={1.6} aria-hidden="true" />;
}
