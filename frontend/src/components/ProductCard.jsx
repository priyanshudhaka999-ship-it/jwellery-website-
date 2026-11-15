import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, createSvgFallbackDataUri } from '../utils/fallbackData';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, handleWhatsAppEnquiry } = useStore();
  if (!product) return null;

  const mainImage = product.images?.find((img) => img.isMain) || product.images?.[0] || {};
  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="bg-[#F7F2EA] border border-[#E9DED0] hover:border-[#D8B982] rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-sm hover:shadow-md group">
      <div>
        <div className="relative aspect-[4/5] bg-[#F4EEE5] overflow-hidden">
          <Link to={`/product/${product.slug}`}>
            <img
              src={mainImage.url || createSvgFallbackDataUri(product.name, product.purity, product.sku)}
              alt={mainImage.alt || product.name}
              width="800"
              height="1000"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = createSvgFallbackDataUri(product.name, product.purity, product.sku);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isDemoProduct && (
              <span className="px-2.5 py-1 rounded-full bg-[#FAF8F4]/95 border border-[#C89B5C] text-[10px] font-bold uppercase tracking-wider text-[#3C2B20]">
                Demo Reference Photo
              </span>
            )}
            {hasDiscount && (
              <span className="px-2.5 py-1 rounded-full bg-[#C89B5C] text-white text-[10px] font-semibold uppercase tracking-wider w-fit">
                {discountPct}% Savings
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2.5 py-1 rounded-full bg-[#3C2B20] text-[#FAF8F4] text-[10px] font-medium uppercase tracking-wider w-fit">
                New Arrival
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={`Save ${product.name} to Wishlist`}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FAF8F4]/90 border border-[#E9DED0] flex items-center justify-center hover:border-[#C89B5C] transition"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#C89B5C] text-[#C89B5C]' : 'text-[#3C2B20]'
              }`}
            />
          </button>
        </div>

        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#827466]">
            <span className="uppercase tracking-wider font-semibold text-[#C89B5C]">
              {categoryName}
            </span>
            <span className="font-mono">{product.sku}</span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="font-serif text-xl font-semibold text-[#3C2B20] hover:text-[#C89B5C] transition line-clamp-2 block"
          >
            {product.name}
          </Link>

          <p className="text-xs text-[#827466] line-clamp-2">{product.shortDescription}</p>

          <div className="pt-1 flex items-baseline gap-2.5">
            <span className="font-serif text-2xl font-bold text-[#3C2B20]">
              {formatINR(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#827466] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#827466] flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded bg-[#FAF8F4] border border-[#E9DED0]">
              {product.purity}
            </span>
            {product.weightGrams && (
              <span className="px-2 py-0.5 rounded bg-[#FAF8F4] border border-[#E9DED0]">
                {product.weightGrams}g
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 flex items-center gap-2">
        <Link
          to={`/product/${product.slug}`}
          className="flex-1 py-2.5 px-3 rounded-xl border border-[#C89B5C] bg-white hover:bg-[#F4EEE5] text-xs font-semibold text-[#3C2B20] transition text-center"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => handleWhatsAppEnquiry(product, 'quick_card')}
          className="py-2.5 px-3.5 rounded-xl bg-[#C89B5C] hover:bg-[#b5894c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enquire</span>
        </button>
      </div>
    </article>
  );
}
