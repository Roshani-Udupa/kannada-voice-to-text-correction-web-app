import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import './ExportButton.css';

const ExportButton = ({ onExport }) => {
  return (
    <div className="export-section">
      <p className="export-description">
        Download the transcription with both model-generated and corrected text as a single TXT report.
      </p>
      <div className="export-buttons">
        <button
          className="app-btn app-btn-export"
          onClick={onExport}
        >
          <FaFileAlt /> Download TXT Report
        </button>
      </div>
    </div>
  );
};

export default ExportButton;

