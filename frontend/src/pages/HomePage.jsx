import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { updatePageMeta } from '../utils/seo';
import { createSvgFallbackDataUri } from '../utils/fallbackData';

export default function HomePage() {
  const { products, categories, collections, testimonials, settings } = useStore();
  const homepageRef = useRef(null);

  useEffect(() => {
    updatePageMeta({
      title: 'AARANYA | Indian Jewellery — 22K Gold, Kundan, Polki & Bridal Showroom',
      description:
        'Explore AARANYA Timeless Indian Jewellery. BIS 916 Hallmarked 22K gold, Bikaneri Kundan, uncut Polki, diamond solitaires, and temple jewellery with direct WhatsApp concierge.',
    });
  }, []);

  useLayoutEffect(() => {
    const homepage = homepageRef.current;
    if (
      !homepage ||
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const sections = Array.from(homepage.children).filter(
      (child) => child.tagName.toLowerCase() === 'section'
    );
    if (!sections.length) return undefined;

    homepage.dataset.scrollRevealReady = 'true';
    sections.forEach((section, index) => {
      section.dataset.scrollReveal = index % 2 === 0 ? 'left' : 'right';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.scrollVisible = 'true';
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      delete homepage.dataset.scrollRevealReady;
      sections.forEach((section) => {
        delete section.dataset.scrollReveal;
        delete section.dataset.scrollVisible;
      });
    };
  }, []);

  const activeProducts = products.filter((p) => p.isActive !== false);
  const newArrivals = activeProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const bestsellers = activeProducts.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div ref={homepageRef} className="home-page space-y-16">
      {/* HERO BANNER WITH ABOVE-THE-FOLD CTAs (Section 4.A & Checklist #4) */}
      <section className="bg-[#F4EEE5] border-b border-[#E9DED0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F4] border border-[#D8B982] text-xs font-medium text-[#3C2B20]">
                <span className="w-2 h-2 rounded-full bg-[#C89B5C]" />
                <span>BIS 916 Hallmarked • Heritage Karigari</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#3C2B20] leading-[1.08]">
                Timeless Indian Jewellery
              </h1>

              <p className="text-base sm:text-lg text-[#827466] leading-relaxed max-w-2xl">
                Handcrafted BIS 916 Hallmarked 22K Gold, Royal Bikaneri Kundan, and Certified Uncut Polki Heirlooms. Enquire on WhatsApp or visit our flagship showroom.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/collections"
                  className="px-7 py-3.5 rounded-xl bg-[#C89B5C] hover:bg-[#b5894c] text-white text-sm font-semibold shadow-sm inline-flex items-center gap-2 transition"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/collections?category=Bridal+Jewellery"
                  className="px-6 py-3.5 rounded-xl border border-[#C89B5C] bg-white hover:bg-[#FAF8F4] text-[#3C2B20] text-sm font-semibold transition"
                >
                  Discover Bridal Trousseau
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-[#FAF8F4] border border-[#E9DED0] hover:border-[#C89B5C] text-sm font-semibold text-[#3C2B20] inline-flex items-center gap-2 transition"
                >
                  <MapPin className="w-4 h-4 text-[#C89B5C]" />
                  <span>Visit Our Store</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E9DED0] max-w-xl">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#3C2B20]">BIS 916</p>
                  <p className="text-xs text-[#827466]">HUID Hallmarked Gold</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#3C2B20]">24K Foil</p>
                  <p className="text-xs text-[#827466]">Authentic Jadau Kundan</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#3C2B20]">Direct</p>
                  <p className="text-xs text-[#827466]">WhatsApp &amp; Store Viewing</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D8B982] bg-[#F7F2EA] shadow-xl aspect-[4/5]">
                <img
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=1200"
                  alt="Royal Kundan necklace with pearls, rubies, diamonds and emerald"
                  width="900"
                  height="1125"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = createSvgFallbackDataUri('Timeless Indian Jewellery', 'AARANYA Bridal Kundan Showcase', 'HERO-01');
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 inset-x-4 bg-[#FAF8F4]/95 backdrop-blur border border-[#E9DED0] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#C89B5C] font-bold">
                      Featured Archive Piece
                    </p>
                    <p className="font-serif text-lg font-semibold text-[#3C2B20]">
                      Maharani Bikaneri Kundan Choker
                    </p>
                  </div>
                  <Link
                    to="/product/maharani-bikaneri-jadau-kundan-emerald-choker"
                    className="px-3.5 py-2 rounded-lg bg-[#C89B5C] text-white text-xs font-semibold shrink-0"
                  >
                    View Piece
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#F4EEE5] border-y border-[#E9DED0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
                Fresh from the Karigar Karkhana
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20]">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/collections"
              className="px-4 py-2 rounded-lg border border-[#C89B5C] bg-[#FAF8F4] text-xs font-semibold text-[#3C2B20] hover:bg-white transition"
            >
              Browse Full Catalogue
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS & BRIDAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
              Signature Archives
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20]">
              Featured Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col._id || col.slug}
                className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[16/10] bg-[#F4EEE5] overflow-hidden">
                  <img
                    src={col.bannerImage?.url}
                    alt={col.bannerImage?.alt || col.name}
                    width="800"
                    height="500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = createSvgFallbackDataUri(col.name, col.subtitle, 'COLLECTION');
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-[#C89B5C] font-semibold">
                      {col.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl font-semibold text-[#3C2B20] mt-1">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#827466] leading-relaxed mt-2">{col.description}</p>
                  </div>
                  <Link
                    to={`/collections?collection=${encodeURIComponent(col.name)}`}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#C89B5C] bg-[#FAF8F4] hover:bg-[#C89B5C] hover:text-white text-xs font-semibold text-[#3C2B20] transition text-center block"
                  >
                    Explore {col.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bridal Jewellery Section */}
        <div className="rounded-3xl bg-[#F7F2EA] border-2 border-[#D8B982] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#C89B5C] text-[11px] uppercase tracking-widest text-[#C89B5C] font-semibold">
              The AARANYA Bridal Salon
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#3C2B20] leading-tight">
              Bespoke Indian Bridal Trousseau Consultations
            </h2>
            <p className="text-sm text-[#827466] leading-relaxed">
              From layered Bikaneri Jadau Rani Haars and uncut Polki chokers to Dakshin mango-malai temple sets, our bridal specialists host private family viewings at our showroom with complete weight &amp; hallmark transparency.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/collections?category=Bridal+Jewellery"
                className="px-6 py-3 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold"
              >
                Explore Bridal Collection
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl border border-[#C89B5C] bg-white text-[#3C2B20] text-xs font-semibold"
              >
                Book a Private Showroom Slot
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E9DED0]">
              <p className="font-serif text-2xl font-bold text-[#C89B5C]">100%</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-1">Net Gold Transparency</p>
              <p className="text-[11px] text-[#827466] mt-1">
                Stone, lac, and enamel weights are deducted and itemised separately.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E9DED0]">
              <p className="font-serif text-2xl font-bold text-[#C89B5C]">48-Hr</p>
              <p className="text-xs font-semibold text-[#3C2B20] mt-1">Showroom Piece Hold</p>
              <p className="text-[11px] text-[#827466] mt-1">
                Shortlist via WhatsApp and reserve pieces for your in-person trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
              Most Enquired Showroom Creations
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20]">
              Bestsellers
            </h2>
          </div>
          <Link to="/collections" className="text-xs font-semibold text-[#C89B5C] hover:text-[#3C2B20]">
            Explore All Pieces &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY (All 13 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold mb-2">
              Curated Silversmith &amp; Goldsmith Lineages
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20]">
              Shop by Jewellery Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs font-semibold text-[#C89B5C] hover:text-[#3C2B20] inline-flex items-center gap-1.5"
          >
            <span>View All 13 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/collections?category=${encodeURIComponent(cat.name)}`}
              className="bg-[#F7F2EA] border border-[#E9DED0] hover:border-[#C89B5C] rounded-xl p-4 flex flex-col justify-between transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#FAF8F4] border border-[#E9DED0] flex items-center justify-center font-serif text-sm font-bold text-[#C89B5C] group-hover:bg-[#C89B5C] group-hover:text-white transition">
                  {cat.name.charAt(0)}
                </span>
                <span className="text-[11px] text-[#827466]">Explore &rarr;</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3C2B20] group-hover:text-[#C89B5C] transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#827466] line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BRAND HERITAGE & CUSTOMER TESTIMONIALS */}
      <section className="bg-[#F4EEE5] border-y border-[#E9DED0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold">
              The AARANYA Lineage
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3C2B20]">
              {settings?.aboutUsContent?.storyHeading}
            </h2>
            <p className="text-sm text-[#827466] leading-relaxed">
              {settings?.aboutUsContent?.storyBody}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-[#FAF8F4] border border-[#E9DED0] rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="text-[#C89B5C] text-sm">{'★'.repeat(t.rating || 5)}</div>
                  <p className="text-xs text-[#3C2B20] leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="pt-3 border-t border-[#E9DED0]">
                  <p className="font-serif text-lg font-semibold text-[#3C2B20]">{t.customerName}</p>
                  <p className="text-[11px] text-[#827466]">
                    {t.occasionPurchased} • {t.customerLocation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E9DED0] text-[10px] uppercase tracking-widest text-[#C89B5C] font-bold">
              Flagship Showroom Location
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#3C2B20]">
              Visit Our Physical Jewellery Showroom
            </h2>
            <p className="text-xs text-[#827466] leading-relaxed">{settings?.storeAddress}</p>
            <p className="text-xs text-[#3C2B20]">
              <strong>Hours:</strong> {settings?.businessHours} • <strong>Phone:</strong>{' '}
              {settings?.phoneNumber}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={settings?.googleMapsLink || 'https://maps.google.com/?q=28.6506,77.2303'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold inline-flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-[#C89B5C] bg-white text-[#3C2B20] text-xs font-semibold"
            >
              Contact Showroom
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
