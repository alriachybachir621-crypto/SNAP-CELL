import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getLocalized, UI_COPY } from '../data/i18n';
import { Category, Language } from '../types';
import { SmartImage } from './SmartImage';

interface CategoriesSectionProps {
  lang: Language;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  lang,
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const t = UI_COPY[lang].categories;

  const handlePick = (key: string) => {
    onSelectCategory(key);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-12 sm:py-16 border-b border-[#1D1D1D] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">{t.subheading}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const name = getLocalized(lang, cat.nameEn, cat.nameAr);
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handlePick(cat.key)}
                className={`group relative rounded-2xl overflow-hidden bg-[#1C1C1C] border text-start transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#FFD600] ring-1 ring-[#FFD600]/40'
                    : 'border-[#2A2A2A] hover:border-[#FFD600]/70'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#141414]">
                  <SmartImage
                    src={cat.image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackLabel={name}
                  />
                </div>
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2 bg-[#1C1C1C]">
                  <span className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#FFD600] transition-colors truncate">
                    {name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#FFD600] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
