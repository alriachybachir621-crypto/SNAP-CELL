import React from 'react';
import {
  BatteryCharging,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { Language, ServiceItem } from '../types';

interface ServicesSectionProps {
  lang: Language;
  services: ServiceItem[];
  whatsappNumber: string;
}

function renderServiceIcon(iconName: string) {
  switch (iconName) {
    case 'refresh':
      return <RefreshCw className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
    case 'wrench':
      return <Wrench className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
    case 'shield':
      return <ShieldCheck className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
    case 'battery':
      return <BatteryCharging className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
    case 'sparkles':
      return <Sparkles className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
    case 'smartphone':
    default:
      return <Smartphone className="w-6 h-6 text-[#0B0B0B]" strokeWidth={2.25} />;
  }
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  services,
  whatsappNumber,
}) => {
  const t = UI_COPY[lang].services;

  return (
    <section id="services" className="py-12 sm:py-16 border-b border-[#1D1D1D] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">{t.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((svc) => {
            const title = getLocalized(lang, svc.titleEn, svc.titleAr);
            const desc = getLocalized(lang, svc.descriptionEn, svc.descriptionAr);
            const msg = getLocalized(
              lang,
              svc.whatsappMessageEn || `Hello SNAP CELL! I want to inquire about: ${svc.titleEn}`,
              svc.whatsappMessageAr || `مرحباً SNAP CELL! بدي استفسر عن خدمة: ${svc.titleAr}`
            );
            const waUrl = buildWhatsappUrl(whatsappNumber, msg);

            return (
              <div
                key={svc.id}
                className="bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD600]/70 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-150 hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD600] flex items-center justify-center">
                    {renderServiceIcon(svc.icon)}
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white">{title}</h3>
                  <p className="text-sm text-[#9A9A9A] leading-relaxed">{desc}</p>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#0B0B0B] border border-[#303030] hover:border-[#FFD600] hover:bg-[#FFD600] hover:text-[#0B0B0B] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.cta}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
