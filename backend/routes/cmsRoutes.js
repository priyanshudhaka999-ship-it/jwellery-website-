const express = require('express');
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getSettings,
  updateSettings,
  getActivityLogs,
} = require('../controllers/cmsController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

// Banners
router.get('/banners', getBanners);
router.post('/banners', protectAdmin, createBanner);
router.put('/banners/:id', protectAdmin, validateObjectId('id'), updateBanner);
router.delete('/banners/:id', protectAdmin, validateObjectId('id'), deleteBanner);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', protectAdmin, createTestimonial);
router.put('/testimonials/:id', protectAdmin, validateObjectId('id'), updateTestimonial);
router.delete('/testimonials/:id', protectAdmin, validateObjectId('id'), deleteTestimonial);

// FAQs
router.get('/faqs', getFAQs);
router.post('/faqs', protectAdmin, createFAQ);
router.put('/faqs/:id', protectAdmin, validateObjectId('id'), updateFAQ);
router.delete('/faqs/:id', protectAdmin, validateObjectId('id'), deleteFAQ);

// Website Settings
router.get('/settings', getSettings);
router.put('/settings', protectAdmin, updateSettings);

// Admin Activity Logs
router.get('/activity-logs', protectAdmin, getActivityLogs);

module.exports = router;
