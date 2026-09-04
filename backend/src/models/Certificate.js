const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide certificate title'],
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      required: true,
    },
    credentialId: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    imagePreview: {
      type: String,
      default: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
