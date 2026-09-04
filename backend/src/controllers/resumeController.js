const Resume = require('../models/Resume');
const Download = require('../models/Download');
const crypto = require('crypto');

// @desc    Get all resumes (Admin)
// @route   GET /api/resumes/admin/all
// @access  Private/Admin
const getAllResumes = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockResumes } = require('../utils/mockStore');
      return res.json({ success: true, count: mockResumes.length, data: mockResumes });
    }

    const resumes = await Resume.find().sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active resumes (Public)
// @route   GET /api/resumes
// @access  Public
const getActiveResumes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockResumes } = require('../utils/mockStore');
      const filtered = category && category !== 'All'
        ? mockResumes.filter((r) => r.category.toLowerCase() === category.toLowerCase())
        : mockResumes.filter((r) => r.isActive !== false);
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = { isActive: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const resumes = await Resume.find(query).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Track download and get file URL
// @route   POST /api/resumes/:id/download
// @access  Public
const trackDownload = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockResumes } = require('../utils/mockStore');
      const resume = mockResumes.find((r) => r._id === req.params.id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }
      resume.downloadCount = (resume.downloadCount || 0) + 1;
      return res.json({
        success: true,
        downloadUrl: resume.fileUrl,
        fileName: resume.fileName || `${resume.title.replace(/\s+/g, '_')}.pdf`,
        downloadCount: resume.downloadCount,
      });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Increment download counter
    resume.downloadCount = (resume.downloadCount || 0) + 1;
    await resume.save();

    // Asynchronously record download analytics
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').substring(0, 16);
    const userAgent = req.headers['user-agent'] || '';

    setImmediate(async () => {
      try {
        await Download.create({
          resumeId: resume._id,
          resumeTitle: resume.title,
          resumeCategory: resume.category,
          ipHash,
          userAgent,
        });
      } catch (err) {
        // Ignore analytics background error
      }
    });

    res.json({
      success: true,
      downloadUrl: resume.fileUrl,
      fileName: resume.fileName || `${resume.title.replace(/\s+/g, '_')}.pdf`,
      downloadCount: resume.downloadCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private/Admin
const createResume = async (req, res, next) => {
  try {
    const resume = await Resume.create(req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private/Admin
const updateResume = async (req, res, next) => {
  try {
    const data = { ...req.body, lastUpdated: new Date() };
    const resume = await Resume.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private/Admin
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active status
// @route   PATCH /api/resumes/:id/toggle
// @access  Private/Admin
const toggleResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    resume.isActive = !resume.isActive;
    await resume.save();
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllResumes,
  getActiveResumes,
  trackDownload,
  createResume,
  updateResume,
  deleteResume,
  toggleResume,
};
