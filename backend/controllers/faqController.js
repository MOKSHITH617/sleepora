const FAQ = require('../models/FAQ');
const { indexDocument } = require('../utils/vectorStore');
const KnowledgeBase = require('../models/KnowledgeBase');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({}).sort({ category: 1, createdAt: -1 });
    return res.json({ success: true, faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private (Admin)
const createFAQ = async (req, res) => {
  const { question, answer, category } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Please provide both question and answer' });
  }

  try {
    const faq = await FAQ.create({ question, answer, category });

    // Sync to RAG knowledge base
    const contentToIndex = `FAQ Category: ${faq.category}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`;
    await indexDocument(faq.question, contentToIndex, 'faq', faq._id.toString());

    return res.status(201).json({ success: true, faq });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
const updateFAQ = async (req, res) => {
  const { question, answer, category } = req.body;

  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;

    const updatedFaq = await faq.save();

    // Update in RAG knowledge base
    const contentToIndex = `FAQ Category: ${updatedFaq.category}\nQuestion: ${updatedFaq.question}\nAnswer: ${updatedFaq.answer}`;
    await indexDocument(updatedFaq.question, contentToIndex, 'faq', updatedFaq._id.toString());

    return res.json({ success: true, faq: updatedFaq });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    await faq.deleteOne();

    // Delete from RAG knowledge base
    await KnowledgeBase.deleteMany({ source: 'faq', sourceId: req.params.id });

    return res.json({ success: true, message: 'FAQ deleted and removed from AI knowledge base' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
