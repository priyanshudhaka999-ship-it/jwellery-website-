import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';

export default function AboutPage() {
  const { settings } = useStore();

  useEffect(() => {
    updatePageMeta({
      title: 'Our Heritage, Craftsmanship & Quality Philosophy | AARANYA',
      description: 'Learn about AARANYA’s Indian goldsmithing heritage, Bikaneri Kundan karigari, and BIS 916 hallmark quality standards.',
    });
  }, []);

  const about = settings?.aboutUsContent || {};

  return (
    <div>
      <section className="bg-[#F4EEE5] border-b border-[#E9DED0] py-14">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold">
            Our Story &amp; Philosophy
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-[#3C2B20] leading-tight">
            {about.storyHeading || 'Rooted in Royal Karigari, Crafted for Modern Heirloom Keepers'}
          </h1>
          <p className="text-sm sm:text-base text-[#827466] leading-relaxed">
            {about.storyBody}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-7 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C89B5C] font-bold">
              01 • Jewellery Heritage
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
              Preserving Classical Indian Lineages
            </h2>
            <p className="text-xs text-[#827466] leading-relaxed">{about.heritageText}</p>
          </div>
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-7 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C89B5C] font-bold">
              02 • Karigar Craftsmanship
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
              Hand-Forged Masterworks
            </h2>
            <p className="text-xs text-[#827466] leading-relaxed">{about.craftsmanshipText}</p>
          </div>
          <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-7 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C89B5C] font-bold">
              03 • Quality Philosophy
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">
              Verified Purity &amp; Weight
            </h2>
            <p className="text-xs text-[#827466] leading-relaxed">{about.qualityPhilosophy}</p>
          </div>
        </div>

        <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs uppercase tracking-widest text-[#C89B5C] font-bold">
              Private Showroom Consultations
            </p>
            <h3 className="font-serif text-3xl text-[#3C2B20]">
              Experience Our Bridal &amp; Heritage Archives in Person
            </h3>
            <p className="text-xs text-[#827466]">
              Book an unhurried showroom appointment with our jewellery specialists.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-xl bg-[#C89B5C] text-white text-xs font-semibold shrink-0"
          >
            Schedule a Showroom Visit
          </Link>
        </div>
      </section>
    </div>
  );
}
