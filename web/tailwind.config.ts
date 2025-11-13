// ABOUTME: Tailwind CSS configuration with dark theme support
// ABOUTME: Includes custom colors for political parties and Costa Rica theme

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'system-ui',
          '"Segoe UI"',
          'Helvetica',
          '"Apple Color Emoji"',
          'Arial',
          'sans-serif',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      colors: {
        // Primary brand colors (inspired by Costa Rican icon)
        primary: {
          DEFAULT: '#FF8C42', // Vibrant orange from icon
          50: '#FFF4ED',
          100: '#FFE8D6',
          200: '#FFCEAD',
          300: '#FFB384',
          400: '#FF975B',
          500: '#FF8C42', // Main orange
          600: '#FF7200',
          700: '#CC5C00',
          800: '#994500',
          900: '#662E00',
        },
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
