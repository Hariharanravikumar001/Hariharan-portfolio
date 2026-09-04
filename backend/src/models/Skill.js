const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'DevOps & Cloud', 'Other'],
      default: 'Frontend',
    },
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 80,
    },
    icon: {
      type: String,
      default: 'Code',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
