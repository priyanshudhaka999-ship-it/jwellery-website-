const express = require('express');
const rateLimit = require('express-rate-limit');
const { loginAdmin, logoutAdmin, getCurrentAdmin } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
  },
});

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protectAdmin, getCurrentAdmin);

module.exports = router;
