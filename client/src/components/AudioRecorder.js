import React, { useRef, useState } from 'react';
import { FaMicrophone, FaStop, FaUpload, FaTimes } from 'react-icons/fa';
import './AudioRecorder.css';

const AudioRecorder = ({ onUpload, onRecordingComplete, isRecording, onRecordingChange, disabled }) => {
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, recorded

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
      setRecordingStatus('idle');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: 'audio/webm'
        });
        onRecordingComplete(audioFile);
        setRecordingStatus('recorded');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingStatus('recording');
      onRecordingChange(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
    }
    setRecordingStatus('idle');
    audioChunksRef.current = [];
  };

  return (
    <div className="audio-recorder">
      <div className="audio-input-options">
        {/* Upload Option */}
        <div className="input-option">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/mpeg,audio/wav,audio/mp3,audio/webm,audio/ogg"
            style={{ display: 'none' }}
            disabled={disabled || recordingStatus === 'recording'}
          />
          <button
            className="app-btn app-btn-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || recordingStatus === 'recording'}
          >
            <FaUpload /> Upload Audio File
          </button>
          <p className="input-hint">MP3, WAV, or WebM format</p>
        </div>

        {/* Recording Option */}
        <div className="input-option">
          {recordingStatus === 'idle' && (
            <button
              className="app-btn app-btn-record"
              onClick={startRecording}
              disabled={disabled}
            >
              <FaMicrophone /> Start Recording
            </button>
          )}

          {recordingStatus === 'recording' && (
            <div className="recording-controls">
              <div className="recording-indicator">
                <span className="recording-dot"></span>
                <span>Recording...</span>
              </div>
              <button
                className="app-btn app-btn-stop"
                onClick={stopRecording}
              >
                <FaStop /> Stop Recording
              </button>
              <button
                className="app-btn app-btn-cancel"
                onClick={cancelRecording}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}

          {recordingStatus === 'recorded' && (
            <div className="recorded-status">
              <p>✓ Recording complete! Click "Transcribe Audio" to proceed.</p>
              <button
                className="app-btn app-btn-secondary"
                onClick={() => setRecordingStatus('idle')}
              >
                Record Again
              </button>
            </div>
          )}

          <p className="input-hint">Record up to 3 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;

