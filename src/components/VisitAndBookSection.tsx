import { SkeletonImage } from './ui/skeleton-image';
import React, { useState } from 'react';
import { MapPin, Phone, Navigation, ArrowUpRight, Plus, Minus, RotateCcw, Copy, Check } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './VisitAndBookSection.css';
import { BookingPlanner } from './BookingPlanner';

const PLACE_ID = 'ChIJDz3mzNO1WTkR7HhDiGWnnB4';
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=Classic+Cut+Salon+Rajkot&destination_place_id=${PLACE_ID}`;

export const VisitAndBookSection: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.fullAddress);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="salon-visit">
      <div className="salon-visit__inner">
        <div className="salon-visit__heading">
          <div>
            <p className="salon-visit__eyebrow">YOUR NEXT GOOD HAIR DAY STARTS HERE</p>
            <h2 id="contact-heading">
              VISIT &amp; <span>BOOK</span>
            </h2>
          </div>
          <p className="salon-visit__lede">
            A familiar corner. A fresh new look.
            <br />
            Find your chair at Classic Cut Salon, Rajkot.
          </p>
        </div>

        <div className="salon-visit__grid">
          <div className="salon-visit__info">
            <p className="salon-visit__eyebrow">OUR LITTLE CORNER OF RAJKOT</p>
            <h3>
              Great hair.
              <br />
              Right here.
            </h3>
            <p className="salon-visit__address-text">{BUSINESS_INFO.fullAddress}</p>

            <div className="salon-visit__info-actions">
              <a className="salon-visit__button" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">
                <Navigation size={15} aria-hidden="true" />
                Get directions
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="salon-visit__link" href={BUSINESS_INFO.phoneHref}>
                <Phone size={14} aria-hidden="true" />
                {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>

            <button className="salon-visit__copy" type="button" onClick={copyAddress}>
              {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
              {copied ? 'Address copied' : 'Copy address'}
            </button>
          </div>

          <figure className="salon-visit__map">
            <div className="salon-visit__map-frame" style={{ transform: `scale(${zoom})` }}>
              <SkeletonImage
                src="/assets/location/classic-cut-neighborhood.webp"
                alt="Miniature architectural illustration inspired by Classic Cut Salon’s ivory storefront, gold arched entrance and potted palms"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>

            <a
              className="salon-visit__pin"
              href={DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions to Classic Cut Salon"
            >
              <span className="salon-visit__pin-label">
                CLASSIC CUT <span>YOUR CHAIR IS HERE</span>
              </span>
              <MapPin aria-hidden="true" />
              <span className="salon-visit__pin-ring" />
            </a>

            <div className="salon-visit__zoom" role="group" aria-label="Illustration zoom">
              <button
                type="button"
                aria-label="Zoom in illustration"
                disabled={zoom >= 1.4}
                onClick={() => setZoom((value) => Math.min(1.4, +(value + 0.1).toFixed(1)))}
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                aria-label="Zoom out illustration"
                disabled={zoom <= 1}
                onClick={() => setZoom((value) => Math.max(1, +(value - 0.1).toFixed(1)))}
              >
                <Minus size={16} />
              </button>
              <button type="button" aria-label="Reset illustration view" onClick={() => setZoom(1)}>
                <RotateCcw size={14} />
              </button>
            </div>

            <figcaption className="salon-visit__caption">Storefront-inspired illustration</figcaption>
          </figure>

        </div>

        <BookingPlanner />
      </div>
    </section>
  );
};

export default VisitAndBookSection;
