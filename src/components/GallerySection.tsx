import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getLocalized, UI_COPY } from '../data/i18n';
import { GalleryItem, Language, ShopSettings } from '../types';
import { SmartImage } from './SmartImage';

interface GallerySectionProps {
  lang: Language;
  items: GalleryItem[];
  settings: ShopSettings;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  lang,
  items,
  settings,
}) => {
  const t = UI_COPY[lang].gallery;

  return (
    <section id="gallery" className="py-12 sm:py-16 border-b border-[#1D1D1D] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">{t.subheading}</p>
          </div>

          <a
            href={settings.facebookUrl || 'https://www.facebook.com/search/top?q=SNAP%20CELL'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1C1C1C] border border-[#2F2F2F] hover:border-[#FFD600] text-white font-bold text-sm transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4 text-[#FFD600]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
            </svg>
            <span>{t.facebookBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#9A9A9A]" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const title = getLocalized(lang, item.titleEn, item.titleAr);
            return (
              <div
                key={item.id}
                className="group bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] w-full bg-[#131313] overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackLabel={title}
                  />
                </div>
                {title && (
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white line-clamp-2">{title}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
