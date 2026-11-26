// Demo preview for the grid testimonials marquee component.
// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO

import { TestimonialsMarquee } from '@/components/ui/grid-testimonials-marquee';

const row = [
  {
    id: 'demo-1',
    name: 'Priya Patel',
    handle: 'Verified Rajkot Review',
    avatarColor: '#1a73e8',
    content: 'Best ladies salon near Crystal Mall, Jyoti Nagar. They take time to understand the layer cut you want.',
    highlights: ['Jyoti Nagar'],
    rating: 5,
  },
  {
    id: 'demo-2',
    name: 'Kavya Jadeja',
    handle: 'Verified Rajkot Review',
    avatarColor: '#a142f4',
    content: 'Silky keratin smoothing and glowing hydra facial every single visit.',
    highlights: ['keratin smoothing', 'hydra facial'],
    rating: 5,
  },
];

export default function DemoOne() {
  return <TestimonialsMarquee firstRow={row} secondRow={[...row].reverse()} />;
}
