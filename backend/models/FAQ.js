const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer']
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FAQ', FAQSchema);
