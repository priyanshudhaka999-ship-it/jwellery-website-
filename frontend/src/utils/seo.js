/**
 * Updates document title, meta description, and Open Graph tags dynamically
 * on every route and product view (Checklist Items #2, #3, #8).
 */
export const updatePageMeta = ({
  title = 'AARANYA | Indian Jewellery',
  description = 'Discover AARANYA — Timeless Indian Gold, Kundan, Polki, Diamond & Bridal Jewellery.',
  image = 'https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_The_Islamic_world_Necklace_Kundan_India_21022019_7703.jpg?width=1200',
  url = window.location.href,
  type = 'website',
}) => {
  document.title = title;

  const setMeta = (selector, attr, value) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (selector.includes('property=')) {
        el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
      } else {
        el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
      }
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:image"]', 'content', image);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:type"]', 'content', type);
};
