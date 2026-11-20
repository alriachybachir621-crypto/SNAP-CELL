import React from 'react';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { getLocalized, UI_COPY } from '../data/i18n';
import { Language, Product } from '../types';
import { SmartImage } from './SmartImage';

interface WishlistDrawerProps {
  lang: Language;
  open: boolean;
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  lang,
  open,
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onOpenProduct,
  onClose,
}) => {
  if (!open) return null;

  const t = UI_COPY[lang].wishlist;
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md h-full bg-[#1C1C1C] border-s border-[#2E2E2E] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold text-white">{t.title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg bg-[#0B0B0B] border border-[#2C2C2C] flex items-center justify-center text-white hover:border-[#FFD600]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#9A9A9A]">{t.empty}</div>
          ) : (
            savedProducts.map((product) => {
              const name = getLocalized(lang, product.nameEn, product.nameAr);
              return (
                <div
                  key={product.id}
                  className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3 flex gap-3"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProduct(product);
                    }}
                    className="w-20 h-16 rounded-lg overflow-hidden bg-[#141414] shrink-0"
                  >
                    <SmartImage
                      src={product.images[0]}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProduct(product);
                        }}
                        className="text-start min-w-0"
                      >
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        <p className="text-sm font-extrabold text-[#FFD600] tabular-nums">
                          ${product.price.toLocaleString()}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product.id)}
                        aria-label="Remove from wishlist"
                        className="text-[#9A9A9A] hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => onQuickAdd(product)}
                        className="px-3 py-1.5 rounded-lg bg-[#FFD600] text-[#0B0B0B] font-bold text-xs inline-flex items-center gap-1.5 hover:brightness-95 disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t.moveToCart}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};
