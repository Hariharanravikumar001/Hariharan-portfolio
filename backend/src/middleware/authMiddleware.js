const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_hariharan_portfolio_2026_secure');
      
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        req.user = {
          _id: decoded.id,
          name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
          email: process.env.ADMIN_EMAIL || 'admin@hariharan.dev',
          role: 'admin',
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found for this token' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
};

module.exports = { protect, adminOnly };
