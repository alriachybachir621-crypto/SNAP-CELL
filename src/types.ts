export type Language = 'en' | 'ar';

export type ProductCondition = 'new' | 'used';

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  condition: ProductCondition;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  size?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  options: string[];
  images: string[];
  order: number;
}

export interface Category {
  id: string;
  key: string;
  nameEn: string;
  nameAr: string;
  image: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  whatsappMessageEn: string;
  whatsappMessageAr: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  image: string;
  order: number;
}

export interface ShopSettings {
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  heroImage: string;
  phoneDisplay: string;
  whatsappNumber: string;
  addressEn: string;
  addressAr: string;
  hoursEn: string;
  hoursAr: string;
  mapsLink: string;
  mapsEmbedUrl: string;
  facebookUrl: string;
}

export interface CartItem {
  productId: string;
  nameEn: string;
  nameAr: string;
  brand: string;
  price: number;
  option: string;
  image: string;
  quantity: number;
}
