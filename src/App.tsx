import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { CartDrawer } from './components/CartDrawer';
import { CategoriesSection } from './components/CategoriesSection';
import { ContactFooter } from './components/ContactFooter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { ManagerPanel } from './components/ManagerPanel';
import { Navbar } from './components/Navbar';
import { PerfumeCornerSection } from './components/PerfumeCornerSection';
import { PinModal } from './components/PinModal';
import { ProductGridSection } from './components/ProductGridSection';
import { ProductModal } from './components/ProductModal';
import { ServicesSection } from './components/ServicesSection';
import { WishlistDrawer } from './components/WishlistDrawer';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_GALLERY,
  DEFAULT_PRODUCTS,
  DEFAULT_SERVICES,
  DEFAULT_SHOP_SETTINGS,
} from './data/defaults';
import { UI_COPY } from './data/i18n';
import { ADMIN_EMAIL, auth } from './firebase';
import {
  subscribeCategories,
  subscribeGallery,
  subscribeProducts,
  subscribeServices,
  subscribeSetupMeta,
  subscribeShopSettings,
} from './services/firestoreService';
import {
  CartItem,
  Category,
  GalleryItem,
  Language,
  Product,
  ServiceItem,
  ShopSettings,
} from './types';

const CART_KEY = 'snapcell_cart_v1';
const WISHLIST_KEY = 'snapcell_wishlist_v1';
const LANG_KEY = 'snapcell_lang_v1';

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = readStoredJson<string>(LANG_KEY, 'en');
    return saved === 'ar' ? 'ar' : 'en';
  });

  // Storefront data backed by real-time Firestore with rich defaults if cloud is empty
  const [cloudProducts, setCloudProducts] = useState<Product[]>([]);
  const [cloudCategories, setCloudCategories] = useState<Category[]>([]);
  const [cloudServices, setCloudServices] = useState<ServiceItem[]>([]);
  const [cloudGallery, setCloudGallery] = useState<GalleryItem[]>([]);
  const [cloudSettings, setCloudSettings] = useState<ShopSettings | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isManagerSignedIn, setIsManagerSignedIn] = useState(false);

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => readStoredJson<CartItem[]>(CART_KEY, []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStoredJson<string[]>(WISHLIST_KEY, [])
  );

  // Sync HTML dir & lang attributes for full RTL support
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(LANG_KEY, JSON.stringify(lang));
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Auth listener
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsManagerSignedIn(Boolean(user && user.email === ADMIN_EMAIL));
    });
  }, []);

  // Firestore real-time subscriptions
  useEffect(() => {
    const unsubs = [
      subscribeProducts(setCloudProducts),
      subscribeCategories(setCloudCategories),
      subscribeServices(setCloudServices),
      subscribeGallery(setCloudGallery),
      subscribeShopSettings(setCloudSettings),
      subscribeSetupMeta(setSetupComplete),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const products = cloudProducts.length > 0 ? cloudProducts : DEFAULT_PRODUCTS;
  const categories = cloudCategories.length > 0 ? cloudCategories : DEFAULT_CATEGORIES;
  const services = cloudServices.length > 0 ? cloudServices : DEFAULT_SERVICES;
  const gallery = cloudGallery.length > 0 ? cloudGallery : DEFAULT_GALLERY;
  const settings = cloudSettings || DEFAULT_SHOP_SETTINGS;
  const hasFirestoreData =
    cloudProducts.length > 0 || cloudCategories.length > 0 || cloudSettings !== null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 2200);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      showToast(
        exists
          ? UI_COPY[lang].products.wishlistRemoved
          : UI_COPY[lang].products.wishlistAdded
      );
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const handleAddToCart = (product: Product, option = '') => {
    const chosenOption = option || product.options[0] || '';
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.option === chosenOption
      );
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          brand: product.brand,
          price: product.price,
          option: chosenOption,
          image: product.images[0] || '',
          quantity: 1,
        },
      ];
    });
    showToast(UI_COPY[lang].cart.addedToast);
  };

  const handleUpdateCartQty = (productId: string, option: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.option === option
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, option: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.option === option))
    );
  };

  const handleFiveTapsLogo = () => {
    if (isManagerSignedIn) {
      setManagerOpen(true);
    } else {
      setPinModalOpen(true);
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col">
        <Navbar
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
          cartCount={totalCartItems}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setCartOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onFiveTapsLogo={handleFiveTapsLogo}
        />

        <main className="flex-1">
          <HeroSection
            lang={lang}
            settings={settings}
            onFiveTapsLogo={handleFiveTapsLogo}
          />

          <CategoriesSection
            lang={lang}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <ProductGridSection
            lang={lang}
            products={products}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={setSelectedProduct}
            onQuickAdd={(prod) => handleAddToCart(prod)}
          />

          <ServicesSection
            lang={lang}
            services={services}
            whatsappNumber={settings.whatsappNumber}
          />

          <PerfumeCornerSection
            lang={lang}
            products={products}
            whatsappNumber={settings.whatsappNumber}
            onOpenProduct={setSelectedProduct}
          />

          <GallerySection lang={lang} items={gallery} settings={settings} />
        </main>

        <ContactFooter
          lang={lang}
          settings={settings}
          onFiveTapsLogo={handleFiveTapsLogo}
        />

        <FloatingWhatsApp lang={lang} whatsappNumber={settings.whatsappNumber} />

        <ProductModal
          lang={lang}
          product={selectedProduct}
          whatsappNumber={settings.whatsappNumber}
          isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />

        <CartDrawer
          lang={lang}
          open={cartOpen}
          items={cart}
          whatsappNumber={settings.whatsappNumber}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={() => setCart([])}
          onClose={() => setCartOpen(false)}
        />

        <WishlistDrawer
          lang={lang}
          open={wishlistOpen}
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickAdd={(prod) => handleAddToCart(prod)}
          onOpenProduct={setSelectedProduct}
          onClose={() => setWishlistOpen(false)}
        />

        <PinModal
          lang={lang}
          open={pinModalOpen}
          setupComplete={setupComplete}
          onSuccess={() => {
            setPinModalOpen(false);
            setManagerOpen(true);
          }}
          onClose={() => setPinModalOpen(false)}
        />

        <ManagerPanel
          open={managerOpen}
          products={products}
          categories={categories}
          services={services}
          gallery={gallery}
          settings={settings}
          hasFirestoreData={hasFirestoreData}
          onClose={() => setManagerOpen(false)}
        />

        {/* Subtle Non-Intrusive Toast Feedback */}
        {toastMsg && (
          <div className="fixed bottom-20 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#FFD600] text-[#0B0B0B] text-xs sm:text-sm font-extrabold shadow-xl pointer-events-none">
            {toastMsg}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
