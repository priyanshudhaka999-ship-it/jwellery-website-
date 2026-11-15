const mongoose = require('mongoose');

const visitorAnalyticsSchema = new mongoose.Schema(
  {
    dateKey: {
      type: String,
      required: true,
      index: true, // Format: YYYY-MM-DD
    },
    pagePath: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['page_view', 'collection_view', 'search_query', 'whatsapp_click', 'contact_submit'],
      default: 'page_view',
    },
    metadata: {
      type: String,
      default: '',
    },
    sessionHash: {
      type: String,
      default: 'anonymous',
      // Privacy-preserving ephemeral hash; no PII collected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorAnalytics', visitorAnalyticsSchema);
