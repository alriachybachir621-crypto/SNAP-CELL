import React from 'react';
import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { Language, ShopSettings } from '../types';
import { SnapCellLogo } from './SnapCellLogo';

interface ContactFooterProps {
  lang: Language;
  settings: ShopSettings;
  onFiveTapsLogo: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  lang,
  settings,
  onFiveTapsLogo,
}) => {
  const t = UI_COPY[lang].contact;
  const nav = UI_COPY[lang].nav;

  const address = getLocalized(lang, settings.addressEn, settings.addressAr);
  const hours = getLocalized(lang, settings.hoursEn, settings.hoursAr);
  const waUrl = buildWhatsappUrl(
    settings.whatsappNumber,
    lang === 'ar'
      ? 'مرحباً SNAP CELL! بدي أتواصل معكم.'
      : 'Hello SNAP CELL! I have a question.'
  );

  return (
    <>
      <section id="contact" className="py-12 sm:py-16 bg-[#0B0B0B] border-b border-[#1D1D1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">{t.subheading}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Contact Info Card */}
            <div className="lg:col-span-5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-[#0B0B0B] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                      {t.phoneLabel}
                    </p>
                    <a
                      href={`tel:${settings.phoneDisplay.replace(/\s+/g, '')}`}
                      dir="ltr"
                      className="text-lg font-extrabold text-white hover:text-[#FFD600] tabular-nums transition-colors"
                    >
                      {settings.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-[#0B0B0B] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                      {t.addressLabel}
                    </p>
                    <p className="text-base font-semibold text-white mt-0.5">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-[#0B0B0B] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                      {t.hoursLabel}
                    </p>
                    <p className="text-base font-semibold text-white mt-0.5">{hours}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2A2A2A]">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-95 transition-transform active:scale-[0.98] whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.messageNow}</span>
                </a>
                <a
                  href={settings.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0B0B0B] border border-[#303030] hover:border-[#FFD600] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4 text-[#FFD600]" />
                  <span>{t.openMaps}</span>
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#1C1C1C] border border-[#2A2A2A] min-h-[300px]">
              <iframe
                title="SNAP CELL Location Map"
                src={settings.mapsEmbedUrl}
                className="w-full h-full min-h-[300px] border-0 grayscale contrast-125 invert-[0.9] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0B0B] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <SnapCellLogo size="footer" onFiveTaps={onFiveTapsLogo} />
            <span className="text-xs text-[#9A9A9A]">{address}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-[#9A9A9A]">
            <a href="#products" className="hover:text-[#FFD600] transition-colors">
              {nav.products}
            </a>
            <a href="#services" className="hover:text-[#FFD600] transition-colors">
              {nav.services}
            </a>
            <a href="#perfumes" className="hover:text-[#FFD600] transition-colors">
              {nav.perfumes}
            </a>
            <a href="#gallery" className="hover:text-[#FFD600] transition-colors">
              {nav.gallery}
            </a>
            <a href="#contact" className="hover:text-[#FFD600] transition-colors">
              {nav.contact}
            </a>
          </div>

          <p className="text-xs text-[#9A9A9A]">
            © {new Date().getFullYear()} {t.rights}
          </p>
        </div>
      </footer>
    </>
  );
};
