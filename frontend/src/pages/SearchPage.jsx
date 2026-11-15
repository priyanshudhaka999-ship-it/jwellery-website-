import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { updatePageMeta } from '../utils/seo';

export default function SearchPage() {
  const { products } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    updatePageMeta({
      title: 'Search Catalogue by Name, SKU or Category | AARANYA',
      description: 'Search the AARANYA Indian jewellery catalogue by product name, SKU code, gemstone, or category.',
    });
  }, []);

  const q = query.trim().toLowerCase();
  const results = products.filter((p) => {
    if (p.isActive === false) return false;
    if (!q) return true;
    const catName = typeof p.category === 'object' ? p.category?.name : p.category;
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (catName || '').toLowerCase().includes(q) ||
      (p.stoneDetails || '').toLowerCase().includes(q) ||
      (p.metalType || '').toLowerCase().includes(q)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold">
          Instant Catalogue &amp; SKU Lookup
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
          Search AARANYA Creations
        </h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Product Name, SKU (e.g. AAR-KND-001), or Category..."
            className="w-full pl-5 pr-12 py-4 rounded-2xl border-2 border-[#C89B5C] bg-white text-sm text-[#3C2B20] focus:outline-none"
          />
          <Search className="w-5 h-5 text-[#C89B5C] absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#827466]">Popular Searches:</span>
          {['AAR-KND-001', 'Kundan', 'Polki', 'Temple', 'Jhumka', 'Solitaire', 'Mangalsutra', 'Bridal'].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3 py-1 rounded-full bg-[#F7F2EA] border border-[#E9DED0] hover:border-[#C89B5C] text-[#3C2B20]"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3">
          <h2 className="font-serif text-3xl text-[#3C2B20]">
            No Matches Found for "{query}"
          </h2>
          <p className="text-xs text-[#827466]">
            Check the SKU code or try searching for Kundan, Polki, Bangles, or Temple Gold.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="px-5 py-2.5 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold"
          >
            Reset Search
          </button>
        </div>
      )}
    </section>
  );
}
