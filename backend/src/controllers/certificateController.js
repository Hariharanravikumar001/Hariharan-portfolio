const Certificate = require('../models/Certificate');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res, next) => {
  try {
    const { search } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockCertificates } = require('../utils/mockStore');
      let filtered = [...mockCertificates];
      if (search) {
        filtered = filtered.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.issuer.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { issuer: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      };
    }

    const certificates = await Certificate.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    next(error);
  }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    const cert = await Certificate.create(data);
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
const updateCertificate = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    const cert = await Certificate.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
