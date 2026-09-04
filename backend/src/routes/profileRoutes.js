const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfileImage } = require('../controllers/profileController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProfile);
router.put('/', protect, adminOnly, updateProfile);
router.post('/upload-image', protect, adminOnly, upload.single('image'), uploadProfileImage);

module.exports = router;
