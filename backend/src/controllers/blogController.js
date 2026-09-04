const Blog = require('../models/Blog');

// @desc    Get all blogs with category & search
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const { category, search, all } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockBlogs } = require('../utils/mockStore');
      let filtered = [...mockBlogs];
      if (category && category !== 'All') {
        filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        filtered = filtered.filter((b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.summary.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = all === 'true' ? {} : { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    const blog = await Blog.create(data);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Public
const addComment = async (req, res, next) => {
  try {
    const { name, email, comment } = req.body;
    if (!name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'Name, email, and comment are required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.comments.push({ name, email, comment });
    await blog.save();

    res.status(201).json({ success: true, data: blog.comments, message: 'Comment submitted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
};
