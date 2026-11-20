import React, { useState } from 'react';
import { MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { buildWhatsappUrl, getLocalized, UI_COPY } from '../data/i18n';
import { CartItem, Language } from '../types';
import { SmartImage } from './SmartImage';

interface CartDrawerProps {
  lang: Language;
  open: boolean;
  items: CartItem[];
  whatsappNumber: string;
  onUpdateQty: (productId: string, option: string, delta: number) => void;
  onRemoveItem: (productId: string, option: string) => void;
  onClearCart: () => void;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  lang,
  open,
  items,
  whatsappNumber,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onClose,
}) => {
  const [customerNote, setCustomerNote] = useState('');

  if (!open) return null;

  const t = UI_COPY[lang].cart;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const buildOrderMessage = () => {
    const header =
      lang === 'ar'
        ? 'مرحباً SNAP CELL! أود تأكيد الطلب التالي:'
        : 'Hello SNAP CELL! I would like to place this order:';
    const lines = items.map((item, idx) => {
      const name = getLocalized(lang, item.nameEn, item.nameAr);
      const opt = item.option ? ` (${item.option})` : '';
      return `${idx + 1}. ${name}${opt} × ${item.quantity} = $${(
        item.price * item.quantity
      ).toLocaleString()}`;
    });
    const totalLine =
      lang === 'ar'
        ? `المجموع الكلي: $${subtotal.toLocaleString()}`
        : `Total: $${subtotal.toLocaleString()}`;
    const noteLine = customerNote.trim()
      ? lang === 'ar'
        ? `ملاحظة العميل: ${customerNote.trim()}`
        : `Customer note: ${customerNote.trim()}`
      : '';

    return [header, '', ...lines, '', totalLine, noteLine].filter(Boolean).join('\n');
  };

  const whatsappUrl = buildWhatsappUrl(whatsappNumber, buildOrderMessage());

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
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs font-bold text-[#9A9A9A] hover:text-[#FFD600] px-2 py-1"
              >
                {t.clear}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-lg bg-[#0B0B0B] border border-[#2C2C2C] flex items-center justify-center text-white hover:border-[#FFD600]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#9A9A9A]">{t.empty}</div>
          ) : (
            items.map((item) => {
              const name = getLocalized(lang, item.nameEn, item.nameAr);
              return (
                <div
                  key={`${item.productId}::${item.option}`}
                  className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3 flex gap-3"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#141414] shrink-0">
                    <SmartImage src={item.image} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        {item.option && (
                          <p className="text-xs text-[#9A9A9A] truncate">{item.option}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.option)}
                        aria-label="Remove item"
                        className="text-[#9A9A9A] hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-extrabold text-[#FFD600] tabular-nums">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2 bg-[#1C1C1C] border border-[#2C2C2C] rounded-lg px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.option, -1)}
                          aria-label="Decrease quantity"
                          className="w-6 h-6 flex items-center justify-center text-white hover:text-[#FFD600]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white tabular-nums min-w-[18px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.option, 1)}
                          aria-label="Increase quantity"
                          className="w-6 h-6 flex items-center justify-center text-white hover:text-[#FFD600]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#2A2A2A] bg-[#161616] space-y-4">
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder={t.customerNote}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0B0B0B] border border-[#2F2F2F] focus:border-[#FFD600] text-sm text-white placeholder:text-[#9A9A9A] outline-none"
            />

            <div className="flex items-center justify-between text-base font-extrabold">
              <span className="text-[#9A9A9A]">{t.subtotal}</span>
              <span className="text-2xl text-[#FFD600] tabular-nums">
                ${subtotal.toLocaleString()}
              </span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-xl bg-[#FFD600] text-[#0B0B0B] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-95 transition-transform active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.sendOrder}</span>
            </a>
          </div>
        )}
      </aside>
    </div>
  );
};
