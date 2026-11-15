import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updatePageMeta } from '../utils/seo';

export default function NotFoundPage() {
  useEffect(() => {
    updatePageMeta({
      title: 'Page Not Found (404) | AARANYA',
      description: 'The page you are looking for could not be found in the AARANYA Indian Jewellery catalogue.',
    });
  }, []);

  return (
    <main className="min-h-[75vh] bg-[#FAF8F4] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-8 md:p-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#F4EEE5] border border-[#E9DED0] text-[11px] uppercase tracking-[0.25em] text-[#C89B5C] mb-4">
          Error 404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#3C2B20] mb-4">
          This Vault Door Leads Nowhere
        </h1>
        <p className="text-sm text-[#827466] leading-relaxed mb-8">
          The jewellery creation or page address you entered may have been moved, reserved, or retired from our active showroom catalogue.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-[#C89B5C] text-white text-sm font-medium hover:bg-[#b5894c] transition"
          >
            Return Home
          </Link>
          <Link
            to="/collections"
            className="px-6 py-3 rounded-lg border border-[#C89B5C] bg-white text-[#3C2B20] text-sm font-medium hover:bg-[#F4EEE5] transition"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
