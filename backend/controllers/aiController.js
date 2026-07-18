const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const KnowledgeBase = require('../models/KnowledgeBase');
const ConversationLog = require('../models/ConversationLog');
const { vectorSearch, indexDocument } = require('../utils/vectorStore');
const { parseDocument } = require('../utils/documentParser');

/**
 * @desc    Chat with Groq AI using RAG context
 * @route   POST /api/ai/chat
 * @access  Public
 */
const chatWithAI = async (req, res) => {
  const { message, history = [], sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message query is required' });
  }

  const activeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    // 1. Vector Search for relevant document chunks
    const relevantChunks = await vectorSearch(message, 4);

    // 2. Format Context
    let contextText = '';
    if (relevantChunks.length > 0) {
      contextText = relevantChunks.map((chunk, index) => {
        return `[Source Document ${index + 1}: ${chunk.title}]\n${chunk.content}`;
      }).join('\n\n');
    } else {
      contextText = 'No specific knowledge base context found for this query.';
    }

    // 3. Assemble Messages for Groq AI
    const systemPrompt = `You are Sleepora AI, the official intelligent sales and support assistant for Sleepora, a premium factory-direct mattress and furniture manufacturer. You act as a professional mattress consultant, sleep expert, product advisor, pricing assistant, and customer support executive.
Your goal is to help customers confidently choose the best mattress or furniture, guiding them toward a purchase. Every conversation should feel like a premium showroom consultation.

PRIORITIZE SLEEPORA KNOWLEDGE BASE:
Use the provided context to answer questions about products, sizes, thickness, comfort, layers, prices, warranty, and delivery.
Context:
\"\"\"
${contextText}
\"\"\"

If the answer is not present in the context, use your general knowledge of sleep health, mattress materials (memory foam, latex, spring), sleep tips, or care. After explaining general benefits, ALWAYS connect it back to Sleepora products (e.g., memory foam pressure relief links to Sleepora Ortho Memory Foam).

RECOMMENDATION ENGINE:
- Back Pain / Senior Citizens -> Ortho Memory Foam
- Neck/Joint Pain / Side Sleeper / Hot Sleeper -> Latex
- Back Sleeper -> Ortho
- Stomach Sleeper -> Medium Firm
- Heavy Weight / Luxury / Hotel / Couples -> Pocket Spring
- Budget / Guest Room -> Dual Comfort
- Kids -> Foam

BUDGET SEGMENTS:
- Under ₹10,000: Dual Comfort or Ortho 4"
- Around ₹15,000: Ortho 6" or Latex
- Around ₹25,000+: Premium Latex or Pocket Spring

HEALTH CONCERNS:
When mentioning health/pain relief, include this exact statement: "This mattress is designed to provide better support and pressure relief. For medical advice, please consult a healthcare professional."

PRODUCT RECOMMENDATION FORMAT:
When recommending a product, format the answer strictly like this:
**Recommended Product**: [Name]
**Why this is recommended**: [Detailed reason matching sleep position/pain/budget]
**Main Benefits**: [Bullet list of benefits]
**Recommended Size**: [Size]
**Recommended Thickness**: [Thickness]
**Estimated Price**: [Price or approximate based on official pricing structure]
**Warranty**: [Warranty details]
**Customization Available**: [Customization statement]
**Delivery Information**: [Delivery time/free delivery]

End recommendations with: "Would you like me to compare this with another mattress or calculate the exact price for your preferred size?"

COMPARISONS:
When comparing mattresses, create a clear markdown table comparing: Comfort, Support, Cooling, Durability, Motion Isolation, Best For, Warranty, Price, Value for Money. Then state a clear recommendation.

CUSTOMIZATION STEPS:
Guide users step-by-step: Choose Size -> Choose Comfort -> Choose Thickness -> Choose Cover Fabric -> View Layer Composition -> Review Configuration -> Calculate Price -> Send Inquiry.

CONVERSATION RULES:
1. Detect user's language and reply in the exact same language (e.g. Hindi, Telugu, Tamil, Malayalam, Kannada, or English).
2. When responding in Telugu:
   - ALWAYS use "మెట్రెస్" (or "మ్యాట్రెస్") for the product "Mattress".
   - NEVER translate "Mattress" as "మంచం", because "మంచం" refers to a bed/cot rather than the mattress itself.
   - Use natural Telugu while keeping mattress-related technical terms in transliterated English where appropriate (e.g., Mattress -> మెట్రెస్, Memory Foam Mattress -> మెమరీ ఫోమ్ మెట్రెస్, Orthopedic Mattress -> ఆర్థోపెడిక్ మెట్రెస్, Latex Mattress -> లాటెక్స్ మెట్రెస్, Pocket Spring Mattress -> పాకెట్ స్ప్రింగ్ మెట్రెస్, Mattress Thickness -> మెట్రెస్ మందం, Mattress Size -> మెట్రెస్ పరిమాణం).
3. Keep responses concise, warm, professional, and formatted with clean markdown.
4. Suggest next options at the very end of your response text (e.g. "Would you like: Price Calculation | Mattress Comparison | size suggestion").
5. Suggest a redirect route from the list below if they mention products or sections:
- Mattresses Range: /products/mattresses
- Sofa Collection: /products/sofas
- About Us: /about
- Contact Us: /contact
- Warranty Info: /warranty
- Store Locations: /stores

Response Format (Valid JSON object with exactly three fields):
{
  "response": "Answer text with markdown styling, tables, product formats, and next steps as instructed",
  "redirect": "/route-if-applicable-else-empty-string",
  "language": "Detected language (English | Hindi | Telugu | Tamil | Malayalam | Kannada)"
}
`;

    // Map history to OpenAI format
    const chatMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Append history (limit to last 4 exchanges to keep context clean and avoid token bloat)
    const recentHistory = history.slice(-8);
    recentHistory.forEach(h => {
      chatMessages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: typeof h.content === 'object' ? h.content.response || JSON.stringify(h.content) : h.content
      });
    });

    // Append current user message
    chatMessages.push({ role: 'user', content: message });

    // 4. Invoke Groq AI API
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      console.warn('Groq API Key is not configured in environment variables.');
      const fallbackResponse = {
        response: "Hello! Groq AI is currently offline (Key not configured). Please configure GROQ_API_KEY in the backend to talk with me.",
        redirect: "",
        language: "English"
      };
      
      // Log interaction
      await ConversationLog.create({
        sessionId: activeSessionId,
        userQuery: message,
        aiResponse: fallbackResponse.response,
        detectedLanguage: fallbackResponse.language,
        navigatedTo: fallbackResponse.redirect
      });

      return res.json({
        success: true,
        data: fallbackResponse,
        sessionId: activeSessionId
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: chatMessages,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error Response:', errText);
      throw new Error(`Groq API returned HTTP status ${response.status}`);
    }

    const responseData = await response.json();
    const rawContent = responseData.choices[0].message.content.trim();

    let aiResult;
    try {
      aiResult = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('JSON parsing failed for Groq output:', rawContent, parseError);
      // Fallback parser if JSON structure is slightly off
      aiResult = {
        response: rawContent,
        redirect: "",
        language: "English"
      };
    }

    // 5. Save Conversation Log for Analytics Dashboard
    await ConversationLog.create({
      sessionId: activeSessionId,
      userQuery: message,
      aiResponse: aiResult.response,
      detectedLanguage: aiResult.language || 'English',
      navigatedTo: aiResult.redirect || ''
    });

    return res.json({
      success: true,
      data: aiResult,
      sessionId: activeSessionId
    });

  } catch (error) {
    console.error('AI Conversation Handler Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Train AI by uploading document (PDF/DOCX)
 * @route   POST /api/ai/train-upload
 * @access  Private (Admin)
 */
const trainDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a document file (.pdf or .docx)' });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname);
  const fileId = new mongoose.Types.ObjectId().toString();

  try {
    // 1. Parse text content from uploaded file
    const textContent = await parseDocument(filePath, fileExt);

    if (!textContent || textContent.trim().length === 0) {
      // Remove temporary file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Document text could not be extracted or file is empty' });
    }

    // 2. Index content chunks in RAG Vector Store
    await indexDocument(
      req.file.originalname,
      textContent,
      'uploaded_document',
      fileId,
      {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        localPath: filePath
      }
    );

    return res.json({
      success: true,
      message: `Document "${req.file.originalname}" parsed and added to AI knowledge base.`,
      document: {
        id: fileId,
        name: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    // Remove temporary file if upload failed
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Cleanup failed:', err);
      }
    }
    console.error('Document training failed:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all trained document sources
 * @route   GET /api/ai/documents
 * @access  Private (Admin)
 */
const getTrainedDocuments = async (req, res) => {
  try {
    const docs = await KnowledgeBase.find({ source: 'uploaded_document' });
    
    // Group chunks by originalName
    const docsMap = {};
    docs.forEach(d => {
      const name = d.metadata?.originalName || d.title;
      const fileId = d.sourceId;
      if (!docsMap[fileId]) {
        docsMap[fileId] = {
          id: fileId,
          name,
          chunksCount: 0,
          createdAt: d.createdAt
        };
      }
      docsMap[fileId].chunksCount++;
    });

    const documents = Object.values(docsMap).sort((a, b) => b.createdAt - a.createdAt);

    return res.json({ success: true, documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a trained document source
 * @route   DELETE /api/ai/documents/:id
 * @access  Private (Admin)
 */
const deleteTrainedDocument = async (req, res) => {
  const { id } = req.params;

  try {
    // Find matching chunks
    const chunks = await KnowledgeBase.find({ source: 'uploaded_document', sourceId: id });
    if (chunks.length === 0) {
      return res.status(404).json({ success: false, message: 'Document chunks not found' });
    }

    // Try deleting the actual physical file, if metadata stores localPath
    const localPath = chunks[0].metadata?.localPath;
    if (localPath && fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (unlinkErr) {
        console.warn('Physical file deletion warning:', unlinkErr);
      }
    }

    // Delete chunks from MongoDB
    await KnowledgeBase.deleteMany({ source: 'uploaded_document', sourceId: id });

    return res.json({ success: true, message: 'Document removed from AI knowledge base' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Submit user helpful/unhelpful rating feedback for a message log
 * @route   POST /api/ai/feedback
 * @access  Public
 */
const submitFeedback = async (req, res) => {
  const { logId, feedback } = req.body;

  if (!logId || !['helpful', 'unhelpful'].includes(feedback)) {
    return res.status(400).json({ success: false, message: 'Invalid feedback data' });
  }

  try {
    const log = await ConversationLog.findById(logId);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Conversation record not found' });
    }

    log.feedback = feedback;
    await log.save();

    return res.json({ success: true, message: 'Feedback logged successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  chatWithAI,
  trainDocument,
  getTrainedDocuments,
  deleteTrainedDocument,
  submitFeedback
};
