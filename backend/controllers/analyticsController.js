const ConversationLog = require('../models/ConversationLog');
const Lead = require('../models/Lead');
const Product = require('../models/Product');

// @desc    Get aggregated conversation analytics
// @route   GET /api/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    // 1. Total Conversations (Unique sessionIds)
    const uniqueSessions = await ConversationLog.distinct('sessionId');
    const totalConversations = uniqueSessions.length;

    // 2. Language Usage Statistics
    const languageStats = await ConversationLog.aggregate([
      { $group: { _id: '$detectedLanguage', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Format languages for chart
    const languages = languageStats.map(item => ({
      name: item._id || 'Unknown',
      count: item.count
    }));

    // 3. User Satisfaction / AI Accuracy Feedback Ratios
    const feedbackStats = await ConversationLog.aggregate([
      { $group: { _id: '$feedback', count: { $sum: 1 } } }
    ]);

    let helpful = 0;
    let unhelpful = 0;
    feedbackStats.forEach(item => {
      if (item._id === 'helpful') helpful = item.count;
      if (item._id === 'unhelpful') unhelpful = item.count;
    });

    const totalRated = helpful + unhelpful;
    const satisfactionRate = totalRated > 0 ? Math.round((helpful / totalRated) * 100) : 100;

    // 4. Topic/Query Keyword Frequency (Intents matched)
    const logs = await ConversationLog.find({}, 'userQuery');
    const topics = {
      mattresses: 0,
      sofas: 0,
      warranty: 0,
      stores: 0,
      price: 0,
      customSize: 0
    };

    logs.forEach(log => {
      const q = (log.userQuery || '').toLowerCase();
      if (q.includes('mattress') || q.includes('bed') || q.includes('ortho') || q.includes('latex')) topics.mattresses++;
      if (q.includes('sofa') || q.includes('recliner') || q.includes('couch') || q.includes('seating')) topics.sofas++;
      if (q.includes('warranty') || q.includes('guarantee')) topics.warranty++;
      if (q.includes('store') || q.includes('location') || q.includes('branch')) topics.stores++;
      if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('price?')) topics.price++;
      if (q.includes('custom') || q.includes('size') || q.includes('measure')) topics.customSize++;
    });

    const topicStats = Object.entries(topics).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count
    })).sort((a, b) => b.count - a.count);

    // 5. Total Business Inquiries/Leads generated
    const totalLeads = await Lead.countDocuments();

    // 6. Get Top Viewed Products count (mocked or aggregated from leads)
    const productLeads = await Lead.aggregate([
      { $group: { _id: '$productName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topProducts = productLeads.map(item => ({
      name: item._id || 'General Catalog',
      count: item.count
    }));

    return res.json({
      success: true,
      metrics: {
        totalConversations,
        totalLeads,
        satisfactionRate,
        feedback: { helpful, unhelpful, totalRated },
        languages,
        topics: topicStats,
        topProducts
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics
};
