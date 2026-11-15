import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { updatePageMeta } from '../utils/seo';

export default function FAQPage() {
  const { faqs } = useStore();
  const revealRef = useRef(null);

  useEffect(() => {
    updatePageMeta({
      title: 'Frequently Asked Questions — Materials, Care & Visits | AARANYA',
      description: 'Answers about AARANYA BIS 916 hallmarking, Kundan & Polki care, showroom visits, bespoke customisation, and exchange policies.',
    });
  }, []);

  useLayoutEffect(() => {
    const page = revealRef.current;
    if (
      !page ||
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    page.dataset.contentRevealReady = 'true';
    const targets = page.querySelectorAll(
      '[data-content-reveal]:not([data-content-reveal-visible="true"])'
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.contentRevealVisible = 'true';
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [faqs]);

  return (
    <section ref={revealRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C89B5C] font-semibold">
          Client Guidance
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#3C2B20]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq._id || faq.question}
            data-content-reveal={index % 2 === 0 ? 'left' : 'right'}
            style={{
              '--content-reveal-delay': `${(index % 3) * 70}ms`,
              '--content-reveal-delay-mobile': `${(index % 3) * 35}ms`,
            }}
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
