import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import { useStore } from '../context/StoreContext';

export default function ThankYouPage() {
  const { settings } = useStore();
  const location = useLocation();
  const submission = location.state?.submission;

  useEffect(() => {
    updatePageMeta({
      title: 'Thank You for Contacting Us | AARANYA',
      description: 'Your showroom consultation and enquiry has been recorded by the AARANYA team.',
    });
  }, []);

  const whatsappUrl = `https://wa.me/${String(settings?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Namaste AARANYA Concierge, I just submitted a contact form on your website and would like to connect regarding a showroom visit.'
  )}`;

  return (
    <main className="min-h-[75vh] bg-[#FAF8F4] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-8 md:p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[#C89B5C]/15 border border-[#C89B5C] flex items-center justify-center mx-auto mb-5 text-[#C89B5C]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] mb-2">
          Enquiry Confirmed & Saved
        </p>
        <h1 className="font-serif text-4xl text-[#3C2B20] mb-3">
          Dhanyavaad — Thank You for Reaching Out
        </h1>
        <p className="text-sm text-[#827466] leading-relaxed mb-6">
          Your message has been verified and saved in our showroom records
          {submission?.contactId ? ` (Reference ID: ${submission.contactId})` : ''}. Our jewellery concierge will respond within 4 business hours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C89B5C] text-white text-sm font-medium hover:bg-[#b5894c] transition"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#C89B5C] bg-white text-[#3C2B20] text-sm font-medium hover:bg-[#F4EEE5] transition"
          >
            <MessageCircle className="w-4 h-4 text-[#C89B5C]" />
            Connect on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
