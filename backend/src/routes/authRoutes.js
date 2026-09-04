const express = require('express');
const router = express.Router();
const {
  login,
  checkMfaStatus,
  getMfaSessionDetails,
  approveMfaSession,
  rejectMfaSession,
  resendPush,
  verifyMfa,
  getMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Authentication & Zoho OneAuth Mobile Push Routes
router.post('/login', authLimiter, login);
router.get('/mfa-status/:sessionId', checkMfaStatus);
router.get('/mfa-session/:sessionId', getMfaSessionDetails);
router.post('/mfa-approve', approveMfaSession);
router.post('/mfa-reject', rejectMfaSession);
router.post('/resend-push', authLimiter, resendPush);
router.post('/verify-mfa', authLimiter, verifyMfa);

// Protected Admin Routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
