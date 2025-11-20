require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { detectConfusions } = require('./confusionDetector');
const { generateTXT } = require('./exportService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/ogg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// STT Service
const { transcribeAudio } = require('./sttService');

// Routes
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioPath = req.file.path;
    const difficulty = req.body.difficulty || 'medium'; // easy, medium, hard
    const language = req.body.language || 'kan'; // Kannada

    // Transcribe audio
    const transcriptionResult = await transcribeAudio(audioPath, language);
    
    // Detect confusions
    const confusions = detectConfusions(transcriptionResult);
    
    // Clean up uploaded file
    fs.unlinkSync(audioPath);

    res.json({
      success: true,
      text: transcriptionResult.text,
      transcription: transcriptionResult.text, // For backward compatibility
      confusions,
      difficulty,
      confidence: transcriptionResult.confidence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Transcription failed', 
      message: error.message 
    });
  }
});

app.post('/api/export', async (req, res) => {
  try {
    const { modelText, correctedText } = req.body;

    if (!modelText || !correctedText) {
      return res.status(400).json({ error: 'Missing text data' });
    }

    const txtContent = generateTXT(modelText, correctedText);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=kannada-transcription.txt');
    res.send(txtContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed', message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

