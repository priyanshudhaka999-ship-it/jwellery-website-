const express = require('express');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Category = require('../models/Category');

const router = express.Router();

// GET /sitemap.xml — Dynamic XML Sitemap containing public indexable pages only
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const baseUrl = (process.env.CLIENT_URL || 'https://aaranyajewels.com').replace(/\/$/, '');
    const [products, collections, categories] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt'),
      Collection.find({ isVisible: true }).select('slug updatedAt'),
      Category.find({ isActive: true }).select('slug updatedAt'),
    ]);

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/collections', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
      { url: '/terms-and-conditions', priority: '0.4', changefreq: 'yearly' },
      { url: '/return-and-exchange-policy', priority: '0.4', changefreq: 'yearly' },
      { url: '/pricing-disclaimer', priority: '0.4', changefreq: 'yearly' },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach((p) => {
      xml += `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    });

    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${baseUrl}/collections?category=${cat.slug}</loc>\n    <lastmod>${new Date(cat.updatedAt).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    collections.forEach((col) => {
      xml += `  <url>\n    <loc>${baseUrl}/collections?collection=${col.slug}</loc>\n    <lastmod>${new Date(col.updatedAt).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    products.forEach((prod) => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${prod.slug}</loc>\n    <lastmod>${new Date(prod.updatedAt).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
