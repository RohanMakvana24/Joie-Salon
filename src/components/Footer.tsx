import React from 'react';
import { MapPin, Phone, ArrowUpRight, ArrowUp, Scissors } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { BrandLogo } from './BrandLogo';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';
import './Footer.css';

interface FooterProps {
  /** Kept for API compatibility — the footer is always dark, in both themes. */
  theme?: ThemeMode;
  onOpenInspector: (initialTab?: 'layers' | 'tokens' | 'docs') => void;
}

const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Our Barbers', href: '#barbers' },
  { label: 'The Shop', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const FACEBOOK_URL = 'https://www.facebook.com/search/top?q=Classic%20Cut%20Salon%20Rajkot';
const YOUTUBE_URL = 'https://www.youtube.com/results?search_query=Classic+Cut+Salon+Rajkot';

const SOCIALS = [
  { label: 'Instagram', href: BUSINESS_INFO.instagramUrl, Icon: FaInstagram },
  { label: 'YouTube', href: YOUTUBE_URL, Icon: FaYoutube },
  { label: 'Facebook', href: FACEBOOK_URL, Icon: FaFacebookF },
  { label: 'WhatsApp', href: BUSINESS_INFO.bookingUrl, Icon: FaWhatsapp },
];

export const Footer: React.FC<FooterProps> = () => (
  <footer className="salon-footer" aria-label="Classic Cut Salon footer">
    <div className="salon-footer__inner">
      <div className="salon-footer__grid">
        <div className="salon-footer__brand">
          <BrandLogo size="lg" theme="dark" />
          <p className="salon-footer__tagline">
            Precision cuts, classic styles and modern grooming — the chair is waiting in Arya Nagar, Rajkot.
          </p>
          <ul className="salon-footer__social" aria-label="Classic Cut Salon social profiles">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="salon-footer__col" aria-label="Footer">
          <h2 className="salon-footer__heading">Explore</h2>
          <ul className="salon-footer__links">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="salon-footer__col">
          <h2 className="salon-footer__heading">Visit us</h2>
          <address className="salon-footer__address">
            {BUSINESS_INFO.streetAddress}
            <br />
            {BUSINESS_INFO.locality}, {BUSINESS_INFO.region} &ndash; {BUSINESS_INFO.postalCode}
          </address>
          <div className="salon-footer__actions">
            <a className="salon-footer__action" href={BUSINESS_INFO.phoneHref}>
              <Phone aria-hidden="true" />
              <span>{BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <a
              className="salon-footer__action"
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin aria-hidden="true" />
              <span>Get directions</span>
              <ArrowUpRight className="salon-footer__action-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="salon-footer__book">
          <span className="salon-footer__book-mark" aria-hidden="true">
            <Scissors />
          </span>
          <h2 className="salon-footer__heading">Book a chair</h2>
          <p className="salon-footer__book-text">
            Walk-ins welcome. Message us for today&rsquo;s availability and current rates.
          </p>
          <a
            className="salon-footer__button"
            href={BUSINESS_INFO.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Booking
            <ArrowUpRight className="salon-footer__button-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="salon-footer__bottom">
        <p className="salon-footer__copy">
          &copy; {new Date().getFullYear()} Classic Cut Salon. All rights reserved.
        </p>
        <a className="salon-footer__totop" href="#top">
          Back to top
          <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
