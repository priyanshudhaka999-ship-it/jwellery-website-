const VisitorAnalytics = require('../models/VisitorAnalytics');
const ProductView = require('../models/ProductView');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');
const ContactMessage = require('../models/ContactMessage');
const AdminActivityLog = require('../models/AdminActivityLog');

// POST /api/analytics/visit
exports.recordVisit = async (req, res, next) => {
  try {
    const { pagePath = '/', eventType = 'page_view', metadata = '' } = req.body;
    const dateKey = new Date().toISOString().slice(0, 10);
    await VisitorAnalytics.create({ dateKey, pagePath, eventType, metadata });
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// POST /api/analytics/product-view
exports.recordProductView = async (req, res, next) => {
  try {
    const { productId, sku, sourcePage = '/collections' } = req.body;
    if (!productId || !sku) {
      return res.status(400).json({ success: false, message: 'productId and sku are required.' });
    }
    const dateKey = new Date().toISOString().slice(0, 10);
    await Promise.all([
      ProductView.create({ product: productId, sku, dateKey, sourcePage }),
      Product.findByIdAndUpdate(productId, { $inc: { viewsCount: 1 } }),
    ]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/dashboard (Protected Admin)
// Strictly returns real database-driven counts — ZERO fake sales, orders, or fabricated revenue.
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      totalProducts,
      activeProducts,
      demoProductsCount,
      totalCategories,
      totalVisitors,
      whatsappEnquiries,
      contactEnquiries,
      mostViewedProducts,
      mostEnquiredProducts,
      recentActivities,
      categoryBreakdown,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isDemoProduct: true }),
      Category.countDocuments({ isActive: true }),
      VisitorAnalytics.countDocuments({ eventType: 'page_view' }),
      Enquiry.countDocuments(),
      ContactMessage.countDocuments(),
      Product.find()
        .sort({ viewsCount: -1 })
        .limit(5)
        .select('name sku viewsCount enquiriesCount price metalType isDemoProduct'),
      Product.find()
        .sort({ enquiriesCount: -1 })
        .limit(5)
        .select('name sku enquiriesCount viewsCount price metalType isDemoProduct'),
      AdminActivityLog.find().sort({ createdAt: -1 }).limit(12),
      Product.aggregate([
        { $group: { _id: '$category', productCount: { $sum: 1 }, totalViews: { $sum: '$viewsCount' } } },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            categoryName: { $ifNull: ['$categoryInfo.name', 'Uncategorised'] },
            productCount: 1,
            totalViews: 1,
          },
        },
        { $sort: { totalViews: -1, productCount: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      metrics: {
        totalProducts,
        activeProducts,
        demoProductsCount,
        totalCategories,
        totalVisitors,
        whatsappEnquiries,
        contactEnquiries,
      },
      mostViewedProducts,
      mostEnquiredProducts,
      popularCategories: categoryBreakdown,
      recentActivities,
    });
  } catch (err) {
    next(err);
  }
};
