import { Language } from '../types';

export const UI_COPY = {
  en: {
    nav: {
      products: 'Products',
      services: 'Services',
      perfumes: 'Perfumes',
      gallery: 'Gallery',
      contact: 'Contact',
    },
    hero: {
      shopNow: 'Shop Now',
      whatsappCta: 'WhatsApp Us',
      trust1: 'Buy • Sell • Repair',
      trust2: 'Taalabaya, Zahle',
      trust3: 'Gulf Phones Specialist',
      featuredLabel: 'Featured Drop',
    },
    categories: {
      heading: 'Shop by Category',
      subheading: 'Curated tech, Gulf phones, fragrances & everyday essentials.',
      explore: 'Browse',
    },
    products: {
      heading: 'Catalog',
      subheading: 'New & inspected Gulf-spec phones, gear and accessories.',
      searchPlaceholder: 'Search phone, brand, perfume...',
      allCategories: 'All',
      priceAll: 'Any Price',
      priceUnder50: 'Under $50',
      price50to250: '$50 – $250',
      price250Plus: '$250+',
      inStockOnly: 'Available only',
      conditionNew: 'New',
      conditionUsed: 'Used',
      badgeSale: 'Sale',
      available: 'Available',
      soldOut: 'Sold out',
      empty: 'No matching items found. Try clearing your filters.',
      clearFilters: 'Reset filters',
      addToCart: 'Add to Cart',
      orderWhatsapp: 'Order on WhatsApp',
      selectOption: 'Select Option',
      wishlistAdded: 'Saved to wishlist',
      wishlistRemoved: 'Removed from wishlist',
      resultsCount: 'items',
    },
    services: {
      heading: 'Gulf Phone Services',
      subheading: 'Fair trade-in quotes, inspected used stock, and fast counter repair.',
      cta: 'Chat on WhatsApp',
    },
    perfumes: {
      kicker: 'Perfume Corner',
      heading: 'Custom Blends & Signature Scents',
      subheading:
        'Long-lasting Gulf oud, amber, and designer-inspired fragrances mixed fresh or sealed.',
      askWhatsapp: 'Ask on WhatsApp',
      viewDetails: 'Details',
    },
    gallery: {
      heading: 'Inside SNAP CELL',
      subheading: 'Latest arrivals, counter drops and customer picks from Taalabaya.',
      facebookBtn: 'Follow SNAP CELL on Facebook',
    },
    contact: {
      heading: 'Visit the Shop',
      subheading: 'Taalabaya, next to Sabra station — Zahle area, Lebanon.',
      phoneLabel: 'Phone & WhatsApp',
      addressLabel: 'Address',
      hoursLabel: 'Opening Hours',
      openMaps: 'Open in Google Maps',
      messageNow: 'Message on WhatsApp',
      rights: 'SNAP CELL. All rights reserved.',
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty. Add phones, accessories, or perfumes to order via WhatsApp.',
      subtotal: 'Total (USD)',
      customerNote: 'Your name or delivery note (optional)',
      sendOrder: 'Send Order on WhatsApp',
      clear: 'Clear',
      addedToast: 'Added to cart',
    },
    wishlist: {
      title: 'Saved Wishlist',
      empty: 'No saved items yet. Tap the heart on any product to keep track of it.',
      moveToCart: 'Add to Cart',
    },
    pinModal: {
      setupTitle: 'Set your 4-digit code',
      setupConfirmTitle: 'Confirm your 4-digit code',
      setupMismatch: 'Codes did not match. Try again.',
      unlockTitle: 'Enter 4-digit code',
      wrongCode: 'Wrong code',
      lockedTitle: 'Pad locked for 5 minutes',
      lockedWait: 'Try again in',
      clear: 'Clear',
      cancel: 'Close',
      providerHint:
        'Enable Email/Password sign-in in Firebase Console (Authentication -> Sign-in method) to activate this lock.',
    },
  },
  ar: {
    nav: {
      products: 'المنتجات',
      services: 'الخدمات',
      perfumes: 'العطور',
      gallery: 'المعرض',
      contact: 'تواصل معنا',
    },
    hero: {
      shopNow: 'تسوّق الآن',
      whatsappCta: 'تواصل واتساب',
      trust1: 'شراء • بيع • صيانة',
      trust2: 'تعلبايا، زحلة',
      trust3: 'اختصاص أجهزة خليجية',
      featuredLabel: 'تشكيلة مميزة',
    },
    categories: {
      heading: 'تسوّق حسب الفئة',
      subheading: 'أجهزة خليوية، إكسسوارات أصلية، عطور فاخرة وإكسسوارات يومية.',
      explore: 'تصفّح',
    },
    products: {
      heading: 'المنتجات',
      subheading: 'هواتف خليجية جديدة ومستعملة مفحوصة مع أحدث الإكسسوارات.',
      searchPlaceholder: 'ابحث عن هاتف، ماركة، عطر...',
      allCategories: 'الكل',
      priceAll: 'كل الأسعار',
      priceUnder50: 'أقل من $50',
      price50to250: '$50 – $250',
      price250Plus: '$250+',
      inStockOnly: 'المتوفر فقط',
      conditionNew: 'جديد',
      conditionUsed: 'مستعمل',
      badgeSale: 'تخفيض',
      available: 'متوفر',
      soldOut: 'نفد المخزون',
      empty: 'لم يتم العثور على منتجات مطابقة. جرّب إعادة ضبط الفلاتر.',
      clearFilters: 'إعادة ضبط',
      addToCart: 'أضف إلى السلة',
      orderWhatsapp: 'اطلب عبر واتساب',
      selectOption: 'اختر المواصفة',
      wishlistAdded: 'تمت الإضافة للمفضلة',
      wishlistRemoved: 'تمت الإزالة من المفضلة',
      resultsCount: 'منتج',
    },
    services: {
      heading: 'خدمات الهواتف الخليجية',
      subheading: 'تسعير فوري، أجهزة مستعملة مضمونة، وصيانة سريعة في المحل.',
      cta: 'تواصل عبر واتساب',
    },
    perfumes: {
      kicker: 'ركن العطور',
      heading: 'عطور مركّبة وروائح فاخرة',
      subheading: 'عود خليجي، عنبر، وعطور ثابتة وفواحة مركّبة خصيصاً أو أصلية.',
      askWhatsapp: 'استفسر عبر واتساب',
      viewDetails: 'التفاصيل',
    },
    gallery: {
      heading: 'من داخل SNAP CELL',
      subheading: 'أحدث الأجهزة والعروض مباشرة من محلنا في تعلبايا.',
      facebookBtn: 'تابع صفحة SNAP CELL على فيسبوك',
    },
    contact: {
      heading: 'زورونا في المحل',
      subheading: 'تعلبايا، جانب محطة صبرا — قضاء زحلة، لبنان.',
      phoneLabel: 'الهاتف والواتساب',
      addressLabel: 'العنوان',
      hoursLabel: 'ساعات العمل',
      openMaps: 'افتح في خرائط غوغل',
      messageNow: 'راسلنا على واتساب',
      rights: 'SNAP CELL. جميع الحقوق محفوظة.',
    },
    cart: {
      title: 'سلة المشتريات',
      empty: 'السلة فارغة حالياً. أضف منتجات لإرسال طلبك مباشرة عبر واتساب.',
      subtotal: 'المجموع (دولار)',
      customerNote: 'الاسم أو العنوان أو ملاحظة (اختياري)',
      sendOrder: 'أرسل الطلب عبر واتساب',
      clear: 'إفراغ',
      addedToast: 'تمت الإضافة إلى السلة',
    },
    wishlist: {
      title: 'قائمة المفضلة',
      empty: 'لا توجد منتجات محفوظة بعد. اضغط على أيقونة القلب لحفظ أي منتج.',
      moveToCart: 'أضف إلى السلة',
    },
    pinModal: {
      setupTitle: 'أنشئ رمزاً من ٤ أرقام',
      setupConfirmTitle: 'أكّد الرمز المكون من ٤ أرقام',
      setupMismatch: 'الرمزان غير متطابقين. حاول مرة أخرى.',
      unlockTitle: 'أدخل الرمز المكون من ٤ أرقام',
      wrongCode: 'الرمز غير صحيح',
      lockedTitle: 'تم قفل اللوحة لمدة ٥ دقائق',
      lockedWait: 'حاول مجدداً بعد',
      clear: 'مسح',
      cancel: 'إغلاق',
      providerHint:
        'يرجى تفعيل تسجيل الدخول بالبريد وكلمة المرور في Firebase Console لتفعيل القفل.',
    },
  },
} as const;

export function buildWhatsappUrl(whatsappNumber: string, message: string): string {
  const cleanNum = whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

export function getLocalized(
  lang: Language,
  en: string | undefined,
  ar: string | undefined
): string {
  if (lang === 'ar') return ar || en || '';
  return en || ar || '';
}
