const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Full Stack', 'Frontend', 'Backend', 'MERN Stack', 'Mobile', 'UI/UX'],
      default: 'Full Stack',
    },
    technologies: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    screenshots: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveDemo: {
      type: String,
      default: '',
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
