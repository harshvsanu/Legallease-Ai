/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f5ff',
          100: '#e0ebfe',
          200: '#bdd5fd',
          700: '#1d3fb2',
          800: '#1c348f',
          900: '#1e3073',
          950: '#172554', // Official Midnight Navy
        },
        indigo: {
          500: '#6366F1', // Primary Indigo
          600: '#4F46E5',
          700: '#4338CA',
        },
        lavender: {
          50: '#EEF2FF', // Soft Lavender
          100: '#E0E7FF',
          200: '#C7D2FE',
        },
        canvas: {
          light: '#F8FAFC', // Cool Canvas
          dark: '#0F172A',
        },
        teal: {
          600: '#0F766E', // Legal Teal
          700: '#115E59',
        },
        caution: {
          bg: '#FEF3C7',
          border: '#FCD34D',
          text: '#B45309',
          amber: '#F59E0B',
        },
        danger: {
          bg: '#FEE2E2',
          border: '#FCA5A5',
          text: '#B91C1C',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
        'inner-matte': 'inset 0 1px 2px rgba(255, 255, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
