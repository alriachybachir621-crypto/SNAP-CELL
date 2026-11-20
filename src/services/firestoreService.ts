import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_GALLERY,
  DEFAULT_PRODUCTS,
  DEFAULT_SERVICES,
  DEFAULT_SHOP_SETTINGS,
} from '../data/defaults';
import { db, handleFirestoreError, OperationType, storage } from '../firebase';
import { Category, GalleryItem, Product, ServiceItem, ShopSettings } from '../types';

export function subscribeProducts(cb: (items: Product[]) => void): () => void {
  const path = 'products';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: Product[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nameEn: String(data.nameEn ?? ''),
          nameAr: String(data.nameAr ?? ''),
          brand: String(data.brand ?? ''),
          category: String(data.category ?? 'phones'),
          price: Number(data.price ?? 0),
          oldPrice: data.oldPrice != null ? Number(data.oldPrice) : null,
          condition: data.condition === 'used' ? 'used' : 'new',
          inStock: Boolean(data.inStock),
          isNew: Boolean(data.isNew),
          isSale: Boolean(data.isSale),
          size: data.size ? String(data.size) : '',
          descriptionEn: data.descriptionEn ? String(data.descriptionEn) : '',
          descriptionAr: data.descriptionAr ? String(data.descriptionAr) : '',
          options: Array.isArray(data.options) ? data.options.map(String) : [],
          images: Array.isArray(data.images) ? data.images.map(String) : [],
          order: Number(data.order ?? 0),
        };
      });
      cb(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeCategories(cb: (items: Category[]) => void): () => void {
  const path = 'categories';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: Category[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          key: String(data.key ?? d.id),
          nameEn: String(data.nameEn ?? ''),
          nameAr: String(data.nameAr ?? ''),
          image: String(data.image ?? ''),
          order: Number(data.order ?? 0),
        };
      });
      cb(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeServices(cb: (items: ServiceItem[]) => void): () => void {
  const path = 'services';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: ServiceItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          titleEn: String(data.titleEn ?? ''),
          titleAr: String(data.titleAr ?? ''),
          descriptionEn: String(data.descriptionEn ?? ''),
          descriptionAr: String(data.descriptionAr ?? ''),
          icon: String(data.icon ?? 'smartphone'),
          whatsappMessageEn: String(data.whatsappMessageEn ?? ''),
          whatsappMessageAr: String(data.whatsappMessageAr ?? ''),
          order: Number(data.order ?? 0),
        };
      });
      cb(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeGallery(cb: (items: GalleryItem[]) => void): () => void {
  const path = 'gallery';
  const q = query(collection(db, path), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: GalleryItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          titleEn: String(data.titleEn ?? ''),
          titleAr: String(data.titleAr ?? ''),
          image: String(data.image ?? ''),
          order: Number(data.order ?? 0),
        };
      });
      cb(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeShopSettings(cb: (settings: ShopSettings | null) => void): () => void {
  const path = 'shopSettings/main';
  return onSnapshot(
    doc(db, 'shopSettings', 'main'),
    (snap) => {
      if (!snap.exists()) {
        cb(null);
        return;
      }
      const data = snap.data();
      cb({
        heroTitleEn: String(data.heroTitleEn ?? DEFAULT_SHOP_SETTINGS.heroTitleEn),
        heroTitleAr: String(data.heroTitleAr ?? DEFAULT_SHOP_SETTINGS.heroTitleAr),
        heroSubtitleEn: String(data.heroSubtitleEn ?? DEFAULT_SHOP_SETTINGS.heroSubtitleEn),
        heroSubtitleAr: String(data.heroSubtitleAr ?? DEFAULT_SHOP_SETTINGS.heroSubtitleAr),
        heroImage: String(data.heroImage ?? DEFAULT_SHOP_SETTINGS.heroImage),
        phoneDisplay: String(data.phoneDisplay ?? DEFAULT_SHOP_SETTINGS.phoneDisplay),
        whatsappNumber: String(data.whatsappNumber ?? DEFAULT_SHOP_SETTINGS.whatsappNumber),
        addressEn: String(data.addressEn ?? DEFAULT_SHOP_SETTINGS.addressEn),
        addressAr: String(data.addressAr ?? DEFAULT_SHOP_SETTINGS.addressAr),
        hoursEn: String(data.hoursEn ?? DEFAULT_SHOP_SETTINGS.hoursEn),
        hoursAr: String(data.hoursAr ?? DEFAULT_SHOP_SETTINGS.hoursAr),
        mapsLink: String(data.mapsLink ?? DEFAULT_SHOP_SETTINGS.mapsLink),
        mapsEmbedUrl: String(data.mapsEmbedUrl ?? DEFAULT_SHOP_SETTINGS.mapsEmbedUrl),
        facebookUrl: String(data.facebookUrl ?? DEFAULT_SHOP_SETTINGS.facebookUrl),
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeSetupMeta(cb: (setupComplete: boolean) => void): () => void {
  const path = 'appMeta/setup';
  return onSnapshot(
    doc(db, 'appMeta', 'setup'),
    (snap) => {
      cb(Boolean(snap.exists() && snap.data()?.setupComplete === true));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function markSetupComplete(): Promise<void> {
  const path = 'appMeta/setup';
  try {
    await setDoc(doc(db, 'appMeta', 'setup'), {
      setupComplete: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function sanitizeId(raw: string, fallbackPrefix: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || `${fallbackPrefix}-${Date.now()}`;
}

export async function saveProduct(product: Product): Promise<void> {
  const id = sanitizeId(product.id, 'prod');
  const path = `products/${id}`;
  try {
    await setDoc(doc(db, 'products', id), {
      nameEn: product.nameEn.trim().slice(0, 140),
      nameAr: product.nameAr.trim().slice(0, 140),
      brand: product.brand.trim().slice(0, 80),
      category: product.category.trim().slice(0, 60),
      price: Math.max(0, Number(product.price) || 0),
      oldPrice: product.oldPrice != null && Number(product.oldPrice) > 0 ? Number(product.oldPrice) : null,
      condition: product.condition === 'used' ? 'used' : 'new',
      inStock: Boolean(product.inStock),
      isNew: Boolean(product.isNew),
      isSale: Boolean(product.isSale),
      size: (product.size ?? '').trim().slice(0, 40),
      descriptionEn: (product.descriptionEn ?? '').trim().slice(0, 1000),
      descriptionAr: (product.descriptionAr ?? '').trim().slice(0, 1000),
      options: product.options.map((o) => o.trim().slice(0, 100)).filter(Boolean).slice(0, 20),
      images: product.images.map((i) => i.trim().slice(0, 2000)).filter(Boolean).slice(0, 10),
      order: Number(product.order) || 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const id = sanitizeId(category.id, 'cat');
  const key = sanitizeId(category.key, 'cat');
  const path = `categories/${id}`;
  try {
    await setDoc(doc(db, 'categories', id), {
      key: key.slice(0, 60),
      nameEn: category.nameEn.trim().slice(0, 80),
      nameAr: category.nameAr.trim().slice(0, 80),
      image: category.image.trim().slice(0, 2000),
      order: Number(category.order) || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveService(service: ServiceItem): Promise<void> {
  const id = sanitizeId(service.id, 'svc');
  const path = `services/${id}`;
  try {
    await setDoc(doc(db, 'services', id), {
      titleEn: service.titleEn.trim().slice(0, 100),
      titleAr: service.titleAr.trim().slice(0, 100),
      descriptionEn: service.descriptionEn.trim().slice(0, 400),
      descriptionAr: service.descriptionAr.trim().slice(0, 400),
      icon: service.icon.trim().slice(0, 40) || 'smartphone',
      whatsappMessageEn: service.whatsappMessageEn.trim().slice(0, 400),
      whatsappMessageAr: service.whatsappMessageAr.trim().slice(0, 400),
      order: Number(service.order) || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteService(id: string): Promise<void> {
  const path = `services/${id}`;
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const id = sanitizeId(item.id, 'gal');
  const path = `gallery/${id}`;
  try {
    await setDoc(doc(db, 'gallery', id), {
      titleEn: item.titleEn.trim().slice(0, 120),
      titleAr: item.titleAr.trim().slice(0, 120),
      image: item.image.trim().slice(0, 2000),
      order: Number(item.order) || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveShopSettings(settings: ShopSettings): Promise<void> {
  const path = 'shopSettings/main';
  try {
    await setDoc(doc(db, 'shopSettings', 'main'), {
      heroTitleEn: settings.heroTitleEn.trim().slice(0, 160),
      heroTitleAr: settings.heroTitleAr.trim().slice(0, 160),
      heroSubtitleEn: settings.heroSubtitleEn.trim().slice(0, 300),
      heroSubtitleAr: settings.heroSubtitleAr.trim().slice(0, 300),
      heroImage: settings.heroImage.trim().slice(0, 2000),
      phoneDisplay: settings.phoneDisplay.trim().slice(0, 40),
      whatsappNumber: settings.whatsappNumber.trim().slice(0, 30),
      addressEn: settings.addressEn.trim().slice(0, 200),
      addressAr: settings.addressAr.trim().slice(0, 200),
      hoursEn: settings.hoursEn.trim().slice(0, 160),
      hoursAr: settings.hoursAr.trim().slice(0, 160),
      mapsLink: settings.mapsLink.trim().slice(0, 1000),
      mapsEmbedUrl: settings.mapsEmbedUrl.trim().slice(0, 1000),
      facebookUrl: settings.facebookUrl.trim().slice(0, 500),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultsToFirestore(): Promise<void> {
  const batch = writeBatch(db);
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      batch.set(doc(db, 'categories', cat.id), {
        key: cat.key,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        image: cat.image,
        order: cat.order,
      });
    }
    for (const svc of DEFAULT_SERVICES) {
      batch.set(doc(db, 'services', svc.id), {
        titleEn: svc.titleEn,
        titleAr: svc.titleAr,
        descriptionEn: svc.descriptionEn,
        descriptionAr: svc.descriptionAr,
        icon: svc.icon,
        whatsappMessageEn: svc.whatsappMessageEn,
        whatsappMessageAr: svc.whatsappMessageAr,
        order: svc.order,
      });
    }
    for (const prod of DEFAULT_PRODUCTS) {
      batch.set(doc(db, 'products', prod.id), {
        nameEn: prod.nameEn,
        nameAr: prod.nameAr,
        brand: prod.brand,
        category: prod.category,
        price: prod.price,
        oldPrice: prod.oldPrice ?? null,
        condition: prod.condition,
        inStock: prod.inStock,
        isNew: prod.isNew,
        isSale: prod.isSale,
        size: prod.size ?? '',
        descriptionEn: prod.descriptionEn ?? '',
        descriptionAr: prod.descriptionAr ?? '',
        options: prod.options,
        images: prod.images,
        order: prod.order,
        updatedAt: serverTimestamp(),
      });
    }
    for (const item of DEFAULT_GALLERY) {
      batch.set(doc(db, 'gallery', item.id), {
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        image: item.image,
        order: item.order,
      });
    }
    batch.set(doc(db, 'shopSettings', 'main'), {
      ...DEFAULT_SHOP_SETTINGS,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
  }
}

export async function uploadImageToStorage(file: File, folder = 'uploads'): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
