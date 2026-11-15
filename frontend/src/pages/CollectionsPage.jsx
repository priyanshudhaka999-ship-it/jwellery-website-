import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { updatePageMeta } from '../utils/seo';
import { formatINR } from '../utils/fallbackData';

export default function CollectionsPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'All');
  const [metalType, setMetalType] = useState('All');
  const [occasion, setOccasion] = useState('All');
  const [stoneFilter, setStoneFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(600000);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const catParam = searchParams.get('category');
    const colParam = searchParams.get('collection');
    if (catParam) setSelectedCategory(catParam);
    if (colParam) setSelectedCollection(colParam);
  }, [searchParams]);

  useEffect(() => {
    updatePageMeta({
      title:
        selectedCategory !== 'All'
          ? `${selectedCategory} | AARANYA`
          : 'All Fine Jewellery Collections | AARANYA',
      description: `Browse AARANYA's ${
        selectedCategory !== 'All' ? selectedCategory : '13-category Indian jewellery'
      } catalogue with transparent INR prices, BIS 916 hallmark details, and WhatsApp enquiry.`,
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (!filtersOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setFiltersOpen(false);
    };
    const closeOnDesktopResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setFiltersOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktopResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktopResize);
    };
  }, [filtersOpen]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.isActive !== false);

    if (selectedCategory !== 'All') {
      list = list.filter((p) => {
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        return (
          catName === selectedCategory ||
          (p.secondaryCategories || []).includes(selectedCategory)
        );
      });
    }

    if (selectedCollection !== 'All') {
      list = list.filter((p) => {
        const colName =
          typeof p.collectionRef === 'object' ? p.collectionRef?.name : p.collection;
        return colName === selectedCollection;
      });
    }

    if (metalType !== 'All') {
      list = list.filter((p) => p.metalType === metalType);
    }

    if (occasion !== 'All') {
      list = list.filter((p) => p.occasion === occasion);
    }

    if (stoneFilter !== 'All') {
      list = list.filter((p) =>
        (p.stoneDetails || '').toLowerCase().includes(stoneFilter.toLowerCase())
      );
    }

    if (maxPrice) {
      list = list.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.stoneDetails || '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular')
      list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

    return list;
  }, [
    products,
    selectedCategory,
    selectedCollection,
    metalType,
    occasion,
    stoneFilter,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setMetalType('All');
    setOccasion('All');
    setStoneFilter('All');
    setMaxPrice(600000);
    setSortBy('newest');
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const renderCategoryFilters = (mobile = false) => (
    <div
      className={
        mobile
          ? 'flex flex-wrap gap-2 pb-5 mb-5 border-b border-[#E9DED0]'
          : 'flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#E9DED0]'
      }
    >
      <button
        type="button"
        onClick={() => {
          setSelectedCategory('All');
          setPage(1);
        }}
        className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
          selectedCategory === 'All'
            ? 'bg-[#C89B5C] text-white border-[#C89B5C]'
            : 'bg-[#F7F2EA] text-[#3C2B20] border-[#E9DED0] hover:border-[#C89B5C]'
        }`}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id || cat.slug}
          type="button"
          onClick={() => {
            setSelectedCategory(cat.name);
            setPage(1);
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
            selectedCategory === cat.name
              ? 'bg-[#C89B5C] text-white border-[#C89B5C]'
              : 'bg-[#F7F2EA] text-[#3C2B20] border-[#E9DED0] hover:border-[#C89B5C]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );

  const renderAttributeFilters = (mobile = false) => (
    <div
      className={`bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-5 mb-8 grid gap-4 items-end ${
        mobile ? 'grid-cols-1 mb-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
      }`}
    >
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Search Name / SKU
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          placeholder="e.g. Kundan, AAR-KND..."
          className="w-full px-3 py-2 rounded-lg border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Metal Filter
        </label>
        <select
          value={metalType}
          onChange={(e) => {
            setMetalType(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 rounded-lg border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
        >
          <option value="All">All Metals</option>
          <option value="Gold">22K Gold</option>
          <option value="Kundan & Gold">Kundan &amp; Gold</option>
          <option value="Polki & Gold">Polki &amp; Gold</option>
          <option value="Temple Gold">Temple Gold</option>
          <option value="Diamond & Gold">18K Gold &amp; Diamond</option>
          <option value="Silver">92.5 Sterling Silver</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Occasion
        </label>
        <select
          value={occasion}
          onChange={(e) => {
            setOccasion(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 rounded-lg border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
        >
          <option value="All">All Occasions</option>
          <option value="Bridal">Bridal</option>
          <option value="Festive">Festive</option>
          <option value="Temple & Ceremonial">Temple &amp; Ceremonial</option>
          <option value="Cocktail & Evening">Cocktail &amp; Evening</option>
          <option value="Everyday Luxury">Everyday Luxury</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Gemstone Filter
        </label>
        <select
          value={stoneFilter}
          onChange={(e) => {
            setStoneFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 rounded-lg border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
        >
          <option value="All">All Gemstones</option>
          <option value="Polki">Uncut Polki</option>
          <option value="Ruby">Burmese Ruby</option>
          <option value="Emerald">Emerald</option>
          <option value="Pearl">Natural Pearls</option>
          <option value="Solitaire">Solitaire Diamond</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Max Price: <strong className="text-[#3C2B20]">{formatINR(maxPrice)}</strong>
        </label>
        <input
          type="range"
          min="25000"
          max="600000"
          step="5000"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setPage(1);
          }}
          className="w-full accent-[#C89B5C]"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#827466] mb-1">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#E9DED0] bg-white text-xs text-[#3C2B20]"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <section className="bg-[#F4EEE5] border-b border-[#E9DED0] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
            AARANYA Catalogue • 13 Categories
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
            {selectedCategory === 'All' ? 'All Fine Jewellery Collections' : selectedCategory}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end md:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Open search filters"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E9DED0] bg-[#F7F2EA] px-4 py-2.5 text-sm font-semibold text-[#3C2B20] hover:border-[#C89B5C]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#C89B5C]" />
            Filters
          </button>
        </div>

        <div className="hidden md:block">
          {renderCategoryFilters()}
          {renderAttributeFilters()}
        </div>

        {filtersOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close search filters"
              className="absolute inset-0 h-full w-full bg-black/40"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filter-title"
              className="relative z-10 ml-auto flex h-full w-[min(90vw,24rem)] flex-col border-l border-[#E9DED0] bg-[#FAF8F4] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E9DED0] px-5 py-4">
                <h2 id="mobile-filter-title" className="font-serif text-2xl font-semibold text-[#3C2B20]">
                  Search Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close search filters"
                  className="rounded-full p-2 text-[#3C2B20] hover:bg-[#F4EEE5]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {renderCategoryFilters(true)}
                {renderAttributeFilters(true)}
              </div>

              <div className="flex gap-3 border-t border-[#E9DED0] bg-[#FAF8F4] p-4">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    setFiltersOpen(false);
                  }}
                  className="flex-1 rounded-xl border border-[#C89B5C] px-4 py-3 text-xs font-semibold text-[#3C2B20]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 rounded-xl bg-[#C89B5C] px-4 py-3 text-xs font-semibold text-white"
                >
                  Show {filteredProducts.length} Pieces
                </button>
              </div>
            </aside>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 text-xs text-[#827466]">
          <p>
            Showing <strong className="text-[#3C2B20]">{paginatedProducts.length}</strong> of{' '}
            <strong className="text-[#3C2B20]">{filteredProducts.length}</strong> hallmarked pieces
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="text-[#C89B5C] hover:text-[#3C2B20] font-semibold underline"
          >
            Reset All Filters
          </button>
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4">
            <h3 className="font-serif text-3xl text-[#3C2B20]">
              No Pieces Match Your Current Filters
            </h3>
            <p className="text-xs text-[#827466]">
              Try increasing the price slider or resetting your category and stone filters.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold"
            >
              Show All Jewellery
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
              <button
                key={pNum}
                type="button"
                onClick={() => {
                  setPage(pNum);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-9 h-9 rounded-lg border text-xs font-semibold ${
                  pNum === currentPage
                    ? 'bg-[#C89B5C] text-white border-[#C89B5C]'
                    : 'bg-[#F7F2EA] text-[#3C2B20] border-[#E9DED0]'
                }`}
              >
                {pNum}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
