const ContactMessage = require('../models/ContactMessage');
const VisitorAnalytics = require('../models/VisitorAnalytics');
const { logAdminActivity } = require('../utils/activityLogger');

// POST /api/contact
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, preferredVisitDate, message } = req.body;
    const fieldErrors = {};
    if (!name || !name.trim()) fieldErrors.name = 'Please enter your full name';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Please enter a valid email address';
    if (!phone || phone.trim().length < 8) fieldErrors.phone = 'Please enter a valid contact phone number';
    if (!subject || !subject.trim()) fieldErrors.subject = 'Please specify a subject';
    if (!message || message.trim().length < 10)
      fieldErrors.message = 'Please enter a message of at least 10 characters';

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the highlighted errors before submitting.',
        fieldErrors,
      });
    }

    const savedMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      preferredVisitDate: preferredVisitDate || '',
      message: message.trim(),
    });

    const todayKey = new Date().toISOString().slice(0, 10);
    await VisitorAnalytics.create({
      dateKey: todayKey,
      pagePath: '/contact',
      eventType: 'contact_submit',
      metadata: subject.trim(),
    });

    res.status(201).json({
      success: true,
      contactId: savedMessage._id,
      submittedAt: savedMessage.createdAt,
      message: 'Thank you. Your enquiry has been recorded by the AARANYA showroom concierge.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact (Admin)
exports.getContactMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }, { subject: regex }];
    }
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

// PUT /api/contact/:id (Admin)
exports.updateContactMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!msg) return res.status(404).json({ success: false, message: 'Contact message not found.' });
    await logAdminActivity(req.admin, 'Contact message updated', msg.email, `Marked ${msg.status}`);
    res.json({ success: true, contactMessage: msg });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contact/:id (Admin)
exports.deleteContactMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Contact message not found.' });
    res.json({ success: true, message: 'Contact message deleted.' });
  } catch (err) {
    next(err);
  }
};
