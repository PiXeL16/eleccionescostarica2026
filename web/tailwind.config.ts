// ABOUTME: Tailwind CSS configuration with dark theme support
// ABOUTME: Includes custom colors for political parties and Costa Rica theme

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Party colors (placeholders for now)
        pln: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5C',
          dark: '#E55528',
        },
        pusc: {
          DEFAULT: '#004AAD',
          light: '#3273BD',
          dark: '#003580',
        },
        fa: {
          DEFAULT: '#DC143C',
          light: '#E94057',
          dark: '#B31032',
        },
        pac: {
          DEFAULT: '#FFD700',
          light: '#FFE033',
          dark: '#CCAC00',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
