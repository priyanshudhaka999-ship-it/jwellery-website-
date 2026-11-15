import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { buildWhatsAppEnquiryUrl } from '../utils/whatsapp';
import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  DEFAULT_SETTINGS,
} from '../utils/fallbackData';

const StoreContext = createContext(null);

const WISHLIST_KEY = 'aaranya_guest_wishlist_v2';
const RECENTLY_VIEWED_KEY = 'aaranya_recently_viewed_v2';
const PRODUCTS_CACHE_KEY = 'aaranya_products_cache_v2';
const ENQUIRIES_CACHE_KEY = 'aaranya_enquiries_cache_v2';
const CONTACTS_CACHE_KEY = 'aaranya_contacts_cache_v2';

export const StoreProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_CACHE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_CACHE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTACTS_CACHE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[5]];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[6]];
    } catch {
      return [];
    }
  });

  // Attempt to hydrate live data from the Express + MongoDB backend on mount
  useEffect(() => {
    let mounted = true;
    const fetchInitialStoreData = async () => {
      try {
        const [prodRes, catRes, colRes, setRes, testRes, faqRes] = await Promise.allSettled([
          api.get('/products?limit=50'),
          api.get('/categories'),
          api.get('/collections'),
          api.get('/cms/settings'),
          api.get('/cms/testimonials'),
          api.get('/cms/faqs'),
        ]);

        if (!mounted) return;
        if (prodRes.status === 'fulfilled' && prodRes.value.data?.products?.length) {
          setProducts(prodRes.value.data.products);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.categories?.length) {
          setCategories(catRes.value.data.categories);
        }
        if (colRes.status === 'fulfilled' && colRes.value.data?.collections?.length) {
          setCollections(colRes.value.data.collections);
        }
        if (setRes.status === 'fulfilled' && setRes.value.data?.settings) {
          setSettings(setRes.value.data.settings);
        }
        if (testRes.status === 'fulfilled' && testRes.value.data?.testimonials?.length) {
          setTestimonials(testRes.value.data.testimonials);
        }
        if (faqRes.status === 'fulfilled' && faqRes.value.data?.faqs?.length) {
          setFaqs(faqRes.value.data.faqs);
        }
      } catch {
        // Fallback catalogue remains active when backend isn't running yet
      }
    };
    fetchInitialStoreData();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      const updated = exists
        ? prev.filter((item) => item._id !== product._id)
        : [product, ...prev];
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      } catch {}
      toast.success(
        exists
          ? `Removed ${product.name} from your Wishlist`
          : `Saved ${product.name} to your Guest Wishlist`
      );
      return updated;
    });
  };

  const addRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [product, ...filtered].slice(0, 4);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleWhatsAppEnquiry = async (product, source = 'product_page') => {
    if (!product) return;
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const waUrl = buildWhatsAppEnquiryUrl({
      whatsappNumber: settings?.whatsappNumber || '919876543210',
      productName: product.name,
      price: product.price,
      sku: product.sku,
      productUrl,
    });

    const newEnquiry = {
      _id: 'enq-' + Date.now(),
      product: product._id,
      productName: product.name,
      sku: product.sku,
      priceAtEnquiry: product.price,
      productUrl,
      source,
      status: 'New',
      createdAt: new Date().toISOString(),
      adminNotes: 'Enquiry click logged (Customer completes send in WhatsApp).',
    };

    setEnquiries((prev) => {
      const updated = [newEnquiry, ...prev];
      try {
        localStorage.setItem(ENQUIRIES_CACHE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await api.post('/enquiries', {
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        priceAtEnquiry: product.price,
        productUrl,
        source,
      });
    } catch {
      // Logged in local cache when offline
    }

    toast.success(
      `Enquiry click logged for ${product.sku}. Opening WhatsApp—press Send in WhatsApp to complete delivery.`
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        setSettings,
        categories,
        setCategories,
        collections,
        setCollections,
        products,
        setProducts,
        testimonials,
        setTestimonials,
        faqs,
        setFaqs,
        enquiries,
        setEnquiries,
        contactMessages,
        setContactMessages,
        loading,
        setLoading,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        addRecentlyViewed,
        handleWhatsAppEnquiry,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
