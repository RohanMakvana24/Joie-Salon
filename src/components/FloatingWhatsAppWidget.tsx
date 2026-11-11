import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';

export const FloatingWhatsAppWidget: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'Hi Classic Cut Salon! I would like to book an appointment at your Arya Nagar, Rajkot salon.'
  );
  const whatsappUrl = `${BUSINESS_INFO.bookingUrl}?text=${whatsappMessage}`;

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Open WhatsApp quick booking"
        className="fixed left-4 sm:left-6 bottom-5 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all focus-ring cursor-pointer"
      >
        <FaWhatsapp className="w-6 h-6" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Quick WhatsApp appointment booking"
      className="fixed left-4 sm:left-6 bottom-5 z-40 flex items-center gap-2 group select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-[#140F0C]/95 hover:bg-[#1A1410] border border-[#25D366]/40 hover:border-[#25D366] shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all group focus-ring cursor-pointer hover:shadow-[0_12px_32px_rgba(37,211,102,0.25)]"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-inner shrink-0">
          <FaWhatsapp className="w-5 h-5 text-white" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#140F0C]" />
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[12px] font-bold text-[#F7F1E8] group-hover:text-[#25D366] transition-colors leading-tight">
            Book Appointment
          </span>
          <span className="text-[10px] text-[#A69786] font-normal leading-tight">
            Chat on WhatsApp · Arya Nagar
          </span>
        </div>
      </a>

      <button
        type="button"
        onClick={() => setMinimized(true)}
        aria-label="Minimize WhatsApp widget"
        className="w-6 h-6 rounded-full bg-[#181310]/80 border border-[#3E3025] hover:border-[#A69786] text-[#A69786] hover:text-[#F7F1E8] flex items-center justify-center transition-colors focus-ring opacity-60 group-hover:opacity-100 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
