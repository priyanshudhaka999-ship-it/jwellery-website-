import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';

export default function FAQPage() {
  const { faqs } = useStore();

  useEffect(() => {
    updatePageMeta({
      title: 'Frequently Asked Questions — Materials, Care & Visits | AARANYA',
      description: 'Answers about AARANYA BIS 916 hallmarking, Kundan & Polki care, showroom visits, bespoke customisation, and exchange policies.',
    });
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold">
          Client Guidance
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq._id || faq.question}
            className="bg-[#F7F2EA] border border-[#E9DED0] rounded-2xl p-6 space-y-2"
          >
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F4] border border-[#E9DED0] text-[10px] font-bold uppercase tracking-wider text-[#C89B5C]">
              {faq.category}
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#3C2B20]">{faq.question}</h2>
            <p className="text-xs sm:text-sm text-[#827466] leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
