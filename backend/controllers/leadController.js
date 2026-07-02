const Lead = require('../models/Lead');

// @desc    Create a new lead (quote request / product configuration submission)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, phone, email, productName, category, configuration, quotedPrice, message } = req.body;

    if (!name || !phone || !email || !productName || !category || quotedPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      productName,
      category,
      configuration,
      quotedPrice,
      message
    });

    return res.status(201).json({ success: true, lead });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads with search and filter
// @route   GET /api/leads
// @access  Private (Admin)
const getLeads = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lead record
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.json({ success: true, message: 'Lead removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lead record (e.g. status)
// @route   PUT /api/leads/:id
// @access  Private (Admin)
const updateLead = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.json({ success: true, lead });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  deleteLead,
  updateLead
};
