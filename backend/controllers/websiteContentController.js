const WebsiteContent = require('../models/WebsiteContent');
const { indexDocument } = require('../utils/vectorStore');

// Map of user-friendly titles for sections
const SECTION_TITLES = {
  about_us: 'About Us Company Story',
  contact_info: 'Contact Information and Customer Support Details',
  store_locations: 'Physical Store Locations and Factory Outlets',
  warranty_policy: 'Warranty and Product Quality Guarantees',
  delivery_info: 'Delivery and Shipment Logistics Policies',
  return_policy: 'Product Return and Replacement Policies'
};

// @desc    Get website content by key (or return empty default if not exists)
// @route   GET /api/website-content/:key
// @access  Public
const getContentByKey = async (req, res) => {
  const { key } = req.params;

  try {
    let contentObj = await WebsiteContent.findOne({ key });
    if (!contentObj) {
      // Return a default stub structure
      const title = SECTION_TITLES[key] || key.replace('_', ' ').toUpperCase();
      contentObj = {
        key,
        title,
        content: `Default placeholder content for ${title}. Admin can configure this in the Dashboard.`
      };
    }
    return res.json({ success: true, data: contentObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all website content keys and contents
// @route   GET /api/website-content
// @access  Public
const getAllContent = async (req, res) => {
  try {
    const contents = await WebsiteContent.find({});
    // Construct a full list ensuring all standard keys exist
    const result = {};
    for (const key of Object.keys(SECTION_TITLES)) {
      const dbMatch = contents.find(c => c.key === key);
      result[key] = dbMatch ? dbMatch.content : `Placeholder content for ${SECTION_TITLES[key]}.`;
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website content by key
// @route   PUT /api/website-content/:key
// @access  Private (Admin)
const updateContentByKey = async (req, res) => {
  const { key } = req.params;
  const { content, title } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Please provide content content text' });
  }

  try {
    let contentObj = await WebsiteContent.findOne({ key });
    const computedTitle = title || SECTION_TITLES[key] || key.replace('_', ' ').toUpperCase();

    if (contentObj) {
      contentObj.content = content;
      if (title) contentObj.title = title;
      await contentObj.save();
    } else {
      contentObj = await WebsiteContent.create({
        key,
        title: computedTitle,
        content
      });
    }

    // Sync to RAG Knowledge Base
    const textToIndex = `Section: ${contentObj.title}\nContent details: ${contentObj.content}`;
    await indexDocument(contentObj.title, textToIndex, 'website_content', key);

    return res.json({
      success: true,
      message: `${computedTitle} updated and re-indexed successfully.`,
      data: contentObj
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContentByKey,
  getAllContent,
  updateContentByKey
};
