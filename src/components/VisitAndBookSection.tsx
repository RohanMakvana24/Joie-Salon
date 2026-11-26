'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Phone, Navigation, ArrowUpRight, Copy, Check, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './VisitAndBookSection.css';
import { BookingPlanner } from './BookingPlanner';

const JoieSalonMap = dynamic(
  () => import('./JoieSalonMap').then((mod) => mod.JoieSalonMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[360px] sm:min-h-[410px] rounded-xl bg-black/5 animate-pulse flex items-center justify-center text-xs uppercase tracking-widest opacity-60">
        Loading interactive map...
      </div>
    ),
  }
);

const DIRECTIONS_URL = BUSINESS_INFO.googleMapsUrl;

export const VisitAndBookSection: React.FC = () => {
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
            Jyoti Nagar Main Road · Behind Crystal Mall.
            <br />
            Find your chair at Joie Salon, Rajkot.
          </p>
        </div>

        <div className="salon-visit__grid">
          <div className="salon-visit__info">
            <p className="salon-visit__eyebrow">JYOTI NAGAR · RAJKOT 360005</p>
            <h3>
              Great hair.
              <br />
              Right here.
            </h3>
            <p className="salon-visit__address-text">{BUSINESS_INFO.fullAddress}</p>

            <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium opacity-80">
              <Clock size={14} aria-hidden="true" />
              <span>Mon – Sun · 10:00 AM – 8:00 PM</span>
            </div>

            <div className="salon-visit__info-actions">
              <a className="salon-visit__button" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
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
            <JoieSalonMap />
          </figure>
        </div>

        <BookingPlanner />
      </div>
    </section>
  );
};

export default VisitAndBookSection;
