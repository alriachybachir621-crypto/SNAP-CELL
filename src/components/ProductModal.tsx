import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { Language, Product } from '../types';
import { SmartImage } from './SmartImage';

interface ProductModalProps {
  lang: Language;
  product: Product | null;
  whatsappNumber: string;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, option: string) => void;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  lang,
  product,
  whatsappNumber,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onClose,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setSelectedOption(product.options[0] || '');
    }
  }, [product]);

  if (!product) return null;

  const t = UI_COPY[lang].products;
  const name = getLocalized(lang, product.nameEn, product.nameAr);
  const description = getLocalized(lang, product.descriptionEn, product.descriptionAr);
  const images = product.images.length > 0 ? product.images : [''];
  const activeImg = images[selectedImageIdx] || images[0];

  const conditionText =
    product.condition === 'used' ? t.conditionUsed : t.conditionNew;

  const whatsappText =
    lang === 'ar'
      ? `مرحباً SNAP CELL! أرغب بطلب:\n• المنتج: ${name}${
          selectedOption ? `\n• الخيار: ${selectedOption}` : ''
        }\n• السعر: $${product.price}`
      : `Hello SNAP CELL! I want to order:\n• Product: ${name}${
          selectedOption ? `\n• Option: ${selectedOption}` : ''
        }\n• Price: $${product.price}`;

  const whatsappUrl = buildWhatsappUrl(whatsappNumber, whatsappText);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#1C1C1C] border border-[#2E2E2E] rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#1C1C1C]/95 backdrop-blur border-b border-[#2A2A2A]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
            {product.brand} · {conditionText}
            {product.size ? ` · ${product.size}` : ''}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg bg-[#0B0B0B] border border-[#2C2C2C] flex items-center justify-center text-white hover:border-[#FFD600]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#121212] border border-[#2A2A2A]">
              <SmartImage
                src={activeImg}
                alt={name}
                className="w-full h-full object-cover"
                fallbackLabel={name}
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border shrink-0 transition-colors ${
                      selectedImageIdx === idx
                        ? 'border-[#FFD600]'
                        : 'border-[#2E2E2E] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SmartImage
                      src={img}
                      alt={`${name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contiguous Purchase Module */}
          <div className="flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    product.inStock ? 'text-[#FFD600]' : 'text-[#9A9A9A]'
                  }`}
                >
                  {product.inStock ? t.available : t.soldOut}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-[#FFD600] text-[#0B0B0B] border-[#FFD600]'
                      : 'bg-[#0B0B0B] text-white border-[#2E2E2E] hover:border-[#FFD600]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
                  <span>{isWishlisted ? t.wishlistAdded : t.wishlistAdded.split(' ')[0]}</span>
                </button>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-white leading-snug">
                {name}
              </h3>

              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-3xl font-extrabold text-[#FFD600]">
                  ${product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-base text-[#9A9A9A] line-through">
                    ${product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {description && (
                <p className="text-sm text-[#9A9A9A] leading-relaxed">{description}</p>
              )}

              {/* Variant / Option Selector */}
              {product.options.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                    {t.selectOption}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          selectedOption === opt
                            ? 'bg-[#FFD600] text-[#0B0B0B] border-[#FFD600]'
                            : 'bg-[#0B0B0B] text-white border-[#2F2F2F] hover:border-[#FFD600]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-[#2A2A2A]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-95 transition-transform active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.orderWhatsapp}</span>
              </a>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  onAddToCart(product, selectedOption);
                  onClose();
                }}
                className="w-full py-3 px-5 rounded-xl bg-[#0B0B0B] border border-[#303030] hover:border-[#FFD600] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFD600]" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
