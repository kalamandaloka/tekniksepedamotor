/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nalar: {
          dark: '#0f172a',
          primary: '#0ea5e9',
          accent: '#38bdf8',
          text: '#e2e8f0',
          panel: 'rgba(15, 23, 42, 0.8)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
