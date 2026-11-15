const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/login
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const fieldErrors = {};
    if (!email) fieldErrors.email = 'Admin email is required';
    if (!password) fieldErrors.password = 'Password is required';
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        fieldErrors,
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin email or password.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This administrator account has been disabled.',
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('aaranya_admin_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
exports.logoutAdmin = (req, res) => {
  res.cookie('aaranya_admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out securely.' });
};

// GET /api/auth/me
exports.getCurrentAdmin = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
};
