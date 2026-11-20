import React from 'react';
import { ArrowRight, ArrowLeft, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { Language, ShopSettings } from '../types';
import { SmartImage } from './SmartImage';
import { SnapCellLogo } from './SnapCellLogo';

interface HeroSectionProps {
  lang: Language;
  settings: ShopSettings;
  onFiveTapsLogo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  settings,
  onFiveTapsLogo,
}) => {
  const t = UI_COPY[lang].hero;
  const title = getLocalized(lang, settings.heroTitleEn, settings.heroTitleAr);
  const subtitle = getLocalized(lang, settings.heroSubtitleEn, settings.heroSubtitleAr);
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const whatsappQuickUrl = buildWhatsappUrl(
    settings.whatsappNumber,
    lang === 'ar'
      ? 'مرحباً SNAP CELL! بدي استفسر عن الأجهزة والعطور المتوفرة.'
      : 'Hello SNAP CELL! I would like to ask about your phones and perfumes.'
  );

  return (
    <section className="relative overflow-hidden border-b border-[#222222] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Brand Lockup, Bold Headline, Subtitle & Chunky CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-black border border-[#2B2B2B] inline-block">
                <SnapCellLogo size="hero" onFiveTaps={onFiveTapsLogo} />
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.08] text-white [text-wrap:balance]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-[#9A9A9A] max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-base hover:brightness-95 transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 shadow-[0_8px_28px_rgba(255,214,0,0.2)]"
              >
                <span>{t.shopNow}</span>
                <ArrowIcon className="w-5 h-5" strokeWidth={2.5} />
              </a>

              <a
                href={whatsappQuickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C1C1C] border border-[#303030] hover:border-[#FFD600] text-white font-bold text-base transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>{t.whatsappCta}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Replaceable Hero Showcase Visual */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full min-h-[260px] sm:min-h-[340px] lg:h-full rounded-2xl overflow-hidden bg-[#1C1C1C] border border-[#2B2B2B] group">
              <SmartImage
                src={settings.heroImage}
                alt="SNAP CELL Showcase"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                fallbackLabel="SNAP CELL"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFD600]">
                    {t.featuredLabel}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {t.trust2}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-[#FFD600] tabular-nums">
                  {settings.phoneDisplay}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Trust Strip */}
        <div className="mt-8 pt-6 border-t border-[#1F1F1F] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-[#FFD600] shrink-0" />
            <span>{t.trust1}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
            <MapPin className="w-4 h-4 text-[#FFD600] shrink-0" />
            <span>{t.trust2}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#9A9A9A]">
            <span className="w-1.5 h-1.5 bg-[#FFD600] rounded-xs shrink-0" />
            <span>{t.trust3}</span>
          </div>
          <a
            href={`tel:${settings.phoneDisplay.replace(/\s+/g, '')}`}
            className="flex items-center gap-2.5 text-sm font-bold text-[#FFD600] hover:underline tabular-nums"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span dir="ltr">{settings.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
