const mongoose = require('mongoose');

const ConversationLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userQuery: {
    type: String,
    default: ''
  },
  aiResponse: {
    type: String,
    default: ''
  },
  detectedLanguage: {
    type: String,
    default: 'English'
  },
  navigatedTo: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    enum: ['helpful', 'unhelpful', 'none'],
    default: 'none'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ConversationLog', ConversationLogSchema);
