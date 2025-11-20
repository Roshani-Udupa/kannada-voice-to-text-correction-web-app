# PROBLEM STATEMENT 1: Kannada Voice-to-Text Correction Challenge

A web application that records or uploads Kannada audio, converts it to text using Speech-to-Text APIs, highlights confusing/misrecognized Kannada characters (including ottaksharas), and lets users correct them interactively. The final output can be exported as TXT containing both model-generated and user-corrected text.

## Team Details

### Team Name - KannadaHackerz

### Team Members

- **1MS23CS152**: Risshab Srinivas Ramesh
- **1MS23CS155**: Roshani T S Udupa

## Features

### Audio Input

- **Option A**: Upload pre-recorded audio files (MP3/WAV/WebM)
- **Option B**: Live audio recording using browser microphone
- Support for easy, medium, and hard paragraph difficulty levels

### Speech-to-Text

- Converts audio to Kannada text using ElevenLabs API SDK
- Uses `scribe_v1` or `scribe_v2` model (configurable)
- Highlights only low confidence words (< 80% confidence) for user correction
- Stores raw model-generated output with word-level confidence scores

### Low Confidence Detection

- Automatically detects words with low confidence scores (< 80%)
- Only highlights words that need user attention
- Provides confidence percentage for each low confidence word
- Navigation button to jump to next low confidence word

### Interactive Correction UI

- Clean text editor for transcription display
- Click on low confidence words to see details
- **Kannada Virtual Keyboard** with vowels, consonants, and numbers
- Common Kannada words shortcuts
- Real-time text editing capability
- Navigate between low confidence words easily

### Export Functionality

- Download as TXT
- Export file contains:
  - Section 1: Model Generated Text
  - Section 2: User Corrected Text

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- ElevenLabs API key (required for speech-to-text)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Roshani-Udupa/kannada-voice-to-text-correction-web-app.git
   cd kannada-voice-to-text-correction-web-app/
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Set up ElevenLabs API**

   For speech-to-text conversion:

   - Get your ElevenLabs API key from [ElevenLabs Dashboard](https://elevenlabs.io/)
   - Create a `.env` file in the root directory:
     ```bash
     ELEVENLABS_API_KEY=your_api_key_here
     ELEVENLABS_MODEL=scribe_v2
     ```
   - Or set environment variables:
     ```bash
     export ELEVENLABS_API_KEY="your_api_key_here"
     export ELEVENLABS_MODEL="scribe_v2"  # or "scribe_v1"
     ```

   **Note**: The application requires ElevenLabs API key to function.

4. **Create environment file (optional)**
   ```bash
   # In server directory or root
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm run client
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

1. Build the frontend:

   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run server
   ```

## Usage

1. **Select Difficulty Level**: Choose easy, medium, or hard for your paragraph
2. **Input Audio**:
   - Upload an audio file (MP3/WAV/WebM), or
   - Click "Start Recording" to record live audio
3. **Transcribe**: Click "Transcribe Audio" to convert speech to text
4. **Correct**: Click on highlighted yellow text to see correction options
5. **Export**: Download the final transcription as TXT

## Project Structure

```
kannada_hackathon/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AudioRecorder.js
│   │   │   ├── TranscriptionViewer.js
│   │   │   └── ExportButton.js
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── recordings/            # voice recordings (samples)
├── server/                # Node.js backend
│   ├── index.js           # Express server
│   ├── sttService.js      # Speech-to-Text service
│   ├── confusionDetector.js # Confusion detection logic
│   └── exportService.js   # TXT export
├── speech_conversion_to_text    # txt outputs for the sample inputs.
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/transcribe`

Transcribe audio file to Kannada text.

**Request:**

- `audio`: Audio file (multipart/form-data)
- `difficulty`: "easy" | "medium" | "hard"
- `language`: Language code (default: "kn-IN")

**Response:**

```json
{
  "success": true,
  "transcription": "transcribed text...",
  "confusions": [...],
  "difficulty": "medium",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/export`

Export transcription as TXT.

**Request:**

```json
{
  "modelText": "original text",
  "correctedText": "corrected text",
  "format": "txt"
}
```

## Confusion Detection

The application detects:

- **Character confusions**: Similar-looking or sounding characters (ವ/ಮ, ಪ/ಫ, etc.)
- **Ottakshara issues**: Split ottaksharas (ಕ್ ಕ instead of ಕ್ಕ)
- **Low confidence words**: Words with confidence < 0.8

## Technologies Used

- **Frontend**: React, CSS3, Axios
- **Backend**: Node.js, Express
- **STT**: ElevenLabs API SDK (@elevenlabs/elevenlabs-js)
- **Audio Recording**: MediaRecorder API
- **Kannada Input**: Custom virtual keyboard component

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (with limitations on MediaRecorder)

## Limitations

- Audio file size limit: 50MB
- Recording duration: Up to 3 minutes recommended
- ElevenLabs API has usage limits based on your subscription plan
- Only words with confidence < 80% are highlighted for correction
- Requires microphone permission for live recording

## Future Enhancements

- Support for multiple STT providers (Whisper, Vosk)
- Offline transcription support
- Batch processing for multiple files
- User accounts and history
- Advanced confusion detection with ML models
- Real-time transcription during recording

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Notes

The samples and results are in `recordings/` and `speech_conversion_to_text/` folders respectively.

---

Built for Kannada speakers who want accurate transcription for academic, personal, or documentation use.
