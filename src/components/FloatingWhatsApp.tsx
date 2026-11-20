import React from 'react';
import { buildWhatsappUrl } from '../data/i18n';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  lang: Language;
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  lang,
  whatsappNumber,
}) => {
  const url = buildWhatsappUrl(
    whatsappNumber,
    lang === 'ar'
      ? 'مرحباً SNAP CELL! بدي أستفسر عن منتجاتكم.'
      : 'Hello SNAP CELL! I would like to inquire about your products.'
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp SNAP CELL"
      className="fixed bottom-5 end-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600]"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.002 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.25.59 4.45 1.71 6.39L3.1 28.8l6.58-1.73a12.75 12.75 0 0 0 6.32 1.67h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.72 12.72 0 0 0 16.002 3.2zm7.48 18.23c-.31.88-1.82 1.68-2.51 1.78-.65.1-1.47.14-2.38-.15-.55-.18-1.26-.41-2.16-.8-3.8-1.64-6.28-5.47-6.47-5.72-.19-.26-1.55-2.06-1.55-3.93 0-1.87.98-2.79 1.33-3.17.35-.38.76-.48 1.01-.48.25 0 .51.01.73.01.23 0 .55-.09.86.66.31.76 1.07 2.61 1.16 2.8.1.19.16.41.03.67-.13.26-.19.41-.38.64-.19.22-.4.5-.57.67-.19.19-.39.4-.17.78.22.38 1 1.65 2.14 2.67 1.47 1.31 2.71 1.72 3.09 1.91.38.19.6.16.82-.1.22-.26.95-1.11 1.2-1.49.25-.38.51-.32.86-.19.35.13 2.22 1.05 2.6 1.24.38.19.63.29.73.45.09.16.09.94-.22 1.82z" />
      </svg>
    </a>
  );
};
