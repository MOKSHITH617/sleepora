const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    trim: true,
    lowercase: true
  },
  productName: {
    type: String,
    required: [true, 'Please add the product name']
  },
  category: {
    type: String,
    required: [true, 'Please add the product category'],
    enum: ['mattress', 'sofa', 'general']
  },
  configuration: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  quotedPrice: {
    type: Number,
    required: [true, 'Please add the quoted price']
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Interested', 'Quotation Sent', 'Purchased', 'Closed'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
