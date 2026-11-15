import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-[#F4EEE5] border-t border-[#E9DED0] text-[#3C2B20] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#C89B5C] bg-[#FAF8F4] flex items-center justify-center font-serif text-lg font-bold">
                A
              </div>
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold">
                {settings?.brandName || 'AARANYA'}
              </span>
            </div>
            <p className="text-xs text-[#827466] leading-relaxed">
              Handcrafted BIS 916 Hallmarked 22K Gold, Royal Bikaneri Kundan, Uncut Syndicate Polki, and Temple Heirlooms. Visit our flagship showroom for private bridal consultations.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs font-medium text-[#C89B5C]">
              <a href={settings?.socialLinks?.instagram || 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
              <span>•</span>
              <a href={settings?.socialLinks?.facebook || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
              <span>•</span>
              <a href={settings?.socialLinks?.youtube || 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                YouTube
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-[#3C2B20]">Curated Categories</h3>
            <ul className="space-y-2 text-xs text-[#827466]">
              <li><Link to="/collections?category=Kundan+Jewellery" className="hover:text-[#3C2B20]">Bikaneri Kundan Jewellery</Link></li>
              <li><Link to="/collections?category=Polki+Jewellery" className="hover:text-[#3C2B20]">Uncut Polki Heirlooms</Link></li>
              <li><Link to="/collections?category=Bridal+Jewellery" className="hover:text-[#3C2B20]">Royal Bridal Trousseau</Link></li>
              <li><Link to="/collections?category=Temple+Jewellery" className="hover:text-[#3C2B20]">Dakshin Temple Nakshi</Link></li>
              <li><Link to="/collections?category=Gold+Jewellery" className="hover:text-[#3C2B20]">22K BIS 916 Gold Jewellery</Link></li>
              <li><Link to="/collections?category=Diamond+Jewellery" className="hover:text-[#3C2B20]">Certified Solitaire Diamonds</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal Policies */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-[#3C2B20]">Policies &amp; Governance</h3>
            <ul className="space-y-2 text-xs text-[#827466]">
              <li><Link to="/privacy-policy" className="hover:text-[#3C2B20]">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-[#3C2B20]">Terms &amp; Conditions</Link></li>
              <li><Link to="/return-and-exchange-policy" className="hover:text-[#3C2B20]">Return &amp; Exchange Policy</Link></li>
              <li><Link to="/pricing-disclaimer" className="hover:text-[#3C2B20]">Pricing &amp; Availability Disclaimer</Link></li>
              <li><Link to="/faq" className="hover:text-[#3C2B20]">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Col 4: Showroom Contact */}
          <div className="space-y-2.5 text-xs text-[#827466]">
            <h3 className="font-serif text-lg font-semibold mb-3 text-[#3C2B20]">Flagship Showroom</h3>
            <p className="leading-relaxed">{settings?.storeAddress}</p>
            <p><strong className="text-[#3C2B20]">Phone:</strong> {settings?.phoneNumber}</p>
            <p><strong className="text-[#3C2B20]">WhatsApp:</strong> +{settings?.whatsappNumber}</p>
            <p><strong className="text-[#3C2B20]">Email:</strong> {settings?.email}</p>
            <p><strong className="text-[#3C2B20]">Hours:</strong> {settings?.businessHours}</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E9DED0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#827466]">
          <p>{settings?.footerContent?.copyrightText || '© 2026 AARANYA Fine Indian Jewellery. All Rights Reserved.'}</p>
          <p className="max-w-xl text-center sm:text-right">
            {settings?.footerContent?.disclaimerNote ||
              'Catalogue prices are indicative in INR and subject to daily bullion rate adjustments and verified physical piece weight at our showroom.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
