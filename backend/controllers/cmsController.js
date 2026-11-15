const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const WebsiteSettings = require('../models/WebsiteSettings');
const AdminActivityLog = require('../models/AdminActivityLog');
const { logAdminActivity } = require('../utils/activityLogger');

// BANNERS
exports.getBanners = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ displayOrder: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    next(err);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    await logAdminActivity(req.admin, 'Banner updated', banner.title, 'Created hero banner');
    res.status(201).json({ success: true, banner });
  } catch (err) {
    next(err);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
    await logAdminActivity(req.admin, 'Banner updated', banner.title, 'Updated hero banner');
    res.json({ success: true, banner });
  } catch (err) {
    next(err);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    await logAdminActivity(req.admin, 'Banner updated', req.params.id, 'Deleted hero banner');
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (err) {
    next(err);
  }
};

// TESTIMONIALS
exports.getTestimonials = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isApproved: true };
    const testimonials = await Testimonial.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err) {
    next(err);
  }
};

// FAQS
exports.getFAQs = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const faqs = await FAQ.find(filter).sort({ displayOrder: 1 });
    res.json({ success: true, faqs });
  } catch (err) {
    next(err);
  }
};

exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    await logAdminActivity(req.admin, 'FAQ updated', faq.question, 'Created FAQ');
    res.status(201).json({ success: true, faq });
  } catch (err) {
    next(err);
  }
};

exports.updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await logAdminActivity(req.admin, 'FAQ updated', faq?.question || req.params.id, 'Updated FAQ');
    res.json({ success: true, faq });
  } catch (err) {
    next(err);
  }
};

exports.deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (err) {
    next(err);
  }
};

// WEBSITE SETTINGS
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    await logAdminActivity(req.admin, 'Settings updated', 'WebsiteSettings', 'Updated global store configuration');
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

// ADMIN ACTIVITY LOGS
exports.getActivityLogs = async (req, res, next) => {
  try {
    const logs = await AdminActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};
