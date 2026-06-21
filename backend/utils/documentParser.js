const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Parses a local PDF file and returns its raw text content.
 */
async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdfParse(dataBuffer);
    return parsedData.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF document.');
  }
}

/**
 * Parses a local DOCX file and returns its plain text content.
 */
async function parseDOCX(filePath) {
  try {
    const parsedData = await mammoth.extractRawText({ path: filePath });
    return parsedData.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX document.');
  }
}

/**
 * Dispatches parsing based on file extension.
 */
async function parseDocument(filePath, extension) {
  const ext = extension.toLowerCase().replace('.', '');
  if (ext === 'pdf') {
    return await parsePDF(filePath);
  } else if (ext === 'docx') {
    return await parseDOCX(filePath);
  } else {
    throw new Error(`Unsupported document file type: .${ext}`);
  }
}

module.exports = {
  parsePDF,
  parseDOCX,
  parseDocument
};
