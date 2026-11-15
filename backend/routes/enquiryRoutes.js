const express = require('express');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/errorMiddleware');

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protectAdmin, getEnquiries);
router.put('/:id', protectAdmin, validateObjectId('id'), updateEnquiry);
router.delete('/:id', protectAdmin, validateObjectId('id'), deleteEnquiry);

module.exports = router;
