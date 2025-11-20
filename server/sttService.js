// Speech-to-Text Service using ElevenLabs SDK

require('dotenv').config();
const fs = require('fs');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

/**
 * Transcribe audio using ElevenLabs Speech-to-Text API
 */
async function transcribeAudio(audioPath, languageCode = 'kan') {
  try {
    // Check if API key is set
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not found. Please set ELEVENLABS_API_KEY environment variable.');
    }

    // Initialize ElevenLabs client
    // API key defaults to process.env.ELEVENLABS_API_KEY if not provided
    const elevenlabs = new ElevenLabsClient();

    // Read audio file as buffer
    const audioBuffer = fs.readFileSync(audioPath);
    
    // Get model from environment (default to scribe_v2)
    const modelId = process.env.ELEVENLABS_MODEL || 'scribe_v2';
    
    // Create a File object if available (Node.js 18+), otherwise use buffer
    let fileInput;
    if (typeof File !== 'undefined') {
      // Node.js 18+ has File API
      fileInput = new File([audioBuffer], 'audio.' + getFileExtension(audioPath), {
        type: getMimeType(audioPath)
      });
    } else {
      // For older Node.js versions, pass buffer directly
      // The SDK should handle Buffer or we can create a Blob polyfill
      fileInput = audioBuffer;
    }
    
    // Transcribe using ElevenLabs SDK
    const transcription = await elevenlabs.speechToText.convert({
      file: fileInput,
      modelId: modelId,
      tagAudioEvents: false,
      languageCode: languageCode, // 'kan' for Kannada
      diarize: false,
    });

    // Extract text and word-level data
    const text = transcription.text || '';
    const words = transcription.words || [];
    
    // Map words to our format with confidence scores
    const wordsWithConfidence = words.map(word => ({
      word: word.word || word.text || '',
      confidence: word.confidence || 0.8,
      startTime: word.start || 0,
      endTime: word.end || 0
    }));

    // Calculate overall confidence
    const overallConfidence = transcription.confidence || 
      (wordsWithConfidence.length > 0 
        ? wordsWithConfidence.reduce((sum, w) => sum + w.confidence, 0) / wordsWithConfidence.length 
        : 0.8);

    return {
      text: text.trim(),
      confidence: overallConfidence,
      words: wordsWithConfidence
    };
  } catch (error) {
    console.error('ElevenLabs STT error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

/**
 * Get MIME type from file path
 */
function getMimeType(filePath) {
  const ext = filePath.toLowerCase().split('.').pop();
  const mimeTypes = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'webm': 'audio/webm',
    'ogg': 'audio/ogg',
    'm4a': 'audio/mp4',
    'flac': 'audio/flac'
  };
  return mimeTypes[ext] || 'audio/mpeg';
}

/**
 * Get file extension from file path
 */
function getFileExtension(filePath) {
  return filePath.toLowerCase().split('.').pop() || 'mp3';
}

module.exports = { transcribeAudio };
