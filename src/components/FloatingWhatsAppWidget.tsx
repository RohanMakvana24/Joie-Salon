import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { ArrowUpRight, Scissors, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './FloatingWhatsAppWidget.css';

export const FloatingWhatsAppWidget: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);

  useEffect(() => {
    const booking = document.getElementById('booking');
    if (!booking) return;
    const observer = new IntersectionObserver(([entry]) => {
      setBookingVisible(entry.isIntersecting);
    });
    observer.observe(booking);
    return () => observer.disconnect();
  }, []);

  const whatsappMessage = encodeURIComponent(
    'Hi Classic Cut Salon! I would like to book an appointment at your Arya Nagar, Rajkot salon.'
  );
  const whatsappUrl = `${BUSINESS_INFO.bookingUrl}?text=${whatsappMessage}`;

  if (bookingVisible) return null;

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Open WhatsApp quick booking"
        className="salon-booking-launcher focus-ring"
      >
        <FaWhatsapp className="w-6 h-6" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Quick WhatsApp appointment booking"
      className="salon-booking-widget"
    >
      <div className="salon-booking-widget__heading"><span><Scissors size={13} aria-hidden="true" /> YOUR NEXT FRESH CUT</span><button type="button" onClick={() => setMinimized(true)} aria-label="Minimize WhatsApp widget" className="focus-ring"><X size={15} /></button></div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="salon-booking-widget__link focus-ring"
      >
        <div className="salon-booking-widget__icon">
          <FaWhatsapp size={23} aria-hidden="true" />
        </div>

        <div className="salon-booking-widget__copy">
          <strong>Book your chair</strong>
          <span>Chat with us on WhatsApp</span>
        </div>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>

    </aside>
  );
};
