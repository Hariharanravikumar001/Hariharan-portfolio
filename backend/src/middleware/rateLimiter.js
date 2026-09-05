const rateLimit = require('express-rate-limit');

// General API rate limiter: 200 requests per 15 mins
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form limiter to prevent spam: 5 submissions per 10 minutes
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many contact messages sent from this IP. Please wait 10 minutes before submitting again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints limiter (login brute force protection): 30 requests per 15 mins
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, contactLimiter, authLimiter };
