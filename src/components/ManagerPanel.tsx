import React, { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  Database,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ADMIN_EMAIL, auth, PASSCODE_SUFFIX } from '../firebase';
import {
  deleteCategory,
  deleteGalleryItem,
  deleteProduct,
  deleteService,
  saveCategory,
  saveGalleryItem,
  saveProduct,
  saveService,
  saveShopSettings,
  seedDefaultsToFirestore,
  uploadImageToStorage,
} from '../services/firestoreService';
import {
  Category,
  GalleryItem,
  Product,
  ServiceItem,
  ShopSettings,
} from '../types';

type TabKey = 'products' | 'categories' | 'services' | 'heroGallery' | 'shopInfo';

interface ManagerPanelProps {
  open: boolean;
  products: Product[];
  categories: Category[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  settings: ShopSettings;
  hasFirestoreData: boolean;
  onClose: () => void;
}

export const ManagerPanel: React.FC<ManagerPanelProps> = ({
  open,
  products,
  categories,
  services,
  gallery,
  settings,
  hasFirestoreData,
  onClose,
}) => {
  const [tab, setTab] = useState<TabKey>('products');
  const [statusMsg, setStatusMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  // Change PIN modal state
  const [showChangePin, setShowChangePin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin1, setNewPin1] = useState('');
  const [newPin2, setNewPin2] = useState('');
  const [pinError, setPinError] = useState('');

  // Product editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [optionsText, setOptionsText] = useState('');
  const [imagesText, setImagesText] = useState('');

  // Category editor state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Service editor state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Gallery editor state
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);

  // Settings editor state
  const [draftSettings, setDraftSettings] = useState<ShopSettings>(settings);

  if (!open) return null;

  const notify = (msg: string) => {
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  const handleChangeCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin1)) {
      setPinError('All codes must be exactly 4 digits.');
      return;
    }
    if (newPin1 !== newPin2) {
      setPinError('New codes do not match.');
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    try {
      const cred = EmailAuthProvider.credential(ADMIN_EMAIL, currentPin + PASSCODE_SUFFIX);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPin1 + PASSCODE_SUFFIX);
      setShowChangePin(false);
      setCurrentPin('');
      setNewPin1('');
      setNewPin2('');
      notify('Access code updated.');
    } catch {
      setPinError('Current code is incorrect.');
    }
  };

  const handleSeed = async () => {
    try {
      await seedDefaultsToFirestore();
      notify('Default catalog synced to cloud.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Sync failed');
    }
  };

  const handleFileUpload = async (
    file: File,
    folder: string,
    onUrl: (url: string) => void
  ) => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, folder);
      onUrl(url);
      notify('Image uploaded to Firebase Storage.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const startNewProduct = () => {
    const fresh: Product = {
      id: `prod-${Date.now()}`,
      nameEn: '',
      nameAr: '',
      brand: '',
      category: categories[0]?.key || 'phones',
      price: 0,
      oldPrice: null,
      condition: 'new',
      inStock: true,
      isNew: true,
      isSale: false,
      size: '',
      descriptionEn: '',
      descriptionAr: '',
      options: [],
      images: [],
      order: products.length + 1,
    };
    setEditingProduct(fresh);
    setOptionsText('');
    setImagesText('');
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setOptionsText(p.options.join('\n'));
    setImagesText(p.images.join('\n'));
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const payload: Product = {
      ...editingProduct,
      options: optionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      images: imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await saveProduct(payload);
    setEditingProduct(null);
    notify('Product saved.');
  };

  const startNewCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      key: '',
      nameEn: '',
      nameAr: '',
      image: '',
      order: categories.length + 1,
    });
  };

  const submitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await saveCategory(editingCategory);
    setEditingCategory(null);
    notify('Category saved.');
  };

  const startNewService = () => {
    setEditingService({
      id: `svc-${Date.now()}`,
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      icon: 'smartphone',
      whatsappMessageEn: '',
      whatsappMessageAr: '',
      order: services.length + 1,
    });
  };

  const submitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    await saveService(editingService);
    setEditingService(null);
    notify('Service saved.');
  };

  const startNewGallery = () => {
    setEditingGallery({
      id: `gal-${Date.now()}`,
      titleEn: '',
      titleAr: '',
      image: '',
      order: gallery.length + 1,
    });
  };

  const submitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    await saveGalleryItem(editingGallery);
    setEditingGallery(null);
    notify('Gallery item saved.');
  };

  const submitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveShopSettings(draftSettings);
    notify('Storefront settings saved.');
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'products', label: `Products (${products.length})` },
    { key: 'categories', label: `Categories (${categories.length})` },
    { key: 'services', label: `Services (${services.length})` },
    { key: 'heroGallery', label: 'Hero & Gallery' },
    { key: 'shopInfo', label: 'Shop Info' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      dir="ltr"
    >
      <div className="w-full max-w-5xl h-[92vh] bg-[#141414] border border-[#2F2F2F] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Bar */}
        <div className="px-5 py-4 bg-[#1C1C1C] border-b border-[#2C2C2C] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-extrabold text-[#FFD600]">
              SNAP CELL Manager
            </h2>
            {statusMsg && (
              <span className="text-xs font-bold text-[#0B0B0B] bg-[#FFD600] px-2.5 py-1 rounded-md">
                {statusMsg}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!hasFirestoreData && (
              <button
                type="button"
                onClick={handleSeed}
                className="h-9 px-3 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Seed Starter Catalog</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowChangePin((v) => !v)}
              className="h-9 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-[#FFD600] text-xs font-bold text-white inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#FFD600]" />
              <span>Change code</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="h-9 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-red-400 text-xs font-bold text-white inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] flex items-center justify-center text-white hover:border-[#FFD600]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Change Code Bar */}
        {showChangePin && (
          <form
            onSubmit={handleChangeCode}
            className="px-5 py-4 bg-[#1A180D] border-b border-[#FFD600]/40 flex flex-wrap items-end gap-3"
          >
            <div>
              <label className="block text-[11px] font-bold text-[#9A9A9A] mb-1">
                Current 4-digit code
              </label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                className="h-9 w-28 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] text-white text-sm font-bold tracking-widest"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9A9A9A] mb-1">
                New 4-digit code
              </label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={newPin1}
                onChange={(e) => setNewPin1(e.target.value.replace(/\D/g, ''))}
                className="h-9 w-28 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] text-white text-sm font-bold tracking-widest"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9A9A9A] mb-1">
                Confirm new code
              </label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={newPin2}
                onChange={(e) => setNewPin2(e.target.value.replace(/\D/g, ''))}
                className="h-9 w-28 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] text-white text-sm font-bold tracking-widest"
                required
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold"
            >
              Update Code
            </button>
            {pinError && <span className="text-xs font-bold text-red-400">{pinError}</span>}
          </form>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#0B0B0B] border-b border-[#242424] flex items-center gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setTab(item.key);
                setDraftSettings(settings);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                tab === item.key
                  ? 'bg-[#FFD600] text-[#0B0B0B]'
                  : 'bg-[#1C1C1C] text-[#9A9A9A] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab Workspace */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">Products</h3>
                <button
                  type="button"
                  onClick={startNewProduct}
                  className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {editingProduct && (
                <form
                  onSubmit={submitProduct}
                  className="bg-[#1C1C1C] border border-[#FFD600]/50 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#FFD600]">Product Details</h4>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-[#9A9A9A] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Name (English)"
                      value={editingProduct.nameEn}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      placeholder="Name (Arabic)"
                      dir="rtl"
                      value={editingProduct.nameAr}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, nameAr: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      placeholder="Brand (e.g. Apple, Lattafa)"
                      value={editingProduct.brand}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.key}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price (USD)"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Old Price (optional)"
                      value={editingProduct.oldPrice ?? ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          oldPrice: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <select
                      value={editingProduct.condition}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          condition: e.target.value === 'used' ? 'used' : 'new',
                        })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    >
                      <option value="new">Condition: New</option>
                      <option value="used">Condition: Used</option>
                    </select>
                    <input
                      placeholder="Size (e.g. 100ml, 46mm)"
                      value={editingProduct.size ?? ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, size: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <textarea
                      rows={2}
                      placeholder="Description (English)"
                      value={editingProduct.descriptionEn ?? ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })
                      }
                      className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <textarea
                      rows={2}
                      dir="rtl"
                      placeholder="Description (Arabic)"
                      value={editingProduct.descriptionAr ?? ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })
                      }
                      className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <textarea
                      rows={3}
                      placeholder="Options (one per line, e.g. 256GB · Black)"
                      value={optionsText}
                      onChange={(e) => setOptionsText(e.target.value)}
                      className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        placeholder="Image URLs (one per line)"
                        value={imagesText}
                        onChange={(e) => setImagesText(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#333] hover:border-[#FFD600] text-xs font-bold text-white cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#FFD600]" />
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              void handleFileUpload(f, 'products', (url) =>
                                setImagesText((prev) => (prev ? `${prev}\n${url}` : url))
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-bold text-white">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                        }
                        className="accent-[#FFD600]"
                      />
                      <span>In Stock (uncheck = Sold out)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isNew}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                        }
                        className="accent-[#FFD600]"
                      />
                      <span>New Flag</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isSale}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isSale: e.target.checked })
                        }
                        className="accent-[#FFD600]"
                      />
                      <span>Sale Flag</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#FFD600] text-[#0B0B0B] font-extrabold text-xs inline-flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Product</span>
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {p.nameEn} · <span className="text-[#FFD600]">${p.price}</span>
                      </p>
                      <p className="text-xs text-[#9A9A9A] truncate">
                        {p.brand} · {p.category} · {p.inStock ? 'Available' : 'Sold out'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditProduct(p)}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-[#FFD600] text-white"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteProduct(p.id).then(() => notify('Deleted.'))}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-red-400 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CATEGORIES TAB */}
          {tab === 'categories' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">Categories</h3>
                <button
                  type="button"
                  onClick={startNewCategory}
                  className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {editingCategory && (
                <form
                  onSubmit={submitCategory}
                  className="bg-[#1C1C1C] border border-[#FFD600]/50 rounded-xl p-5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Key (lowercase, e.g. phones)"
                      value={editingCategory.key}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, key: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Sort Order"
                      value={editingCategory.order}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          order: Number(e.target.value),
                        })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <input
                      placeholder="Name (English)"
                      value={editingCategory.nameEn}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, nameEn: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      placeholder="Name (Arabic)"
                      dir="rtl"
                      value={editingCategory.nameAr}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, nameAr: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      placeholder="Image URL"
                      value={editingCategory.image}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, image: e.target.value })
                      }
                      className="flex-1 h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <label className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] hover:border-[#FFD600] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#FFD600]" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            void handleFileUpload(f, 'categories', (url) =>
                              setEditingCategory((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold"
                    >
                      Save Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 rounded-lg bg-[#0B0B0B] text-xs font-bold text-[#9A9A9A]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        {c.nameEn} / {c.nameAr}
                      </p>
                      <p className="text-xs text-[#9A9A9A]">key: {c.key}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory({ ...c })}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-[#FFD600] text-white"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteCategory(c.id).then(() => notify('Deleted.'))}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-red-400 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SERVICES TAB */}
          {tab === 'services' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">Services</h3>
                <button
                  type="button"
                  onClick={startNewService}
                  className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {editingService && (
                <form
                  onSubmit={submitService}
                  className="bg-[#1C1C1C] border border-[#FFD600]/50 rounded-xl p-5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Title (English)"
                      value={editingService.titleEn}
                      onChange={(e) =>
                        setEditingService({ ...editingService, titleEn: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      placeholder="Title (Arabic)"
                      dir="rtl"
                      value={editingService.titleAr}
                      onChange={(e) =>
                        setEditingService({ ...editingService, titleAr: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <select
                      value={editingService.icon}
                      onChange={(e) =>
                        setEditingService({ ...editingService, icon: e.target.value })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    >
                      <option value="smartphone">Icon: Smartphone</option>
                      <option value="refresh">Icon: Trade-In / Refresh</option>
                      <option value="wrench">Icon: Repair Wrench</option>
                      <option value="shield">Icon: Warranty Shield</option>
                      <option value="battery">Icon: Battery</option>
                      <option value="sparkles">Icon: Sparkles</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Order"
                      value={editingService.order}
                      onChange={(e) =>
                        setEditingService({ ...editingService, order: Number(e.target.value) })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description (English)"
                      value={editingService.descriptionEn}
                      onChange={(e) =>
                        setEditingService({ ...editingService, descriptionEn: e.target.value })
                      }
                      className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <textarea
                      rows={2}
                      dir="rtl"
                      placeholder="Description (Arabic)"
                      value={editingService.descriptionAr}
                      onChange={(e) =>
                        setEditingService({ ...editingService, descriptionAr: e.target.value })
                      }
                      className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      required
                    />
                    <input
                      placeholder="WhatsApp Ready Message (EN)"
                      value={editingService.whatsappMessageEn}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          whatsappMessageEn: e.target.value,
                        })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                    <input
                      placeholder="WhatsApp Ready Message (AR)"
                      dir="rtl"
                      value={editingService.whatsappMessageAr}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          whatsappMessageAr: e.target.value,
                        })
                      }
                      className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold"
                    >
                      Save Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-lg bg-[#0B0B0B] text-xs font-bold text-[#9A9A9A]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        {s.titleEn} / {s.titleAr}
                      </p>
                      <p className="text-xs text-[#9A9A9A] line-clamp-1">{s.descriptionEn}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...s })}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-[#FFD600] text-white"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteService(s.id).then(() => notify('Deleted.'))}
                        className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-red-400 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* HERO & GALLERY TAB */}
          {tab === 'heroGallery' && (
            <div className="space-y-8">
              <form
                onSubmit={submitSettings}
                className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5 space-y-4"
              >
                <h3 className="font-display text-base font-bold text-[#FFD600]">Hero Section</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Hero Title (EN)"
                    value={draftSettings.heroTitleEn}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroTitleEn: e.target.value })
                    }
                    className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                  <input
                    placeholder="Hero Title (AR)"
                    dir="rtl"
                    value={draftSettings.heroTitleAr}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroTitleAr: e.target.value })
                    }
                    className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                  <textarea
                    rows={2}
                    placeholder="Hero Subtitle (EN)"
                    value={draftSettings.heroSubtitleEn}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroSubtitleEn: e.target.value })
                    }
                    className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="Hero Subtitle (AR)"
                    value={draftSettings.heroSubtitleAr}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroSubtitleAr: e.target.value })
                    }
                    className="p-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    placeholder="Hero Image URL"
                    value={draftSettings.heroImage}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroImage: e.target.value })
                    }
                    className="flex-1 h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                  <label className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] hover:border-[#FFD600] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#FFD600]" />
                    <span>Upload Hero Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          void handleFileUpload(f, 'hero', (url) =>
                            setDraftSettings((prev) => ({ ...prev, heroImage: url }))
                          );
                        }
                      }}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero</span>
                </button>
              </form>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white">Gallery Items</h3>
                  <button
                    type="button"
                    onClick={startNewGallery}
                    className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {editingGallery && (
                  <form
                    onSubmit={submitGallery}
                    className="bg-[#1C1C1C] border border-[#FFD600]/50 rounded-xl p-5 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Caption (EN)"
                        value={editingGallery.titleEn}
                        onChange={(e) =>
                          setEditingGallery({ ...editingGallery, titleEn: e.target.value })
                        }
                        className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      />
                      <input
                        placeholder="Caption (AR)"
                        dir="rtl"
                        value={editingGallery.titleAr}
                        onChange={(e) =>
                          setEditingGallery({ ...editingGallery, titleAr: e.target.value })
                        }
                        className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        placeholder="Image URL"
                        value={editingGallery.image}
                        onChange={(e) =>
                          setEditingGallery({ ...editingGallery, image: e.target.value })
                        }
                        className="flex-1 h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                      />
                      <label className="h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#333] hover:border-[#FFD600] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#FFD600]" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              void handleFileUpload(f, 'gallery', (url) =>
                                setEditingGallery((prev) =>
                                  prev ? { ...prev, image: url } : null
                                )
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold"
                      >
                        Save Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGallery(null)}
                        className="px-4 py-2 rounded-lg bg-[#0B0B0B] text-xs font-bold text-[#9A9A9A]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                    >
                      <span className="text-sm font-bold text-white truncate">
                        {g.titleEn || g.image}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingGallery({ ...g })}
                          className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-[#FFD600] text-white"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void deleteGalleryItem(g.id).then(() => notify('Deleted.'))
                          }
                          className="p-2 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] hover:border-red-400 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SHOP INFO TAB */}
          {tab === 'shopInfo' && (
            <form
              onSubmit={submitSettings}
              className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5 space-y-4"
            >
              <h3 className="font-display text-base font-bold text-[#FFD600]">
                Contact &amp; Location Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Phone Display
                  </label>
                  <input
                    value={draftSettings.phoneDisplay}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, phoneDisplay: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    WhatsApp Number (digits with country code, e.g. 9613934144)
                  </label>
                  <input
                    value={draftSettings.whatsappNumber}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, whatsappNumber: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Address (English)
                  </label>
                  <input
                    value={draftSettings.addressEn}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, addressEn: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Address (Arabic)
                  </label>
                  <input
                    dir="rtl"
                    value={draftSettings.addressAr}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, addressAr: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Opening Hours (English)
                  </label>
                  <input
                    value={draftSettings.hoursEn}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, hoursEn: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Opening Hours (Arabic)
                  </label>
                  <input
                    dir="rtl"
                    value={draftSettings.hoursAr}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, hoursAr: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Google Maps Link
                  </label>
                  <input
                    value={draftSettings.mapsLink}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, mapsLink: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    value={draftSettings.mapsEmbedUrl}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, mapsEmbedUrl: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#9A9A9A] mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    value={draftSettings.facebookUrl}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, facebookUrl: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0B0B0B] border border-[#2F2F2F] text-sm text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#FFD600] text-[#0B0B0B] text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Shop Info</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
