const express = require('express');
const router = express.Router();
const {
  getAllResumes,
  getActiveResumes,
  trackDownload,
  createResume,
  updateResume,
  deleteResume,
  toggleResume,
} = require('../controllers/resumeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getActiveResumes);
router.post('/:id/download', trackDownload);

// Admin endpoints
router.get('/admin/all', protect, adminOnly, getAllResumes);
router.post('/', protect, adminOnly, createResume);
router.put('/:id', protect, adminOnly, updateResume);
router.delete('/:id', protect, adminOnly, deleteResume);
router.patch('/:id/toggle', protect, adminOnly, toggleResume);

module.exports = router;
