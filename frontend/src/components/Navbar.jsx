import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

function NavFlourish({ active }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 12"
      className={`pointer-events-none absolute left-1/2 top-full h-3 w-[calc(100%+12px)] -translate-x-1/2 overflow-visible transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
      }`}
      fill="none"
      stroke="#B88A44"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7h17c8 0 9-4 17-4 6 0 8 4 14 4s8-4 14-4c8 0 9 4 17 4h17" />
      <path d="M21 6c-4-4-8-4-10-2 1 4 5 5 10 2Z" />
      <path d="M79 6c4-4 8-4 10-2-1 4-5 5-10 2Z" />
      <path d="M37 4c-2-3-5-3-7-2 1 3 3 4 7 2Z" />
      <path d="M63 4c2-3 5-3 7-2-1 3-3 4-7 2Z" />
      <path d="M47 7c0-3 2-4 3-5 1 1 3 2 3 5-1 2-5 2-6 0Z" />
    </svg>
  );
}

export default function Navbar() {
  const { settings, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItemClass = ({ isActive }) =>
    `group relative inline-flex flex-col items-center py-1 tracking-[0.03em] transition-colors duration-300 ${
      isActive
        ? 'text-[#6E4E2E] font-semibold'
        : 'text-[#3C2B20] hover:text-[#6E4E2E]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur border-b border-[#E9DED0]">
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full border-2 border-[#C89B5C] bg-[#F7F2EA] flex items-center justify-center font-serif text-2xl font-bold text-[#3C2B20] group-hover:bg-[#F4EEE5] transition">
            A
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-semibold text-[#3C2B20] block leading-none">
              {settings?.brandName || 'AARANYA'}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#827466] block mt-1">
              Timeless Indian Jewellery
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <NavLink to="/" end className={navItemClass}>
            {({ isActive }) => (
              <>
                <span>Home</span>
                <NavFlourish active={isActive} />
              </>
            )}
          </NavLink>
          <NavLink to="/collections" className={navItemClass}>
            {({ isActive }) => (
              <>
                <span>Collections</span>
                <NavFlourish active={isActive} />
              </>
            )}
          </NavLink>
          <Link
            to="/collections?category=Bridal+Jewellery"
            className={navItemClass({ isActive: false })}
          >
            <span>Bridal</span>
            <NavFlourish active={false} />
          </Link>
          <NavLink to="/about" className={navItemClass}>
            {({ isActive }) => (
              <>
                <span>About &amp; Heritage</span>
                <NavFlourish active={isActive} />
              </>
            )}
          </NavLink>
          <NavLink to="/faq" className={navItemClass}>
            {({ isActive }) => (
              <>
                <span>FAQ</span>
                <NavFlourish active={isActive} />
              </>
            )}
          </NavLink>
          <NavLink to="/contact" className={navItemClass}>
            {({ isActive }) => (
              <>
                <span>Visit Store</span>
                <NavFlourish active={isActive} />
              </>
            )}
          </NavLink>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/search')}
            aria-label="Search Jewellery Catalogue"
            className="p-2.5 rounded-full hover:bg-[#F4EEE5] text-[#3C2B20] transition"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/wishlist"
            aria-label="View Saved Wishlist"
            className="relative p-2.5 rounded-full hover:bg-[#F4EEE5] text-[#3C2B20] transition"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C89B5C] text-white text-[11px] flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden p-2 rounded-lg border border-[#E9DED0] bg-[#F7F2EA]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FAF8F4] border-b border-[#E9DED0] px-4 pt-2 pb-5 space-y-2 text-sm font-medium">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Home
          </Link>
          <Link to="/collections" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            All Jewellery Collections (13 Categories)
          </Link>
          <Link to="/collections?category=Bridal+Jewellery" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Bridal Jewellery
          </Link>
          <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Saved Wishlist ({wishlist.length})
          </Link>
          <Link to="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Search Catalogue &amp; SKU
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            About Us &amp; Heritage
          </Link>
          <Link to="/faq" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Frequently Asked Questions
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-[#F4EEE5]">
            Contact &amp; Showroom Location
          </Link>
        </div>
      )}
    </header>
  );
}
