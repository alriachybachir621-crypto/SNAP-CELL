import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { Language, Product } from '../types';
import { SmartImage } from './SmartImage';

interface PerfumeCornerSectionProps {
  lang: Language;
  products: Product[];
  whatsappNumber: string;
  onOpenProduct: (product: Product) => void;
}

export const PerfumeCornerSection: React.FC<PerfumeCornerSectionProps> = ({
  lang,
  products,
  whatsappNumber,
  onOpenProduct,
}) => {
  const t = UI_COPY[lang].perfumes;
  const perfumes = products.filter((p) => p.category === 'perfumes');

  if (perfumes.length === 0) return null;

  return (
    <section
      id="perfumes"
      className="py-12 sm:py-16 border-b border-[#1D1D1D] bg-gradient-to-b from-[#11100B] to-[#0B0B0B]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8 space-y-1.5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#FFD600]">
            {t.kicker}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#9A9A9A]">{t.subheading}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfumes.map((perfume) => {
            const name = getLocalized(lang, perfume.nameEn, perfume.nameAr);
            const sizeLabel = perfume.size || perfume.options[0] || '100ml';
            const askMsg =
              lang === 'ar'
                ? `مرحباً SNAP CELL! بدي استفسر عن عطر:\n• ${name} (${perfume.brand})\n• الحجم: ${sizeLabel}\n• السعر: $${perfume.price}`
                : `Hello SNAP CELL! I want to ask about this perfume:\n• ${name} (${perfume.brand})\n• Size: ${sizeLabel}\n• Price: $${perfume.price}`;
            const waUrl = buildWhatsappUrl(whatsappNumber, askMsg);

            return (
              <div
                key={perfume.id}
                className="bg-[#1C1C1C] border border-[#2D291C] hover:border-[#FFD600] rounded-2xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5"
              >
                <button
                  type="button"
                  onClick={() => onOpenProduct(perfume)}
                  className="aspect-[4/3] w-full bg-[#13120D] overflow-hidden block text-start"
                >
                  <SmartImage
                    src={perfume.images[0]}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    fallbackLabel={name}
                  />
                </button>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                      {perfume.brand} · {sizeLabel}
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenProduct(perfume)}
                      className="text-start block"
                    >
                      <h3 className="font-display text-lg font-extrabold text-white hover:text-[#FFD600] transition-colors">
                        {name}
                      </h3>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2A2820]">
                    <span className="text-2xl font-extrabold text-[#FFD600] tabular-nums">
                      ${perfume.price}
                    </span>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 hover:brightness-95 transition-transform active:scale-[0.98] whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.askWhatsapp}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
