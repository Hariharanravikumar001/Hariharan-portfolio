const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide role/title'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Contract', 'Freelance'],
      default: 'Internship',
    },
    location: {
      type: String,
      default: 'Remote / Hybrid',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: 'Present',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
