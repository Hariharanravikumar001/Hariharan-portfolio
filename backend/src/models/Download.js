const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    resumeTitle: {
      type: String,
      required: true,
    },
    resumeCategory: {
      type: String,
      default: '',
    },
    ipHash: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Download', downloadSchema);
