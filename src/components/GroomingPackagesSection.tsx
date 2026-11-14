'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock } from 'lucide-react';
import { SIGNATURE_PACKAGES, buildPackageWhatsAppUrl } from '../data/salonPackages';
import { useTheme } from '../hooks/useActivity';
import './GroomingPackagesSection.css';

type PackageFilter = 'all' | 'groom' | 'executive' | 'youth-family';
const FILTERS: { id: PackageFilter; label: string }[] = [
  { id: 'all', label: 'All Packages' },
  { id: 'executive', label: 'Executive Combos' },
  { id: 'groom', label: 'Wedding Packages' },
  { id: 'youth-family', label: 'Youth & Family' },
];
const VISUALS: Record<string, { image: string; title: string; word: string; description: string; alt: string }> = {
  'royal-executive-combo': { image: 'executive', title: 'The Executive Refresh', word: 'REFRESH', description: 'Your complete cut, beard and hot-towel ritual. Walk out looking sharp and feeling refreshed.', alt: '3D character with a styled haircut and sculpted beard in a charcoal blazer' },
  'signature-groom-makeover': { image: 'wedding', title: 'The Wedding Edit', word: 'CELEBRATE', description: 'From your first celebration to the final photograph. A complete grooming ritual for your big day.', alt: '3D Indian groom with styled hair wearing an ivory sherwani' },
  'student-youth-cut': { image: 'youth', title: 'The Fresh Cut', word: 'EXPRESS', description: 'Fresh fades, natural texture and effortless styling. A look that keeps up with your everyday.', alt: '3D young man with a textured crop wearing a sage overshirt' },
  'father-son-duo': { image: 'family', title: 'The Father & Son Duo', word: 'TOGETHER', description: 'Two fresh looks. One shared ritual. A little quality time and great grooming for both generations.', alt: '3D father and son showing their fresh haircuts together' },
};

export const GroomingPackagesSection: React.FC = () => {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<PackageFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const visiblePackages = SIGNATURE_PACKAGES.filter(pkg => activeFilter === 'all' || pkg.category === activeFilter);
  const selectPackage = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - (track.children[0] as HTMLElement).offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setActiveIndex(index);
  };
  return (
    <section id="packages" aria-labelledby="packages-heading" className={`signature-packages ${theme === 'light' ? 'signature-packages--light' : ''}`}>
      <div className="signature-packages__inner">
        <header className="signature-packages__heading">
          <p className="signature-packages__eyebrow">PACKAGES <span className="signature-packages__eyebrow-count">/ 04</span></p>
          <h2 id="packages-heading">Signature <span>Packages.</span></h2>
          <p className="signature-packages__intro">Your everyday refresh. Your biggest celebrations.<br />Find the grooming experience made for your moment.</p>
        </header>
        <div className="signature-packages__filters" role="group" aria-label="Filter grooming packages">
          {FILTERS.map(tab => <button key={tab.id} type="button" aria-pressed={activeFilter === tab.id} onClick={() => { setActiveFilter(tab.id); setActiveIndex(0); if (trackRef.current) trackRef.current.scrollLeft = 0; }}>{tab.label}{tab.id === 'all' && <span>{SIGNATURE_PACKAGES.length}</span>}</button>)}
        </div>
        <div ref={trackRef} className="signature-packages__grid" role="region" aria-label="Grooming packages — swipe horizontally to explore" tabIndex={0} onScroll={event => { const track = event.currentTarget; if (window.innerWidth > 640) return; const cards = Array.from(track.children) as HTMLElement[]; const first = cards[0]?.offsetLeft ?? 0; let nearest = 0; cards.forEach((card, index) => { if (Math.abs(card.offsetLeft - first - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - first - track.scrollLeft)) nearest = index; }); setActiveIndex(nearest); }}>
          {visiblePackages.map(pkg => {
            const visual = VISUALS[pkg.id];
            return (
              <article key={pkg.id} className={`signature-package signature-package--${visual.image}`}>
                <div className="signature-package__stage">
                  <span className="signature-package__edition" aria-hidden="true">0{SIGNATURE_PACKAGES.indexOf(pkg) + 1}</span>
                  <span className="signature-package__motto" aria-hidden="true">{visual.word}</span>
                  <img src={`/assets/characters/packages/${visual.image}.webp`} alt={visual.alt} loading="lazy" decoding="async" width="1024" height="1536" />
                  {pkg.badge && <span className="signature-package__badge">{pkg.badge}</span>}
                </div>
                <div className="signature-package__body">
                  <div className="signature-package__topline"><span>PACKAGE {String(SIGNATURE_PACKAGES.indexOf(pkg) + 1).padStart(2, '0')}</span><span><Clock size={11} aria-hidden="true" />{pkg.duration}</span></div>
                  <div className="signature-package__title"><span>{FILTERS.find(filter => filter.id === pkg.category)?.label}</span><h3>{visual.title}</h3></div>
                  <p className="signature-package__description">{visual.description}</p>
                  <details className="signature-package__details"><summary>Explore what's included <span>+</span></summary><ul className="signature-package__includes">{pkg.features.map(feature => <li key={feature}><Check size={13} aria-hidden="true" /><span>{feature}</span></li>)}</ul></details>
                  <footer className="signature-package__footer">
                    <a href={buildPackageWhatsAppUrl(pkg)} target="_blank" rel="noopener noreferrer" aria-label={`Book ${pkg.name} on WhatsApp`}>Book this package <ArrowUpRight size={17} aria-hidden="true" /></a>
                    <span>Enquire for pricing</span>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
        <div className="signature-packages__navigation">
          <div className="signature-packages__navigation-top"><span>FIND YOUR SIGNATURE</span><span aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} <i>/ {String(visiblePackages.length).padStart(2, '0')}</i></span></div>
          <div className="signature-packages__navigation-bottom">
            <button className="signature-packages__arrow" type="button" aria-label="Previous package" disabled={activeIndex === 0} onClick={() => selectPackage(activeIndex - 1)}><ArrowLeft size={17} /></button>
            <div className="signature-packages__previews">{visiblePackages.map((pkg, index) => <button key={pkg.id} type="button" aria-label={`Show ${VISUALS[pkg.id].title}`} aria-pressed={activeIndex === index} onClick={() => selectPackage(index)}><img src={`/assets/characters/packages/${VISUALS[pkg.id].image}.webp`} alt="" width="40" height="60" /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>
            <button className="signature-packages__arrow" type="button" aria-label="Next package" disabled={activeIndex === visiblePackages.length - 1} onClick={() => selectPackage(activeIndex + 1)}><ArrowRight size={17} /></button>
          </div>
          <p>Swipe to discover your next look</p>
        </div>
        <p className="signature-packages__note">A little time for yourself. A look that stays with you.</p>
      </div>
    </section>
  );
};
