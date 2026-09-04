const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  exportMessagesCSV,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public contact submission with anti-spam limiter
router.post('/', contactLimiter, submitContactMessage);

// Admin contact inbox management
router.get('/messages', protect, adminOnly, getMessages);
router.get('/export-csv', protect, adminOnly, exportMessagesCSV);
router.patch('/messages/:id', protect, adminOnly, updateMessageStatus);
router.delete('/messages/:id', protect, adminOnly, deleteMessage);

module.exports = router;
