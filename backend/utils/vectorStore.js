const KnowledgeBase = require('../models/KnowledgeBase');

// Standard stop words for filtering to improve accuracy
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here',
  'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in',
  'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor',
  'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
  'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
  'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
  'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
  'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves',
  // Simple multilingual terms
  'है', 'का', 'की', 'को', 'में', 'से', 'पर', 'और', 'का', 'को', 'यह', 'वह'
]);

/**
 * Tokenize and normalize text, supporting Indian languages scripts.
 */
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0C00-\u0C7F\u0B80-\u0BFF\u0D00-\u0D7F\u0C80-\u0CFF]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

/**
 * Splits text into overlapping chunks of roughly maxWords.
 */
function chunkText(text, maxWords = 150, overlapWords = 30) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return [text];

  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const chunkWords = words.slice(start, start + maxWords);
    chunks.push(chunkWords.join(' '));
    start += (maxWords - overlapWords);
  }
  return chunks;
}

/**
 * Indices/Re-indices a source document into the KnowledgeBase collection by chunking.
 */
async function indexDocument(title, content, source, sourceId = null, metadata = {}) {
  // 1. Delete previous chunks for this source to avoid duplicate entries
  const query = { source };
  if (sourceId) query.sourceId = sourceId;
  await KnowledgeBase.deleteMany(query);

  if (!content || content.trim().length === 0) return;

  // 2. Split content into semantic chunks
  const chunks = chunkText(content, 120, 20);

  // 3. Create document chunks in KnowledgeBase
  const docs = chunks.map((chunk, index) => ({
    title: chunks.length > 1 ? `${title} (Part ${index + 1})` : title,
    content: chunk,
    source,
    sourceId,
    metadata: { ...metadata, chunkIndex: index }
  }));

  await KnowledgeBase.insertMany(docs);
}

/**
 * Computes dynamic TF-IDF cosine similarity of query against all stored documents.
 * Since the size is small, loading documents and calculating dynamically is extremely fast and robust.
 */
async function vectorSearch(queryText, limit = 4) {
  const tokens = tokenize(queryText);
  if (tokens.length === 0) return [];

  // Load all knowledge base chunks from DB
  const docs = await KnowledgeBase.find({});
  if (docs.length === 0) return [];

  // Compute DF (Document Frequency) for terms in the vocabulary
  const df = {};
  const docTokensList = docs.map(doc => {
    const docTokens = tokenize(doc.content);
    const uniqueTokens = new Set(docTokens);
    uniqueTokens.forEach(t => {
      df[t] = (df[t] || 0) + 1;
    });
    return { doc, tokens: docTokens, tf: computeTF(docTokens) };
  });

  const N = docs.length;

  // Calculate IDF for terms
  const idf = {};
  Object.keys(df).forEach(term => {
    idf[term] = Math.log(1 + (N / (1 + df[term])));
  });

  // Vector representation of the query
  const queryTF = computeTF(tokens);
  const queryVector = {};
  Object.keys(queryTF).forEach(term => {
    if (idf[term]) {
      queryVector[term] = queryTF[term] * idf[term];
    }
  });

  const queryNorm = computeNorm(queryVector);
  if (queryNorm === 0) return [];

  // Calculate similarity for each document
  const results = docTokensList.map(({ doc, tf }) => {
    const docVector = {};
    Object.keys(tf).forEach(term => {
      if (idf[term]) {
        docVector[term] = tf[term] * idf[term];
      }
    });

    const docNorm = computeNorm(docVector);
    if (docNorm === 0) return { doc, score: 0 };

    // Calculate dot product
    let dotProduct = 0;
    Object.keys(queryVector).forEach(term => {
      if (docVector[term]) {
        dotProduct += queryVector[term] * docVector[term];
      }
    });

    const score = dotProduct / (queryNorm * docNorm);
    return { doc, score };
  });

  // Sort and filter results
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.doc);
}

// TF calculation helper
function computeTF(tokens) {
  const tf = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  const total = tokens.length;
  Object.keys(tf).forEach(t => {
    tf[t] = tf[t] / total;
  });
  return tf;
}

// Vector magnitude norm helper
function computeNorm(vector) {
  let sum = 0;
  Object.values(vector).forEach(val => {
    sum += val * val;
  });
  return Math.sqrt(sum);
}

module.exports = {
  indexDocument,
  vectorSearch,
  chunkText,
  tokenize
};
