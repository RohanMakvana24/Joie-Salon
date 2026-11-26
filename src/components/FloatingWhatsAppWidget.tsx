import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { BUSINESS_INFO } from '../data/barbershopData';
import './FloatingWhatsAppWidget.css';

export const FloatingWhatsAppWidget: React.FC = () => {
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
    'Hi Joie Salon! I would like to book an appointment at your Arya Nagar, Rajkot salon.'
  );
  const whatsappUrl = `${BUSINESS_INFO.bookingUrl}?text=${whatsappMessage}`;

  if (bookingVisible) return null;

  return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Joie Salon on WhatsApp"
        className="salon-booking-launcher focus-ring"
      >
        <FaWhatsapp size={28} aria-hidden="true" />
      </a>
  );
};
