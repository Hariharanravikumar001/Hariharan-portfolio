const jwt = require('jsonwebtoken');
const User = require('../models/User');
const totp = require('../utils/totp');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_hariharan_portfolio_2026_secure';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const generateTempToken = (id, email) => {
  return jwt.sign({ id, email, role: 'admin', step: 'mfa_pending' }, JWT_SECRET, {
    expiresIn: '10m',
  });
};

// @desc    Auth admin & initiate Zoho OneAuth MFA
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
    const defaultSecret = process.env.ADMIN_MFA_SECRET || 'JBSWY3DPEHPK3PXP';

    // Handle offline / development mode without active MongoDB
    if (mongoose.connection.readyState !== 1) {
      if (email.toLowerCase() === defaultEmail.toLowerCase() && password === defaultPass) {
        const tempToken = generateTempToken('admin-offline-id', defaultEmail);
        const otpauthUri = totp.getOtpAuthUri({
          secret: defaultSecret,
          email: defaultEmail,
          issuer: 'Hariharan Portfolio',
        });

        return res.json({
          success: true,
          mfaRequired: true,
          tempToken,
          mfaMethod: 'Zoho OneAuth',
          secret: defaultSecret,
          otpauthUri,
          user: {
            id: 'admin-offline-id',
            name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
            email: defaultEmail,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          },
          message: 'Step 1 complete: Zoho OneAuth MFA verification required',
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = await User.findOne({ email }).select('+password +mfaSecret');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Ensure user has an MFA secret initialized
    let mfaSecret = user.mfaSecret;
    if (!mfaSecret) {
      mfaSecret = defaultSecret;
      user.mfaSecret = mfaSecret;
      user.mfaEnabled = true;
      await user.save();
    }

    const tempToken = generateTempToken(user._id, user.email);
    const otpauthUri = totp.getOtpAuthUri({
      secret: mfaSecret,
      email: user.email,
      issuer: 'Hariharan Portfolio',
    });

    res.json({
      success: true,
      mfaRequired: true,
      tempToken,
      mfaMethod: 'Zoho OneAuth',
      secret: mfaSecret,
      otpauthUri,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: 'Step 1 complete: Zoho OneAuth MFA verification required',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Zoho OneAuth TOTP & return final JWT token
// @route   POST /api/auth/verify-mfa
// @access  Public (requires valid tempToken)
const verifyMfa = async (req, res, next) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        message: 'MFA session token and 6-digit code are required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'MFA session has expired or is invalid. Please sign in again.',
      });
    }

    if (decoded.step !== 'mfa_pending') {
      return res.status(401).json({
        success: false,
        message: 'Invalid MFA state',
      });
    }

    const defaultSecret = process.env.ADMIN_MFA_SECRET || 'JBSWY3DPEHPK3PXP';
    let userObj;
    let secret = defaultSecret;

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1 && decoded.id !== 'admin-offline-id') {
      const user = await User.findById(decoded.id).select('+mfaSecret');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      secret = user.mfaSecret || defaultSecret;
      userObj = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };
    } else {
      userObj = {
        id: 'admin-offline-id',
        name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
        email: decoded.email || process.env.ADMIN_EMAIL || 'admin@hariharan.dev',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      };
    }

    // Verify TOTP code against secret key (RFC 6238) or allow dev test code 123456
    const cleanCode = String(code).trim().replace(/\s+/g, '');
    const isTotpValid = totp.verifyTotp(cleanCode, secret);
    const isDevPass = cleanCode === '123456';

    if (!isTotpValid && !isDevPass) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Zoho OneAuth verification code. Please check your authenticator app and try again.',
      });
    }

    // Generate final JWT token
    const token = generateToken(decoded.id);

    res.json({
      success: true,
      token,
      user: userObj,
      message: 'Zoho OneAuth verification successful. Welcome to Admin Portal.',
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
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1 || req.user.id === 'admin-offline-id') {
      return res.json({
        success: true,
        user: {
          id: 'admin-offline-id',
          name: process.env.ADMIN_NAME || 'Hariharan Ravikumar',
          email: process.env.ADMIN_EMAIL || 'admin@hariharan.dev',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
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

module.exports = { login, verifyMfa, getMe, updatePassword };
