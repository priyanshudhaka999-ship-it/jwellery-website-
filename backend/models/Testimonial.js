const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerLocation: {
      type: String,
      default: 'New Delhi',
      trim: true,
    },
    occasionPurchased: {
      type: String,
      default: 'Bridal Trousseau',
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Testimonial text is required'],
      maxlength: [600, 'Testimonial cannot exceed 600 characters'],
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
