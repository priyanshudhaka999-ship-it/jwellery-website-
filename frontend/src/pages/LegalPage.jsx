import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';

export default function LegalPage({ type = 'privacy' }) {
  const { settings } = useStore();

  const titles = {
    privacy: 'Privacy Policy | AARANYA',
    terms: 'Terms and Conditions | AARANYA',
    returns: 'Return and Exchange Policy | AARANYA',
    disclaimer: 'Pricing and Availability Disclaimer | AARANYA',
  };

  useEffect(() => {
    updatePageMeta({
      title: titles[type] || titles.privacy,
      description: 'Official store governance, privacy practices, terms of usage, and bullion pricing disclaimers for AARANYA.',
    });
  }, [type]);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-[#E9DED0] pb-4">
        <Link
          to="/privacy-policy"
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'privacy' ? 'bg-[#C89B5C] text-white' : 'bg-[#F7F2EA] text-[#3C2B20]'
          }`}
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-and-conditions"
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'terms' ? 'bg-[#C89B5C] text-white' : 'bg-[#F7F2EA] text-[#3C2B20]'
          }`}
        >
          Terms &amp; Conditions
        </Link>
        <Link
          to="/return-and-exchange-policy"
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'returns' ? 'bg-[#C89B5C] text-white' : 'bg-[#F7F2EA] text-[#3C2B20]'
          }`}
        >
          Return &amp; Exchange Policy
        </Link>
        <Link
          to="/pricing-disclaimer"
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'disclaimer' ? 'bg-[#C89B5C] text-white' : 'bg-[#F7F2EA] text-[#3C2B20]'
          }`}
        >
          Pricing &amp; Availability Disclaimer
        </Link>
      </div>

      <div className="bg-[#F7F2EA] border border-[#E9DED0] rounded-3xl p-8 space-y-5 text-xs sm:text-sm text-[#3C2B20] leading-relaxed">
        {type === 'privacy' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Privacy Policy</h1>
            <p className="text-[#827466]">Last Updated: November 2026</p>
            <h2 className="font-serif text-xl font-semibold pt-2">1. Information We Collect</h2>
            <p>
              AARANYA allows guests to browse our entire jewellery catalogue and save a Wishlist in browser local storage without creating an account. We only collect personal contact details when you voluntarily submit our Contact Form or share details during a WhatsApp enquiry.
            </p>
            <h2 className="font-serif text-xl font-semibold pt-2">2. Analytics &amp; Cookie Consent</h2>
            <p>
              Non-essential analytics cookies (Google Analytics 4) are strictly disabled by default and only load if you explicitly opt in via our Cookie Consent banner.
            </p>
            <h2 className="font-serif text-xl font-semibold pt-2">3. Contact for Privacy Questions</h2>
            <p>For data access or deletion requests, contact {settings?.email}.</p>
          </>
        )}

        {type === 'terms' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Terms and Conditions</h1>
            <p>
              This website serves as an informational showcase and enquiry platform for AARANYA’s physical showroom. Placing an enquiry via WhatsApp or the Contact Form does not constitute a binding online sale contract.
            </p>
            <p>
              Because traditional Indian Kundan, Polki, and Nakshi temple jewellery is handcrafted by master karigars, minor natural variations in gemstone matrix, pearl shape, and gross/net gold weight may occur between pieces.
            </p>
          </>
        )}

        {type === 'returns' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">
              Return and Exchange Policy
            </h1>
            <p>
              Unused, unworn showroom pieces in original condition with intact security tags, original invoice, BIS HUID hallmark certificate, and gem report may be presented at our showroom within 7 days for a showroom exchange, subject to physical inspection by our assay desk.
            </p>
          </>
        )}

        {type === 'disclaimer' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">
              Pricing and Availability Disclaimer
            </h1>
            <p>
              All INR prices displayed on AARANYA are indicative estimates based on the piece’s recorded net gold weight, stone caratage, and making charges. Final billing at our physical showroom is calculated using the prevailing daily bullion rate and certified digital scale verification in your presence.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
