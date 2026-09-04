const express = require('express');
const router = express.Router();
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getCertificates);
router.post('/', protect, adminOnly, createCertificate);
router.put('/:id', protect, adminOnly, updateCertificate);
router.delete('/:id', protect, adminOnly, deleteCertificate);

module.exports = router;
