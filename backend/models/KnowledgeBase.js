const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true, // 'faq', 'product', 'website_content', 'uploaded_document'
    enum: ['faq', 'product', 'website_content', 'uploaded_document']
  },
  sourceId: {
    type: String, // ID linking back to the FAQ or Product
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
