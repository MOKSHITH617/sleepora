const express = require('express');
const router = express.Router();
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFAQs)
  .post(protect, createFAQ);

router.route('/:id')
  .put(protect, updateFAQ)
  .delete(protect, deleteFAQ);

module.exports = router;
