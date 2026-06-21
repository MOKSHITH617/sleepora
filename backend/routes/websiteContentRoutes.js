const express = require('express');
const router = express.Router();
const { getContentByKey, getAllContent, updateContentByKey } = require('../controllers/websiteContentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllContent);

router.route('/:key')
  .get(getContentByKey)
  .put(protect, updateContentByKey);

module.exports = router;
