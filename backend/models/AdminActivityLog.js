const mongoose = require('mongoose');

const adminActivityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        'Product created',
        'Product updated',
        'Product deleted',
        'Price changed',
        'Image replaced',
        'Category changed',
        'Collection updated',
        'Enquiry status updated',
        'Contact message updated',
        'Banner updated',
        'Settings updated',
        'FAQ updated',
      ],
      index: true,
    },
    targetEntity: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminActivityLog', adminActivityLogSchema);
