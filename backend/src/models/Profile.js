const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Hariharan Ravikumar',
      trim: true,
    },
    titles: {
      type: [String],
      default: [
        'Full Stack Software Engineer',
        'MERN Stack Developer',
        'React & Node.js Specialist',
        'Technical Support Engineer',
      ],
    },
    shortIntro: {
      type: String,
      default:
        'Passionate Full Stack Developer specializing in building high-performance web applications, scalable architectures, and delightful digital experiences.',
    },
    about: {
      type: String,
      default:
        'I am Hariharan Ravikumar, a dedicated and solution-oriented Full Stack Developer with expertise in React, Node.js, Express, and MongoDB. I thrive on architecting clean, maintainable code, building responsive interfaces, and solving real-world technical problems.',
    },
    careerObjective: {
      type: String,
      default:
        'To secure a challenging role as a Full Stack / Software Engineer where I can leverage my expertise in modern web technologies, contribute to impactful products, and grow alongside industry leaders.',
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/hariharan-ravikumar' },
      linkedin: { type: String, default: 'https://linkedin.com/in/hariharan-ravikumar' },
      twitter: { type: String, default: 'https://twitter.com/hariharan' },
      portfolio: { type: String, default: 'https://hariharan.dev' },
      email: { type: String, default: 'hariharan@example.com' },
      phone: { type: String, default: '+91 98765 43210' },
      whatsapp: { type: String, default: '+91 98765 43210' },
    },
    stats: {
      yearsExperience: { type: Number, default: 1 },
      completedProjects: { type: Number, default: 3 },
      happyClients: { type: Number, default: 0 },
      codeCommits: { type: Number, default: 0 },
    },
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startYear: String,
        endYear: String,
        grade: String,
        description: String,
      },
    ],
    achievements: [
      {
        title: String,
        organization: String,
        year: String,
        description: String,
      },
    ],
    strengths: [String],
    languages: [
      {
        language: String,
        proficiency: String, // Native, Fluent, Intermediate, Basic
        level: Number, // percentage e.g. 100
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
