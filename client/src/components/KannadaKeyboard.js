import React, { useState } from 'react';
import './KannadaKeyboard.css';

const KannadaKeyboard = ({ onKeyPress, onAction, onClose }) => {
  const [currentLayout, setCurrentLayout] = useState('vowels'); // vowels, consonants, numbers

  // Kannada vowels
  const vowels = [
    ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ'],
    ['ಒ', 'ಓ', 'ಔ', 'ಂ', 'ಃ']
  ];

  // Kannada consonants
  const consonants = [
    ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ'],
    ['ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ'],
    ['ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ'],
    ['ತ', 'ಥ', 'ದ', 'ಧ', 'ನ'],
    ['ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ'],
    ['ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ'],
    ['ಷ', 'ಸ', 'ಹ', 'ಳ', 'ಱ']
  ];

  // Numbers and special characters
  const numbers = [
    ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
    ['.', ',', ';', ':', '?', '!', '-', '್', 'ಂ', 'ಃ']
  ];

  // Common words/shortcuts
  const commonWords = [
    'ನಮಸ್ಕಾರ', 'ಧನ್ಯವಾದ', 'ಸ್ವಾಗತ', 'ಕ್ಷಮಿಸಿ', 'ಹೌದು', 'ಇಲ್ಲ'
  ];

  const handleKeyClick = (char) => {
    onKeyPress(char);
  };

  const handleWordClick = (word) => {
    onKeyPress(word);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case 'vowels':
        return (
          <div className="keyboard-layout">
            {vowels.map((row, rowIdx) => (
              <div key={rowIdx} className="keyboard-row">
                {row.map((char, idx) => (
                  <button
                    key={idx}
                    className="keyboard-key kannada-text"
                    onClick={() => handleKeyClick(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      case 'consonants':
        return (
          <div className="keyboard-layout">
            {consonants.map((row, rowIdx) => (
              <div key={rowIdx} className="keyboard-row">
                {row.map((char, idx) => (
                  <button
                    key={idx}
                    className="keyboard-key kannada-text"
                    onClick={() => handleKeyClick(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      case 'numbers':
        return (
          <div className="keyboard-layout">
            {numbers.map((row, rowIdx) => (
              <div key={rowIdx} className="keyboard-row">
                {row.map((char, idx) => (
                  <button
                    key={idx}
                    className="keyboard-key kannada-text"
                    onClick={() => handleKeyClick(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="kannada-keyboard">
      <div className="keyboard-header">
        <div className="keyboard-tabs">
          <button
            className={`tab-btn ${currentLayout === 'vowels' ? 'active' : ''}`}
            onClick={() => setCurrentLayout('vowels')}
          >
            Vowels (ಸ್ವರ)
          </button>
          <button
            className={`tab-btn ${currentLayout === 'consonants' ? 'active' : ''}`}
            onClick={() => setCurrentLayout('consonants')}
          >
            Consonants (ವ್ಯಂಜನ)
          </button>
          <button
            className={`tab-btn ${currentLayout === 'numbers' ? 'active' : ''}`}
            onClick={() => setCurrentLayout('numbers')}
          >
            Numbers (ಸಂಖ್ಯೆ)
          </button>
        </div>
        <button className="keyboard-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="keyboard-content">
        {renderLayout()}
      </div>

      <div className="keyboard-common-words">
        <div className="common-words-label">Common Words:</div>
        <div className="common-words-list">
          {commonWords.map((word, idx) => (
            <button
              key={idx}
              className="common-word-btn kannada-text"
              onClick={() => handleWordClick(word + ' ')}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-actions">
        <button className="action-btn" onClick={() => handleKeyClick(' ')}>
          Space
        </button>
        <button className="action-btn" onClick={() => onAction ? onAction('Backspace') : handleKeyClick('\b')}>
          Backspace
        </button>
        <button className="action-btn" onClick={() => onAction ? onAction('Enter') : handleKeyClick('\n')}>
          Enter
        </button>
      </div>
    </div>
  );
};

export default KannadaKeyboard;

