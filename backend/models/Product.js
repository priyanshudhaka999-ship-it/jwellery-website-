const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, required: [true, 'Descriptive image alt text is required for accessibility & SEO'] },
    isMain: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 1000 },
    isDemo: { type: Boolean, default: false },
    licenseSource: { type: String, default: 'Actual Store Photography' },
    licenseUrl: { type: String, default: '' },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [140, 'Product name cannot exceed 140 characters'],
    },
    sku: {
      type: String,
      required: [true, 'Unique SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [320, 'Short description cannot exceed 320 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Product price in INR is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    originalPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val === undefined || val >= this.price;
        },
        message: 'Original price must be greater than or equal to current selling price for a genuine discount',
      },
    },
    metalType: {
      type: String,
      required: [true, 'Metal type is required'],
      enum: ['Gold', 'Silver', 'Diamond & Gold', 'Kundan & Gold', 'Polki & Gold', 'Platinum', 'Temple Gold'],
      index: true,
    },
    purity: {
      type: String,
      default: '22K (916 BIS Hallmarked)',
      trim: true,
    },
    purityVerified: {
      type: Boolean,
      default: true,
    },
    weightGrams: {
      type: Number,
      default: null,
      min: [0, 'Weight cannot be negative'],
    },
    weightVerified: {
      type: Boolean,
      default: true,
    },
    stoneDetails: {
      type: String,
      default: 'None',
      trim: true,
    },
    occasion: {
      type: String,
      enum: ['Bridal', 'Festive', 'Everyday Luxury', 'Temple & Ceremonial', 'Cocktail & Evening'],
      default: 'Festive',
      index: true,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: [
      {
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    availability: {
      type: String,
      enum: ['In Store & Ready', 'Made to Order (14-21 Days)', 'Reserved / Out of Stock'],
      default: 'In Store & Ready',
      index: true,
    },
    stockCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDemoProduct: {
      type: Boolean,
      default: false,
      index: true,
    },
    images: {
      type: [productImageSchema],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'At least one product image is required',
      },
    },
    viewsCount: {
      type: Number,
      default: 0,
      index: true,
    },
    enquiriesCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound text index for fast search across name, SKU, description, and stoneDetails
productSchema.index({
  name: 'text',
  sku: 'text',
  shortDescription: 'text',
  stoneDetails: 'text',
  metalType: 'text',
});

module.exports = mongoose.model('Product', productSchema);
