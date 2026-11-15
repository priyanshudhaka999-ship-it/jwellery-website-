const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'AARANYA',
    },
    tagline: {
      type: String,
      default: 'Timeless Indian Jewellery',
    },
    logoUrl: {
      type: String,
      default: '/favicon.svg',
    },
    isPlaceholderContact: {
      type: Boolean,
      default: true,
      // Explicitly flags that contact coordinates are development placeholders until updated by Admin before launch
    },
    whatsappNumber: {
      type: String,
      default: '919876543210',
    },
    phoneNumber: {
      type: String,
      default: '+91 11 2345 6789 [DEMO PLACEHOLDER]',
    },
    email: {
      type: String,
      default: 'concierge@aaranyajewels.example.com',
    },
    storeAddress: {
      type: String,
      default: '[DEMO PLACEHOLDER — Update in Admin Settings] Heritage Emporium Suite 14, Dariba Kalan / Mehrauli Design Quarter, New Delhi 110006, India',
    },
    businessHours: {
      type: String,
      default: 'Tuesday – Sunday: 11:00 AM – 8:00 PM IST (Closed Mondays)',
    },
    googleMapsLink: {
      type: String,
      default: 'https://maps.google.com/?q=28.6506,77.2303',
    },
    mapCoordinates: {
      lat: { type: Number, default: 28.6506 },
      lng: { type: Number, default: 77.2303 },
    },
    announcementText: {
      type: String,
      default: 'BIS 916 Hallmarked Gold & Certified Polki • Private Bridal Consultations Available at Our Flagship Showroom',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      pinterest: { type: String, default: 'https://pinterest.com' },
      youtube: { type: String, default: 'https://youtube.com' },
    },
    aboutUsContent: {
      storyHeading: {
        type: String,
        default: 'Rooted in Royal Karigari, Crafted for Modern Heirloom Keepers',
      },
      storyBody: {
        type: String,
        default: 'AARANYA was conceived as an ode to India’s classical goldsmithing lineages—from the Jadau workshops of Bikaner and Jaipur to the temple Nakshi ateliers of South India. Every creation is hand-forged with generous proportions, unhurried precision, and transparent hallmark verification.',
      },
      heritageText: {
        type: String,
        default: 'Our master karigars preserve century-old techniques including 24K foil Kundan setting, Meenakari enamel detailing, and hand-strung Basra-style pearl weaving.',
      },
      craftsmanshipText: {
        type: String,
        default: 'Every piece undergoes multi-point inspection for clasp integrity, stone security, and skin-friendly back finishing.',
      },
      qualityPhilosophy: {
        type: String,
        default: 'We publish verified metal purity (BIS 916 for 22K gold, 750 for 18K gold, and 92.5 for sterling silver) and exact net/gross weights on every catalogue piece.',
      },
    },
    footerContent: {
      copyrightText: {
        type: String,
        default: '© 2026 AARANYA Fine Indian Jewellery. All Rights Reserved.',
      },
      disclaimerNote: {
        type: String,
        default: 'Catalogue prices are indicative in INR and subject to daily bullion rate adjustments and verified physical piece weight at our showroom.',
      },
    },
    ga4MeasurementId: {
      type: String,
      default: 'G-AARANYA2026',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
