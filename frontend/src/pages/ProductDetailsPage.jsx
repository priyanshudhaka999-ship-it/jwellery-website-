import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import NotFoundPage from './NotFoundPage';
import { updatePageMeta } from '../utils/seo';
import { formatINR, createSvgFallbackDataUri } from '../utils/fallbackData';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const {
    products,
    wishlist,
    toggleWishlist,
    recentlyViewed,
    addRecentlyViewed,
    handleWhatsAppEnquiry,
  } = useStore();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    setActiveImgIdx(0);
    if (product) {
      addRecentlyViewed(product);
      updatePageMeta({
        title: `${product.name} | AARANYA`,
        description: `${product.shortDescription} — SKU ${product.sku}, ${product.purity}, priced at ${formatINR(
          product.price
        )}.`,
        image: product.images?.[0]?.url,
        type: 'product',
      });
    }
  }, [slug, product]);

  if (!product) {
    return <NotFoundPage />;
  }

  const images = product.images || [];
  const activeImg = images[activeImgIdx] || images[0] || {};
  const categoryName =
    typeof product.category === 'object' ? product.category?.name : product.category;
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const similarProducts = products
    .filter((p) => {
      const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
      return p._id !== product._id && (pCat === categoryName || p.metalType === product.metalType);
    })
    .slice(0, 4);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    toast.success('Product link copied to clipboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#827466] mb-8">
        <Link to="/" className="hover:text-[#3C2B20]">
          Home
        </Link>
        <span>/</span>
        <Link to={`/collections?category=${encodeURIComponent(categoryName)}`} className="hover:text-[#3C2B20]">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#3C2B20] font-medium">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4EEE5] border-2 border-[#E9DED0]">
            <img
              src={activeImg.url || createSvgFallbackDataUri(product.name, product.purity, product.sku)}
              alt={activeImg.alt || product.name}
              width="900"
              height="1125"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = createSvgFallbackDataUri(product.name, product.purity, product.sku);
              }}
              className="w-full h-full object-cover"
            />
            {product.isDemoProduct && (
              <div className="absolute top-4 left-4 right-4 bg-[#FAF8F4]/95 backdrop-blur border border-[#C89B5C] rounded-xl p-3 text-[11px] text-[#3C2B20]">
                <p className="font-bold text-[#C89B5C] uppercase tracking-wider">
                  Temporary Reference Photograph (Non-AI)
                </p>
                <p className="text-[#827466] mt-0.5">
                  Source: {activeImg.licenseSource || 'Wikimedia Commons / Unsplash License'}. Replace via Admin Dashboard before launch.
                </p>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    idx === activeImgIdx ? 'border-[#C89B5C] scale-105' : 'border-[#E9DED0] opacity-75'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Specifications */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F4EEE5] border border-[#E9DED0] text-xs font-semibold text-[#C89B5C]">
                {categoryName} • {product.occasion}
              </span>
              <span className="text-xs font-mono text-[#827466]">
                SKU: <strong className="text-[#3C2B20]">{product.sku}</strong>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20] leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E9DED0] space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#3C2B20]">
                {formatINR(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-[#827466] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89B5C] text-white text-[11px] font-semibold">
                    Save {formatINR(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#827466]">
              Indicative INR showroom price inclusive of making charges, subject to physical weight verification &amp; daily gold rate.
            </p>
          </div>

          <p className="text-sm text-[#3C2B20] leading-relaxed">{product.fullDescription}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F7F2EA] border border-[#E9DED0]">
              <p className="text-[10px] uppercase tracking-wider text-[#827466]">Metal Type</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-0.5">{product.metalType}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F2EA] border border-[#E9DED0]">
              <p className="text-[10px] uppercase tracking-wider text-[#827466]">Verified Purity</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-0.5">{product.purity}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F2EA] border border-[#E9DED0]">
              <p className="text-[10px] uppercase tracking-wider text-[#827466]">Verified Weight</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-0.5">
                {product.weightGrams ? `${product.weightGrams} Grams` : 'Weighed at Store'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F2EA] border border-[#E9DED0] col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-[#827466]">Stone Details</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-0.5">{product.stoneDetails}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F2EA] border border-[#E9DED0]">
              <p className="text-[10px] uppercase tracking-wider text-[#827466]">Availability</p>
              <p className="text-xs font-semibold text-[#C89B5C] mt-0.5">{product.availability}</p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleWhatsAppEnquiry(product, 'product_page')}
                className="py-3.5 px-6 rounded-xl bg-[#C89B5C] hover:bg-[#b5894c] text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="py-3.5 px-6 rounded-xl border border-[#C89B5C] bg-white hover:bg-[#F4EEE5] text-[#3C2B20] text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#C89B5C] text-[#C89B5C]' : 'text-[#3C2B20]'
                  }`}
                />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl border border-[#E9DED0] bg-[#F7F2EA] hover:border-[#C89B5C] text-xs font-semibold text-[#3C2B20] flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#C89B5C]" />
                <span>Share Product</span>
              </button>

              <Link
                to="/contact"
                className="py-2.5 px-4 rounded-xl border border-[#E9DED0] bg-[#F7F2EA] hover:border-[#C89B5C] text-xs font-semibold text-[#3C2B20] flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#C89B5C]" />
                <span>Visit Our Store</span>
              </Link>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications?.length > 0 && (
            <div className="pt-4 border-t border-[#E9DED0]">
              <h2 className="font-serif text-2xl font-semibold text-[#3C2B20] mb-3">
                Detailed Craftsmanship Specifications
              </h2>
              <div className="rounded-xl border border-[#E9DED0] overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? 'bg-[#F7F2EA]' : 'bg-[#FAF8F4]'
                        } border-b border-[#E9DED0] last:border-none`}
                      >
                        <th className="py-2.5 px-4 text-left font-semibold text-[#3C2B20] w-2/5">
                          {spec.label}
                        </th>
                        <td className="py-2.5 px-4 text-[#827466]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      <section className="mt-16 pt-12 border-t border-[#E9DED0]">
        <h2 className="font-serif text-3xl font-semibold text-[#3C2B20] mb-6">
          Similar Creations You May Admire
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewed.filter((p) => p._id !== product._id).length > 0 && (
        <section className="mt-14 pt-12 border-t border-[#E9DED0]">
          <h2 className="font-serif text-3xl font-semibold text-[#3C2B20] mb-6">
            Recently Viewed Pieces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </section>
      )}

      {/* STICKY MOBILE CTA BAR (Checklist Item #11) */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-[#FAF8F4]/95 backdrop-blur border-t border-[#E9DED0] p-3 shadow-lg flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="px-3.5 py-2.5 rounded-xl border border-[#C89B5C] bg-white text-[#3C2B20] text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#C89B5C] text-[#C89B5C]' : 'text-[#C89B5C]'
            }`}
          />
          <span>Wishlist</span>
        </button>
        <button
          type="button"
          onClick={() => handleWhatsAppEnquiry(product, 'sticky_mobile_cta')}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
