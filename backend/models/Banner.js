const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner heading is required'],
      trim: true,
      default: 'Timeless Indian Jewellery',
    },
    subtitle: {
      type: String,
      required: [true, 'Banner subtitle is required'],
      trim: true,
    },
    badgeText: {
      type: String,
      default: 'BIS 916 Hallmarked • Heritage Craftsmanship',
    },
    ctaPrimaryText: {
      type: String,
      default: 'Explore Collections',
    },
    ctaPrimaryLink: {
      type: String,
      default: '/collections',
    },
    ctaSecondaryText: {
      type: String,
      default: 'Visit Our Store',
    },
    ctaSecondaryLink: {
      type: String,
      default: '/contact',
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
      alt: { type: String, required: true },
      isDemo: { type: Boolean, default: true },
      licenseInfo: { type: String, default: '' },
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
