# Quick Setup Guide

## Prerequisites
- Node.js 14+ installed
- npm or yarn

## Installation Steps

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up ElevenLabs API:**
   - Get your API key from [ElevenLabs Dashboard](https://elevenlabs.io/)
   - Create a `.env` file in the root directory (copy from `env.example`):
     ```bash
     ELEVENLABS_API_KEY=your_api_key_here
     ELEVENLABS_ENDPOINT=https://api.elevenlabs.io/v1/speech-to-text/kannada_speech_to_text
     ELEVENLABS_MODEL=scribev2
     ```
   - Or set environment variables:
     ```bash
     # Windows (PowerShell)
     $env:ELEVENLABS_API_KEY="your_api_key_here"
     $env:ELEVENLABS_MODEL="scribev2"
     
     # Windows (CMD)
     set ELEVENLABS_API_KEY=your_api_key_here
     set ELEVENLABS_MODEL=scribev2
     
     # Linux/Mac
     export ELEVENLABS_API_KEY="your_api_key_here"
     export ELEVENLABS_MODEL="scribev2"
     ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

## Testing Without ElevenLabs API

The application includes fallback options:
1. **ElevenLabs API** (primary) - requires API key
2. **Google Cloud Speech API** (fallback) - requires credentials
3. **Mock transcription** (testing) - works without any API credentials

The system will automatically fall back to the next available option if the primary service is not configured.

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change PORT in server/index.js or set PORT environment variable
- React app port can be changed by setting PORT in client/.env

### Microphone Access Denied
- Make sure you allow microphone access in your browser
- Check browser settings for site permissions

### CORS Errors
- Ensure backend is running on port 5000
- Check that REACT_APP_API_URL matches your backend URL

### Audio File Upload Fails
- Check file size (max 50MB)
- Ensure file format is MP3, WAV, or WebM
- Check server/uploads directory exists and is writable

## Development Tips

- Backend logs will show in the terminal running `npm run server`
- Frontend hot-reloads automatically on file changes
- Check browser console for frontend errors
- Check server terminal for backend errors

