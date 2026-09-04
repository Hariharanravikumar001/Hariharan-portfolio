const Project = require('../models/Project');

// @desc    Get all projects with search & category filter
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockProjects } = require('../utils/mockStore');
      let filtered = [...mockProjects];
      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (featured === 'true') {
        filtered = filtered.filter((p) => p.featured);
      }
      if (search) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const projects = await Project.find(query).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID or slug
// @route   GET /api/projects/:idOrSlug
// @access  Public
const getProject = async (req, res, next) => {
  try {
    const param = req.params.idOrSlug;
    const project = param.match(/^[0-9a-fA-F]{24}$/)
      ? await Project.findById(param)
      : await Project.findOne({ slug: param });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map((t) => t.trim());
    }
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const project = await Project.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map((t) => t.trim());
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
