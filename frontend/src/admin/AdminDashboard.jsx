import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';
import { formatINR, createSvgFallbackDataUri } from '../utils/fallbackData';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const {
    products,
    setProducts,
    categories,
    enquiries,
    setEnquiries,
    contactMessages,
    setContactMessages,
    settings,
    setSettings,
  } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [replaceDemoOnly, setReplaceDemoOnly] = useState(false);

  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    category: 'Kundan Jewellery',
    price: '',
    originalPrice: '',
    metalType: 'Kundan & Gold',
    purity: '22K (916 BIS Hallmarked)',
    weightGrams: '',
    stoneDetails: '',
    shortDescription: '',
    altText: '',
  });
  const [uploadedPreviewUrls, setUploadedPreviewUrls] = useState([]);

  useEffect(() => {
    updatePageMeta({
      title: 'Admin Dashboard | AARANYA',
      description: 'Protected AARANYA administration dashboard.',
    });
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  if (!admin) return null;

  const demoCount = products.filter((p) => p.isDemoProduct).length;
  const displayedProducts = replaceDemoOnly
    ? products.filter((p) => p.isDemoProduct)
    : products;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    const urls = [];
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        toast.error(`Invalid file format: ${file.name}`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        urls.push(ev.target.result);
        setUploadedPreviewUrls([...urls]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name.trim() || !newProd.sku.trim() || !newProd.price || !newProd.altText.trim()) {
      toast.error('Please fill in Product Name, Unique SKU, Price, and Image Alt Text.');
      return;
    }
    const slug = `${newProd.name}-${newProd.sku}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const hasRealPhoto = uploadedPreviewUrls.length > 0;
    const created = {
      _id: 'prod-' + Date.now(),
      name: newProd.name.trim(),
      sku: newProd.sku.trim().toUpperCase(),
      slug,
      category: { name: newProd.category },
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : null,
      metalType: newProd.metalType,
      purity: newProd.purity,
      weightGrams: Number(newProd.weightGrams) || 25.0,
      stoneDetails: newProd.stoneDetails || 'Natural Indian Gemstones',
      occasion: 'Bridal',
      availability: 'In Store & Ready',
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      isActive: true,
      isDemoProduct: !hasRealPhoto,
      viewsCount: 1,
      enquiriesCount: 0,
      shortDescription:
        newProd.shortDescription || `${newProd.name} handcrafted in ${newProd.purity}.`,
      fullDescription:
        newProd.shortDescription || `${newProd.name} handcrafted in ${newProd.purity}.`,
      specifications: [
        { label: 'Gross Weight', value: `${newProd.weightGrams || 25} grams` },
        { label: 'Metal Purity', value: newProd.purity },
      ],
      images: hasRealPhoto
        ? uploadedPreviewUrls.map((url, idx) => ({
            url,
            alt: newProd.altText,
            isMain: idx === 0,
            isDemo: false,
            licenseSource: 'Genuine Uploaded Store Photography',
          }))
        : [
            {
              url: createSvgFallbackDataUri(newProd.name, newProd.purity, newProd.sku),
              alt: newProd.altText,
              isMain: true,
              isDemo: true,
            },
          ],
    };

    setProducts([created, ...products]);
    setNewProd({
      name: '',
      sku: '',
      category: 'Kundan Jewellery',
      price: '',
      originalPrice: '',
      metalType: 'Kundan & Gold',
      purity: '22K (916 BIS Hallmarked)',
      weightGrams: '',
      stoneDetails: '',
      shortDescription: '',
      altText: '',
    });
    setUploadedPreviewUrls([]);
    toast.success(`Created ${created.name} (${created.sku})`);
  };

  const handleReplacePhoto = (productId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id !== productId) return p;
          const updatedImages = [...(p.images || [])];
          updatedImages[0] = {
            ...updatedImages[0],
            url: ev.target.result,
            isDemo: false,
            licenseSource: 'Genuine Uploaded Store Photography',
          };
          return { ...p, images: updatedImages, isDemoProduct: false };
        })
      );
      toast.success('Replaced demo reference photo with genuine store photography!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 p-4 rounded-2xl bg-[#F7F2EA] border-2 border-[#C89B5C] flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#3C2B20]">
            Pre-Launch Photography Status:{' '}
            <span className="text-[#C89B5C]">
              {demoCount} of {products.length}
            </span>{' '}
            products currently use licensed reference photos.
          </p>
          <p className="text-[11px] text-[#827466]">
            Replace every demo reference image with actual showroom photography before launch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setActiveTab('products');
            setReplaceDemoOnly(!replaceDemoOnly);
          }}
          className="px-4 py-2 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold"
        >
          {replaceDemoOnly ? 'Show All Products' : 'Filter Demo Images to Replace'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-4 space-y-1.5">
            <div className="px-3 py-2 border-b border-[#E9DED0] mb-2">
              <p className="text-[10px] uppercase tracking-widest text-[#C89B5C] font-bold">
                Signed In Admin
              </p>
              <p className="font-serif text-lg font-semibold text-[#3C2B20]">{admin.name}</p>
              <p className="text-[11px] text-[#827466] truncate">{admin.email}</p>
            </div>
            {[
              { id: 'dashboard', label: 'Dashboard Overview' },
              { id: 'products', label: `Products (${products.length})` },
              { id: 'enquiries', label: `WhatsApp Enquiries (${enquiries.length})` },
              { id: 'contacts', label: `Contact Messages (${contactMessages.length})` },
              { id: 'settings', label: 'Website Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[#C89B5C] text-white'
                    : 'text-[#3C2B20] hover:bg-[#F4EEE5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={logout}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition mt-2 border-t border-[#E9DED0] pt-3"
            >
              Logout Securely
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#827466]">
                    Total Products
                  </p>
                  <p className="font-serif text-3xl font-bold text-[#3C2B20] mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#827466]">
                    Categories
                  </p>
                  <p className="font-serif text-3xl font-bold text-[#3C2B20] mt-1">
                    {categories.length}
                  </p>
                </div>
                <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#827466]">
                    WhatsApp Enquiries
                  </p>
                  <p className="font-serif text-3xl font-bold text-[#C89B5C] mt-1">
                    {enquiries.length}
                  </p>
                </div>
                <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#827466]">
                    Contact Messages
                  </p>
                  <p className="font-serif text-3xl font-bold text-[#3C2B20] mt-1">
                    {contactMessages.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6">
                <h2 className="font-serif text-2xl font-semibold text-[#3C2B20] mb-4">
                  Add Product / Upload Store Photography
                </h2>
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name *"
                      value={newProd.name}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Unique SKU *"
                      value={newProd.sku}
                      onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DED0] bg-white uppercase"
                    />
                    <input
                      type="number"
                      placeholder="Price in INR *"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Descriptive Image Alt Text *"
                      value={newProd.altText}
                      onChange={(e) => setNewProd({ ...newProd, altText: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                    />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={handleFileChange}
                      className="text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C89B5C] text-white font-semibold"
                  >
                    Create Product
                  </button>
                </form>
              </div>

              <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-2xl font-semibold text-[#3C2B20]">
                  Catalogue Inventory ({displayedProducts.length})
                </h3>
                {displayedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E9DED0] flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#C89B5C]">{p.sku}</span>
                      {p.isDemoProduct ? (
                        <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                          DEMO REFERENCE PHOTO
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                          GENUINE STORE PHOTO
                        </span>
                      )}
                      <p className="font-serif text-lg font-semibold text-[#3C2B20]">{p.name}</p>
                      <p className="text-[#827466]">{formatINR(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 rounded-lg border border-[#C89B5C] bg-white font-semibold cursor-pointer">
                        <span>Replace Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplacePhoto(p._id, e.target.files?.[0])}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setProducts(products.filter((item) => item._id !== p._id))
                        }
                        className="px-3 py-2 rounded-lg border border-red-200 bg-white text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
                Logged WhatsApp Enquiries ({enquiries.length})
              </h2>
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E9DED0] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-[#C89B5C]">{enq.sku}</p>
                    <p className="font-serif text-lg font-semibold">{enq.productName}</p>
                    <p className="text-[#827466]">{formatINR(enq.priceAtEnquiry)}</p>
                  </div>
                  <select
                    value={enq.status}
                    onChange={(e) =>
                      setEnquiries(
                        enquiries.map((item) =>
                          item._id === enq._id ? { ...item, status: e.target.value } : item
                        )
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#C89B5C] bg-white font-semibold"
                  >
                    {['New', 'Contacted', 'Interested', 'Converted', 'Not Interested'].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
                Contact Submissions ({contactMessages.length})
              </h2>
              {contactMessages.map((msg) => (
                <div
                  key={msg.contactId || msg._id}
                  className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E9DED0] text-xs space-y-1"
                >
                  <p className="font-serif text-lg font-semibold">
                    {msg.name} — {msg.subject}
                  </p>
                  <p className="text-[#827466]">
                    {msg.email} • {msg.phone}
                  </p>
                  <p className="text-[#3C2B20]">{msg.message}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6 space-y-4 text-xs">
              <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
                Website &amp; Showroom Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Showroom Phone</label>
                  <input
                    type="text"
                    value={settings.phoneNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Store Address</label>
                <input
                  type="text"
                  value={settings.storeAddress}
                  onChange={(e) =>
                    setSettings({ ...settings, storeAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E9DED0] bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => toast.success('Settings updated across storefront')}
                className="px-6 py-2.5 rounded-xl bg-[#C89B5C] text-white font-semibold"
              >
                Save Website Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
