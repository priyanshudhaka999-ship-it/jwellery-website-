const express = require('express');
const {
  recordVisit,
  recordProductView,
  getDashboardAnalytics,
} = require('../controllers/analyticsController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/visit', recordVisit);
router.post('/product-view', recordProductView);
router.get('/dashboard', protectAdmin, getDashboardAnalytics);

module.exports = router;
