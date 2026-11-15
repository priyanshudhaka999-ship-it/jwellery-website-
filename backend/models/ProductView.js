const mongoose = require('mongoose');

const productViewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    sourcePage: {
      type: String,
      default: '/collections',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductView', productViewSchema);
