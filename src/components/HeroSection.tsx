import { ArrowUpRight, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { SalonCrowdScene } from './ui/salon-crowd-scene';
import './HeroSection.css';

const landmarks = ['Akashvani Chowk', 'Crystal Mall', 'Arya Nagar'];
const destination = `Joie Salon, ${BUSINESS_INFO.fullAddress}`;

function directionsFrom(origin?: string) {
  const params = new URLSearchParams({
    api: '1',
    destination,
  });
  if (origin) params.set('origin', `${origin}, Rajkot`);
  return `https://www.google.com/maps/dir/?${params}`;
}

export function HeroSection() {
  return (
    <section id="top" className="joie-hero" aria-labelledby="joie-hero-title">
      <div className="joie-hero__frame">
        <svg className="joie-hero__notch" viewBox="0 0 560 61" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 C34 0 46 6 60 22 L78 44 C88 56 98 61 116 61 L444 61 C462 61 472 56 482 44 L500 22 C514 6 526 0 560 0 Z" />
        </svg>
        <div className="joie-hero__intro">
          <h1 id="joie-hero-title">Find <em>Joie Salon</em> in Rajkot</h1>
          <p>Visit us on Pedak Cross Road in Arya Nagar, opposite Umiya R.O.</p>
          <div className="joie-hero__actions">
            <a href={directionsFrom()} target="_blank" rel="noopener noreferrer" className="focus-ring">
              <Navigation size={16} aria-hidden="true" /> Get directions
            </a>
            <a href={BUSINESS_INFO.bookingUrl} target="_blank" rel="noopener noreferrer" className="focus-ring">
              Book an appointment <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="joie-hero__scene">
          <SalonCrowdScene />
          <nav className="joie-hero__landmarks" aria-label="Directions from Rajkot landmarks">
            <p>Get directions from</p>
            <ul>
              {landmarks.map((landmark) => (
                <li key={landmark}>
                  <a href={directionsFrom(landmark)} target="_blank" rel="noopener noreferrer" className="focus-ring">
                    {landmark} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
