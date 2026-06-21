const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const {
  chatWithAI,
  trainDocument,
  getTrainedDocuments,
  deleteTrainedDocument,
  submitFeedback
} = require('../controllers/aiController');

// Define document storage
const docUploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

const docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, docUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const docFilter = (req, file, cb) => {
  const filetypes = /pdf|docx/;
  const mimetype = file.mimetype === 'application/pdf' || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only document files (.pdf, .docx) are allowed!'));
};

const uploadDoc = multer({
  storage: docStorage,
  fileFilter: docFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Chat route (public)
router.post('/chat', chatWithAI);
router.post('/feedback', submitFeedback);

// Training upload route (protected to Admin)
router.post('/train-upload', protect, uploadDoc.single('document'), trainDocument);

// Retrieve and delete trained docs (protected to Admin)
router.route('/documents')
  .get(protect, getTrainedDocuments);

router.delete('/documents/:id', protect, deleteTrainedDocument);

module.exports = router;
