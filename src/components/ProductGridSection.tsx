import React, { useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, X } from 'lucide-react';
import { getLocalized, UI_COPY } from '../data/i18n';
import { Category, Language, Product } from '../types';
import { SmartImage } from './SmartImage';

type PriceFilter = 'all' | 'under50' | '50to250' | '250plus';

interface ProductGridSectionProps {
  lang: Language;
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  lang,
  products,
  categories,
  activeCategory,
  onSelectCategory,
  wishlistIds,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
}) => {
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const t = UI_COPY[lang].products;

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (inStockOnly && !p.inStock) return false;

      if (priceFilter === 'under50' && p.price >= 50) return false;
      if (priceFilter === '50to250' && (p.price < 50 || p.price > 250)) return false;
      if (priceFilter === '250plus' && p.price <= 250) return false;

      if (q) {
        const hay = `${p.nameEn} ${p.nameAr} ${p.brand} ${p.category} ${p.descriptionEn ?? ''} ${p.descriptionAr ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, activeCategory, inStockOnly, priceFilter, search]);

  const resetFilters = () => {
    setSearch('');
    setPriceFilter('all');
    setInStockOnly(false);
    onSelectCategory('all');
  };

  const priceOptions: { key: PriceFilter; label: string }[] = [
    { key: 'all', label: t.priceAll },
    { key: 'under50', label: t.priceUnder50 },
    { key: '50to250', label: t.price50to250 },
    { key: '250plus', label: t.price250Plus },
  ];

  return (
    <section id="products" className="py-12 sm:py-16 border-b border-[#1D1D1D] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading + Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] mt-1">{t.subheading}</p>
          </div>
          <p className="text-sm font-semibold text-[#9A9A9A] tabular-nums">
            {filteredProducts.length} {t.resultsCount}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9A9A9A] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-11 ps-10 pe-9 rounded-xl bg-[#0B0B0B] border border-[#2F2F2F] focus:border-[#FFD600] text-sm text-white placeholder:text-[#9A9A9A] outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-[#9A9A9A] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0B0B] p-1 rounded-xl border border-[#2A2A2A]">
              {priceOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPriceFilter(opt.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                    priceFilter === opt.key
                      ? 'bg-[#FFD600] text-[#0B0B0B]'
                      : 'text-[#9A9A9A] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs & Stock Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#FFD600] text-[#0B0B0B]'
                    : 'bg-[#0B0B0B] text-[#9A9A9A] border border-[#2A2A2A] hover:text-white'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => {
                const label = getLocalized(lang, cat.nameEn, cat.nameAr);
                const active = activeCategory === cat.key;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.key)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#FFD600] text-[#0B0B0B]'
                        : 'bg-[#0B0B0B] text-[#9A9A9A] border border-[#2A2A2A] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setInStockOnly((v) => !v)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border whitespace-nowrap shrink-0 transition-colors ${
                inStockOnly
                  ? 'bg-[#FFD600]/15 border-[#FFD600] text-[#FFD600]'
                  : 'bg-[#0B0B0B] border-[#2A2A2A] text-[#9A9A9A] hover:text-white'
              }`}
            >
              {t.inStockOnly}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-10 text-center space-y-4">
            <p className="text-[#9A9A9A] text-base">{t.empty}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-bold text-sm hover:brightness-95 transition-transform active:scale-[0.98]"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const name = getLocalized(lang, product.nameEn, product.nameAr);
              const isWishlisted = wishlistIds.includes(product.id);

              const badgeParts: string[] = [];
              if (product.isNew) badgeParts.push(t.conditionNew);
              else if (product.condition === 'used') badgeParts.push(t.conditionUsed);
              if (product.isSale) badgeParts.push(t.badgeSale);

              return (
                <article
                  key={product.id}
                  className="group bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD600]/70 rounded-2xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5"
                >
                  {/* Visual Slot (4:3 uniform aspect) */}
                  <div className="relative aspect-[4/3] bg-[#131313] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(product)}
                      className="w-full h-full block text-start focus:outline-none"
                    >
                      <SmartImage
                        src={product.images[0]}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        fallbackLabel={name}
                      />
                    </button>

                    {/* Top corner wishlist button */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isWishlisted ? t.wishlistRemoved : t.wishlistAdded}
                      className={`absolute top-3 end-3 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors active:scale-95 ${
                        isWishlisted
                          ? 'bg-[#FFD600] border-[#FFD600] text-[#0B0B0B]'
                          : 'bg-[#0B0B0B]/80 border-[#333333] text-white hover:border-[#FFD600]'
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isWishlisted ? 'currentColor' : 'none'}
                      />
                    </button>

                    {/* Subtle single status bar on bottom-start when Sold out or Sale */}
                    {!product.inStock && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 py-1.5 px-3 text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                          {t.soldOut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      {/* Clean Unboxed Metadata Line (Zero Pill Spam) */}
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                        <span className="text-[#9A9A9A] uppercase tracking-wider truncate">
                          {product.brand || product.category}
                          {badgeParts.length > 0 && ` · ${badgeParts.join(' / ')}`}
                        </span>
                        <span
                          className={`shrink-0 ${
                            product.inStock ? 'text-[#FFD600]' : 'text-[#9A9A9A]'
                          }`}
                        >
                          {product.inStock ? t.available : t.soldOut}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="text-start block w-full"
                      >
                        <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#FFD600] transition-colors line-clamp-2">
                          {name}
                        </h3>
                      </button>
                    </div>

                    {/* Price Baseline + Action */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#282828]">
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-xl font-extrabold text-[#FFD600]">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-sm text-[#9A9A9A] line-through">
                            ${product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!product.inStock}
                          onClick={() => onQuickAdd(product)}
                          className="h-10 px-4 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 hover:brightness-95 transition-transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
