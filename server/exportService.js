// Export Service for TXT generation

function generateTXT(modelText, correctedText) {
  const content = [
    '='.repeat(60),
    'Kannada Transcription',
    '='.repeat(60),
    '',
    'Section 1: Model Generated Text',
    '-'.repeat(60),
    modelText,
    '',
    '',
    'Section 2: User Corrected Text',
    '-'.repeat(60),
    correctedText,
    '',
    '',
    `Generated on: ${new Date().toLocaleString()}`,
    '='.repeat(60)
  ].join('\n');
  
  return content;
}

module.exports = { generateTXT };

