import React, { useState } from 'react';
import { Globe, Heart, Menu, ShoppingBag, X } from 'lucide-react';
import { UI_COPY } from '../data/i18n';
import { Language } from '../types';
import { SnapCellLogo } from './SnapCellLogo';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onFiveTapsLogo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onFiveTapsLogo,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = UI_COPY[lang].nav;

  const navLinks = [
    { href: '#products', label: t.products },
    { href: '#services', label: t.services },
    { href: '#perfumes', label: t.perfumes },
    { href: '#gallery', label: t.gallery },
    { href: '#contact', label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark Logo */}
        <div className="flex items-center shrink-0">
          <SnapCellLogo size="nav" onFiveTaps={onFiveTapsLogo} />
        </div>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#9A9A9A]">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#FFD600] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#FFD600]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Compact Storefront Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Switch Language"
            className="h-10 px-3 rounded-lg bg-[#1C1C1C] border border-[#2C2C2C] hover:border-[#FFD600] text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors active:scale-[0.98]"
          >
            <Globe className="w-3.5 h-3.5 text-[#FFD600]" />
            <span>{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label="Wishlist"
            className="relative h-10 w-10 rounded-lg bg-[#1C1C1C] border border-[#2C2C2C] hover:border-[#FFD600] flex items-center justify-center text-white transition-colors active:scale-[0.98]"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFD600] text-[#0B0B0B] text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Cart"
            className="relative h-10 px-3 sm:px-4 rounded-lg bg-[#FFD600] text-[#0B0B0B] font-extrabold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:brightness-95 transition-transform active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2.25} />
            <span className="tabular-nums">{cartCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menu"
            className="lg:hidden h-10 w-10 rounded-lg bg-[#1C1C1C] border border-[#2C2C2C] flex items-center justify-center text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-[#222222] bg-[#0B0B0B] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-lg text-sm font-semibold text-white hover:bg-[#1C1C1C] hover:text-[#FFD600] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
