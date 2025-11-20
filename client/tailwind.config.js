/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        lightAzure: {
          primary: '#0ea5e9',
          'primary-content': '#f8feff',
          secondary: '#2dd4bf',
          'secondary-content': '#042f2e',
          accent: '#67e8f9',
          'accent-content': '#083344',
          neutral: '#0f172a',
          'neutral-content': '#f0f3ff',
          'base-100': '#fdfefe',
          'base-200': '#eef7fb',
          'base-300': '#dbeff7',
          info: '#2563eb',
          success: '#16a34a',
          warning: '#f97316',
          error: '#ef4444',
        },
      },
    ],
  },
};

