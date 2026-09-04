const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_hariharan_portfolio_2026_secure';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper to get user object
const getUserObject = async (id, fallbackEmail) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1 && id !== 'admin-offline-id') {
    const user = await User.findById(id);
    if (user) {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };
    }
  }

  return {
    id: 'admin-offline-id',
    name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
    email: fallbackEmail || process.env.ADMIN_EMAIL || 'admin@hariharan.dev',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  };
};

// @desc    Direct Email and Password Sign In
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const mongoose = require('mongoose');
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@hariharan.dev';
    const defaultPass = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let authenticatedUserId = null;
    let authenticatedEmail = email;

    // Handle offline / development mode without active MongoDB
    if (mongoose.connection.readyState !== 1) {
      if (email.toLowerCase() === defaultEmail.toLowerCase() && password === defaultPass) {
        authenticatedUserId = 'admin-offline-id';
        authenticatedEmail = defaultEmail;
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      authenticatedUserId = user._id;
      authenticatedEmail = user.email;
    }

    // Direct Login Successful - Generate final JWT
    const token = generateToken(authenticatedUserId);
    const userObj = await getUserObject(authenticatedUserId, authenticatedEmail);

    res.json({
      success: true,
      token,
      user: userObj,
      message: 'Signed in successfully with email and password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in admin user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const userObj = await getUserObject(req.user.id);
    res.json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
    }

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const defaultPass = process.env.ADMIN_PASSWORD || 'Admin@12345';
      if (currentPassword !== defaultPass) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      return res.json({ success: true, message: 'Password updated successfully (Dev Mode)' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  updatePassword,
};
