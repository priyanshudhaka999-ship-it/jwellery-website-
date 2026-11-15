const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  submitContactForm,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many contact submissions. Please try again shortly.' },
});

router.post('/', contactLimiter, submitContactForm);
router.get('/', protectAdmin, getContactMessages);
router.put('/:id', protectAdmin, validateObjectId('id'), updateContactMessage);
router.delete('/:id', protectAdmin, validateObjectId('id'), deleteContactMessage);

module.exports = router;
