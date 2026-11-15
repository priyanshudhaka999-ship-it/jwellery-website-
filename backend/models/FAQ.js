const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'FAQ question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'FAQ answer is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Jewellery Materials',
        'Product Availability',
        'Store Visits',
        'Jewellery Care',
        'Customisation',
        'Returns and Exchanges',
      ],
      index: true,
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

module.exports = mongoose.model('FAQ', faqSchema);
