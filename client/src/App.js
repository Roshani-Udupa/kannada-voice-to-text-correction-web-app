import React, { useState, useEffect } from 'react';
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import TranscriptionViewer from './components/TranscriptionViewer';
import ExportButton from './components/ExportButton';
import { transcribeAudio, exportDocument } from './services/api';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [correctedText, setCorrectedText] = useState('');
  const [confusions, setConfusions] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize corrected text when transcription is received
  useEffect(() => {
    if (transcription) {
      setCorrectedText(transcription.text);
    }
  }, [transcription]);

  const handleAudioUpload = (file) => {
    setAudioFile(file);
    setTranscription(null);
    setCorrectedText('');
    setConfusions([]);
    setError(null);
  };

  const handleRecordingComplete = (file) => {
    if (file) {
      setAudioFile(file);
      setTranscription(null);
      setCorrectedText('');
      setConfusions([]);
      setError(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please upload or record an audio file first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('difficulty', difficulty);
      formData.append('language', 'kan');

      const result = await transcribeAudio(formData);
      setTranscription(result);
      setConfusions(result.confusions || []);
    } catch (err) {
      setError(err.message || 'Transcription failed. Please try again.');
      console.error('Transcription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextChange = (newText) => {
    setCorrectedText(newText);
  };

  const handleConfusionUpdate = (updatedConfusions) => {
    setConfusions(updatedConfusions);
  };

  const handleExport = async () => {
    if (!transcription || !correctedText) {
      setError('No text to export. Please transcribe audio first.');
      return;
    }

    try {
      await exportDocument(transcription.text, correctedText);
    } catch (err) {
      setError(err.message || 'Export failed. Please try again.');
      console.error('Export error:', err);
    }
  };

  return (
    <div className="App font-sans">
      <header className="app-header">
        <h1>ಕನ್ನಡ ಧ್ವನಿ-ಪಠ್ಯ ಸರಿಪಡಿಸುವಿಕೆ</h1>
        <p className="subtitle">Kannada Voice-to-Text Correction</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="container">
          {/* Audio Input Section */}
          <section className="section audio-section">
            <h2>1. Audio Input</h2>
            
            <div className="difficulty-selector">
              <label>Paragraph Difficulty:</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isProcessing}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <AudioRecorder
              onUpload={handleAudioUpload}
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              onRecordingChange={setIsRecording}
              disabled={isProcessing}
            />

            {audioFile && (
              <div className="audio-info">
                <p>✓ Audio file ready: {audioFile.name}</p>
                <button 
                  className="app-btn app-btn-primary" 
                  onClick={handleTranscribe}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Transcribe Audio'}
                </button>
              </div>
            )}
          </section>

          {/* Transcription Section */}
          {transcription && (
            <section className="section transcription-section">
              <h2>2. Transcription & Correction</h2>
              
              <TranscriptionViewer
                text={correctedText}
                confusions={confusions}
                onTextChange={handleTextChange}
                onConfusionUpdate={handleConfusionUpdate}
              />
            </section>
          )}

          {/* Export Section */}
          {transcription && correctedText && (
            <section className="section export-section">
              <h2>3. Export</h2>
              <ExportButton onExport={handleExport} />
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built for Kannada speakers • Accurate transcription with interactive correction</p>
      </footer>
    </div>
  );
}

export default App;

