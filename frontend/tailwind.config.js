/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
extend: {
colors: {
brand: {
50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
  },
},
boxShadow: {
soft: '0 2px 8px rgba(15, 23, 42, 0.08)',
  card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  animation: {
'fade-in': 'fadeIn 0.5s ease-out',
  },
  keyframes: {
fadeIn: {
'0%': { opacity: '0', transform: 'translateY(6px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' },
      },
},
  },
},
plugins: [],
  };
