const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide resume title'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Frontend Developer Resume',
        'MERN Stack Developer Resume',
        'Full Stack Developer Resume',
        'Technical Support Engineer Resume',
        'Software Engineer Resume',
        'General Resume',
      ],
      default: 'Full Stack Developer Resume',
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide resume file URL'],
    },
    fileName: {
      type: String,
      default: 'Hariharan_Ravikumar_Resume.pdf',
    },
    fileSize: {
      type: String,
      default: '180 KB',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    version: {
      type: String,
      default: 'v2.4',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
