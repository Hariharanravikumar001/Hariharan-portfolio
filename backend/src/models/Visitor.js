const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    ipHash: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: String,
    device: {
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
      default: 'Desktop',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    country: {
      type: String,
      default: 'India',
    },
    city: {
      type: String,
      default: 'Chennai',
    },
    pageVisited: {
      type: String,
      default: '/',
    },
    referrer: {
      type: String,
      default: '',
    },
    visitedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);
