import api from '../services/api';

const CONSENT_STORAGE_KEY = 'aaranya_cookie_consent';

export const getCookieConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveCookieConsent = (preferences) => {
  try {
    const payload = {
      essential: true,
      analytics: Boolean(preferences.analytics),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    if (payload.analytics) {
      initGA4();
    }
    return payload;
  } catch {
    return null;
  }
};

export const initGA4 = () => {
  const consent = getCookieConsent();
  if (!consent?.analytics) return;
  const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!gaId || window.gtagLoaded) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId, { anonymize_ip: true });
  window.gtagLoaded = true;
};

export const trackEvent = async (eventType, pagePath, metadata = '') => {
  try {
    const consent = getCookieConsent();
    if (consent?.analytics && typeof window.gtag === 'function') {
      window.gtag('event', eventType, { page_path: pagePath, event_label: metadata });
    }
    await api.post('/analytics/visit', { eventType, pagePath, metadata });
  } catch {
    // Non-blocking analytics
  }
};
