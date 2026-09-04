const Profile = require('../models/Profile');

// @desc    Get portfolio owner profile
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockProfile } = require('../utils/mockStore');
      return res.json({ success: true, data: mockProfile });
    }

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio profile
// @route   PUT /api/profile
// @access  Private/Admin
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile avatar
// @route   POST /api/profile/upload-image
// @access  Private/Admin
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const imageUrl = req.file.path.startsWith('http')
      ? req.file.path
      : `/uploads/${req.file.filename}`;

    let profile = await Profile.findOne();
    if (profile) {
      profile.profileImage = imageUrl;
      await profile.save();
    }

    res.json({ success: true, imageUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadProfileImage };
