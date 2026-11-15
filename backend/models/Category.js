const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [60, 'Category name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
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
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
