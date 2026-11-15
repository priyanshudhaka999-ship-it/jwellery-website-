import React, { useState, useEffect } from 'react';
import { getCookieConsent, saveCookieConsent } from '../utils/analytics';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    saveCookieConsent({ analytics: true });
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    saveCookieConsent({ analytics: false });
    setVisible(false);
  };

  const handleSavePreferences = () => {
    saveCookieConsent({ analytics: analyticsEnabled });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie Consent Preferences"
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:left-6 max-w-4xl mx-auto z-50 bg-[#FAF8F4] border border-[#E9DED0] shadow-xl rounded-2xl p-5 md:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C89B5C] font-semibold">
            Privacy & Cookie Transparency
          </p>
          <h3 className="font-serif text-xl text-[#3C2B20]">
            Your Privacy at AARANYA
          </h3>
          <p className="text-xs text-[#827466] leading-relaxed max-w-2xl">
            We use essential local storage for your guest wishlist and session security. Non-essential Google Analytics 4 (GA4) cookies are strictly disabled unless you explicitly opt in.
          </p>
          {customising && (
            <div className="pt-3 flex flex-wrap gap-4 text-xs text-[#3C2B20]">
              <label className="flex items-center gap-2 opacity-75">
                <input type="checkbox" checked disabled className="accent-[#C89B5C]" />
                Essential Wishlist & Security (Always Active)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="accent-[#C89B5C]"
                />
                Google Analytics 4 & Anonymous Catalogue Metrics
              </label>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRejectNonEssential}
            className="px-4 py-2.5 rounded-lg border border-[#E9DED0] bg-[#F7F2EA] text-xs font-medium text-[#3C2B20] hover:border-[#C89B5C] transition"
          >
            Reject Non-Essential
          </button>
          {!customising ? (
            <button
              onClick={() => setCustomising(true)}
              className="px-4 py-2.5 rounded-lg border border-[#E9DED0] bg-white text-xs font-medium text-[#3C2B20] hover:border-[#C89B5C] transition"
            >
              Customise
            </button>
          ) : (
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2.5 rounded-lg border border-[#C89B5C] bg-white text-xs font-medium text-[#3C2B20]"
            >
              Save Preferences
            </button>
          )}
          <button
            onClick={handleAcceptAll}
            className="px-5 py-2.5 rounded-lg bg-[#C89B5C] text-white text-xs font-medium hover:bg-[#b5894c] transition"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
