const Experience = require('../models/Experience');

// @desc    Get all experiences (internships, jobs)
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockExperiences } = require('../utils/mockStore');
      return res.json({ success: true, count: mockExperiences.length, data: mockExperiences });
    }

    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private/Admin
const createExperience = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.responsibilities === 'string') {
      data.responsibilities = data.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
    }
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const exp = await Experience.create(data);
    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    next(error);
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private/Admin
const updateExperience = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.responsibilities === 'string') {
      data.responsibilities = data.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
    }
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const exp = await Experience.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!exp) {
      return res.status(404).json({ success: false, message: 'Experience entry not found' });
    }
    res.json({ success: true, data: exp });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      return res.status(404).json({ success: false, message: 'Experience entry not found' });
    }
    res.json({ success: true, message: 'Experience entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
