import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { updatePageMeta } from '../utils/seo';

export default function WishlistPage() {
  const { wishlist } = useStore();

  useEffect(() => {
    updatePageMeta({
      title: 'Saved Guest Wishlist | AARANYA',
      description: 'Review your saved AARANYA Indian jewellery creations and enquire on WhatsApp without mandatory registration.',
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E9DED0]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
            Guest Persistence • Zero Registration Required
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
            Your Saved Wishlist ({wishlist.length})
          </h1>
        </div>
        <Link
          to="/collections"
          className="px-5 py-2.5 rounded-xl border border-[#C89B5C] bg-white text-xs font-semibold text-[#3C2B20]"
        >
          Continue Exploring Catalogue
        </Link>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-4">
          <Heart className="w-10 h-10 text-[#C89B5C] mx-auto" />
          <h2 className="font-serif text-3xl text-[#3C2B20]">Your Wishlist Vault is Empty</h2>
          <p className="text-xs text-[#827466] leading-relaxed">
            Tap the heart icon on any Kundan, Polki, gold, or temple creation to shortlist pieces for your showroom visit or WhatsApp enquiry.
          </p>
          <Link
            to="/collections"
            className="inline-block px-6 py-3 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold"
          >
            Explore Collections
          </Link>
        </div>
      )}
    </section>
  );
}
