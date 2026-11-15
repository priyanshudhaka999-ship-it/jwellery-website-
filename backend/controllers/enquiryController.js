const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const VisitorAnalytics = require('../models/VisitorAnalytics');
const { logAdminActivity } = require('../utils/activityLogger');

// POST /api/enquiries — Logs a WhatsApp enquiry click in MongoDB
exports.createEnquiry = async (req, res, next) => {
  try {
    const {
      productId,
      productName,
      sku,
      priceAtEnquiry,
      productUrl,
      source = 'product_page',
      customerName = '',
      customerPhone = '',
      customerNote = '',
    } = req.body;

    if (!productId || !productName || !sku || priceAtEnquiry === undefined || !productUrl) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, name, SKU, price, and URL are required to log an enquiry.',
      });
    }

    const enquiry = await Enquiry.create({
      product: productId,
      productName,
      sku,
      priceAtEnquiry: Number(priceAtEnquiry),
      productUrl,
      source,
      customerName,
      customerPhone,
      customerNote,
      status: 'New',
      whatsappRedirectTriggered: true,
    });

    await Product.findByIdAndUpdate(productId, { $inc: { enquiriesCount: 1 } });

    const todayKey = new Date().toISOString().slice(0, 10);
    await VisitorAnalytics.create({
      dateKey: todayKey,
      pagePath: productUrl,
      eventType: 'whatsapp_click',
      metadata: `${sku} - ${productName}`,
    });

    res.status(201).json({
      success: true,
      enquiry,
      disclaimer:
        'Enquiry click logged. Opening WhatsApp with your prefilled message—please press Send in WhatsApp to complete delivery.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries (Admin)
exports.getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ productName: regex }, { sku: regex }, { customerName: regex }, { customerPhone: regex }];
    }
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch (err) {
    next(err);
  }
};

// PUT /api/enquiries/:id (Admin)
exports.updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    await logAdminActivity(
      req.admin,
      'Enquiry status updated',
      `${enquiry.sku} (${enquiry.productName})`,
      `Status set to ${enquiry.status}`
    );
    res.json({ success: true, enquiry });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/enquiries/:id (Admin)
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) {
    next(err);
  }
};
