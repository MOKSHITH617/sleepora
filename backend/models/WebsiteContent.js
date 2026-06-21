const mongoose = require('mongoose');

const WebsiteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add page content']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteContent', WebsiteContentSchema);
