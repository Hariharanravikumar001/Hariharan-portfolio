const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getVisitorAnalytics,
  getPublicCounter,
} = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public counter for portfolio home page
router.get('/public-counter', getPublicCounter);

// Admin analytics
router.get('/overview', protect, adminOnly, getDashboardOverview);
router.get('/visitors', protect, adminOnly, getVisitorAnalytics);

module.exports = router;
