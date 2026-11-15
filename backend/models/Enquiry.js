const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    priceAtEnquiry: {
      type: Number,
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['product_page', 'wishlist_page', 'quick_card', 'sticky_mobile_cta'],
      default: 'product_page',
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    customerNote: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Converted', 'Not Interested'],
      default: 'New',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    whatsappRedirectTriggered: {
      type: Boolean,
      default: true,
      // Explicitly logs that the click-to-chat redirect was initiated; does NOT claim WhatsApp message delivery
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
