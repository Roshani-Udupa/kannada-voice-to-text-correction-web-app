// Kannada Confusion Detection Logic
// Only highlights low confidence words/characters

/**
 * Detect potential confusions in Kannada text
 * Only highlights if confidence is low (< 0.8)
 */
function detectConfusions(transcriptionResult) {
  const text = transcriptionResult.text || '';
  const words = transcriptionResult.words || [];
  const confusions = [];
  
  // Threshold for low confidence (only highlight if below this)
  const CONFIDENCE_THRESHOLD = 0.8;
  
  // If we have word-level confidence, use it to highlight low confidence words
  if (words.length > 0) {
    let charPosition = 0;
    
    words.forEach((wordInfo) => {
      const word = wordInfo.word || '';
      const confidence = wordInfo.confidence || transcriptionResult.confidence || 0.5;
      
      // Only highlight if confidence is below threshold
      if (confidence < CONFIDENCE_THRESHOLD && word.length > 0) {
        // Find the position of this word in the text
        const wordStart = text.indexOf(word, charPosition);
        
        if (wordStart !== -1) {
          // Highlight each character in the low confidence word
          for (let i = 0; i < word.length; i++) {
            const position = wordStart + i;
            if (position < text.length) {
              confusions.push({
                position: position,
                char: text[position],
                confidence: confidence,
                type: 'low_confidence',
                word: word,
                wordStart: wordStart,
                wordEnd: wordStart + word.length
              });
            }
          }
          charPosition = wordStart + word.length;
        } else {
          // If word not found, advance position
          charPosition += word.length + 1; // +1 for space
        }
      } else {
        // Advance position even if not highlighting
        const wordStart = text.indexOf(word, charPosition);
        if (wordStart !== -1) {
          charPosition = wordStart + word.length;
        } else {
          charPosition += word.length + 1;
        }
      }
    });
  } else {
    // Fallback: if no word-level data, use overall confidence
    const overallConfidence = transcriptionResult.confidence || 0.5;
    if (overallConfidence < CONFIDENCE_THRESHOLD) {
      // Highlight all characters if overall confidence is low
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ' && text[i] !== '\n') {
          confusions.push({
            position: i,
            char: text[i],
            confidence: overallConfidence,
            type: 'low_confidence',
            word: text[i]
          });
        }
      }
    }
  }
  
  return confusions;
}

module.exports = { detectConfusions };
