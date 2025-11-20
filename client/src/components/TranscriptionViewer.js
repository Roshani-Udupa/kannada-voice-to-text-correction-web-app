import React, { useState, useEffect, useRef } from 'react';
import KannadaKeyboard from './KannadaKeyboard';
import './TranscriptionViewer.css';

const TranscriptionViewer = ({ text, confusions, onTextChange, onConfusionUpdate }) => {
  const [selectedConfusion, setSelectedConfusion] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showKeyboard, setShowKeyboard] = useState(false);
  const textAreaRef = useRef(null);
  const popupRef = useRef(null);

  // Sort confusions by position
  const sortedConfusions = [...confusions].sort((a, b) => a.position - b.position);

  // Handle click on highlighted text
  const handleTextClick = (e) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    
    const clickPosition = textarea.selectionStart;
    
    // Find confusion at this position (low confidence words)
    const confusion = sortedConfusions.find(c => {
      const start = c.wordStart !== undefined ? c.wordStart : c.position;
      const end = c.wordEnd !== undefined ? c.wordEnd : c.position + 1;
      return clickPosition >= start && clickPosition < end;
    });

    if (confusion) {
      setSelectedConfusion(confusion);
      
      // Calculate popup position based on cursor position in textarea
      const rect = textarea.getBoundingClientRect();
      const style = window.getComputedStyle(textarea);
      const lineHeight = parseInt(style.lineHeight) || 20;
      const paddingTop = parseInt(style.paddingTop) || 0;
      const paddingLeft = parseInt(style.paddingLeft) || 0;
      
      // Estimate cursor position
      const textBeforeCursor = text.substring(0, clickPosition);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines.length - 1;
      const currentColumn = lines[lines.length - 1].length;
      
      // Approximate position
      const x = rect.left + paddingLeft + (currentColumn * 8);
      const y = rect.top + paddingTop + (currentLine * lineHeight) - 120;
      
      setPopupPosition({
        x: Math.min(x, window.innerWidth - 300),
        y: Math.max(y, 10)
      });
    }
  };

  // Handle keyboard input
  const handleKeyboardKeyPress = (char) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + char + text.substring(end);
    
    onTextChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  // Handle special keyboard actions
  const handleKeyboardAction = (action) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    if (action === 'Backspace') {
      const start = textarea.selectionStart;
      if (start > 0) {
        const newText = text.substring(0, start - 1) + text.substring(start);
        onTextChange(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - 1, start - 1);
        }, 0);
      }
    } else if (action === 'Enter') {
      const start = textarea.selectionStart;
      const newText = text.substring(0, start) + '\n' + text.substring(textarea.selectionEnd);
      onTextChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, start + 1);
      }, 0);
    }
  };

  // Navigate to next low confidence word
  const navigateToNextConfusion = () => {
    if (sortedConfusions.length === 0) return;
    
    const currentPos = textAreaRef.current?.selectionStart || 0;
    const nextConfusion = sortedConfusions.find(c => {
      const start = c.wordStart !== undefined ? c.wordStart : c.position;
      return start > currentPos;
    }) || sortedConfusions[0]; // Wrap around to first
    
    if (nextConfusion) {
      const start = nextConfusion.wordStart !== undefined ? nextConfusion.wordStart : nextConfusion.position;
      const end = nextConfusion.wordEnd !== undefined ? nextConfusion.wordEnd : nextConfusion.position + 1;
      
      textAreaRef.current?.focus();
      textAreaRef.current?.setSelectionRange(start, end);
      setSelectedConfusion(nextConfusion);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) &&
          !textAreaRef.current.contains(event.target)) {
        setSelectedConfusion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="transcription-viewer">
      <div className="viewer-header">
        <div>
          <h3>Interactive Correction</h3>
          <p className="instruction">
            {confusions.length > 0 
              ? `Click on highlighted text (low confidence) to see details. ${confusions.length} word(s) need attention.`
              : 'All words have high confidence. No corrections needed.'}
          </p>
        </div>
        <button
          className="keyboard-toggle-btn"
          onClick={() => setShowKeyboard(!showKeyboard)}
          title="Toggle Kannada Keyboard"
        >
          {showKeyboard ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard'}
        </button>
      </div>

      <div className="text-editor-container">
        <textarea
          ref={textAreaRef}
          className={`text-editor kannada-text ${confusions.length > 0 ? 'has-confusions' : ''}`}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onClick={handleTextClick}
          onKeyUp={handleTextClick}
          placeholder="Transcribed text will appear here..."
          rows={10}
        />
      </div>

      {/* Confusion count and navigation */}
      {confusions.length > 0 && (
        <div className="confusion-stats">
          <span className="confusion-count">
            ⚠️ {confusions.length} word(s) with low confidence detected (confidence &lt; 80%)
          </span>
          <button 
            className="navigate-confusion-btn"
            onClick={navigateToNextConfusion}
          >
            Navigate to Next Low Confidence Word →
          </button>
        </div>
      )}

      {/* Popup for low confidence word details */}
      {selectedConfusion && (
        <div
          ref={popupRef}
          className="confusion-popup"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`
          }}
        >
          <div className="popup-header">
            <span>Low Confidence Word</span>
            <button
              className="popup-close"
              onClick={() => setSelectedConfusion(null)}
            >
              ×
            </button>
          </div>
          <div className="popup-content">
            <div className="current-char">
              Word: <strong className="kannada-text">{selectedConfusion.word || selectedConfusion.char}</strong>
            </div>
            <div className="confidence-info">
              Confidence: <strong>{(selectedConfusion.confidence * 100).toFixed(0)}%</strong>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${selectedConfusion.confidence * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="popup-hint">
              💡 Use the Kannada keyboard to correct this word if needed.
            </div>
          </div>
        </div>
      )}

      {/* Kannada Keyboard */}
      {showKeyboard && (
        <KannadaKeyboard
          onKeyPress={handleKeyboardKeyPress}
          onAction={handleKeyboardAction}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  );
};

export default TranscriptionViewer;
