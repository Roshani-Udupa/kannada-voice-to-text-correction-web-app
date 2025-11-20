import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Transcribe audio
export const transcribeAudio = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for long audio files
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Transcription failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check if the server is running.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  }
};

// Export document
export const exportDocument = async (modelText, correctedText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/export`,
      { modelText, correctedText },
      {
        responseType: 'blob',
        timeout: 60000,
      }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kannada-transcription.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Export failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check if the server is running.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  }
};

