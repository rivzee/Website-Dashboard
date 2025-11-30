/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',      // Lokasi baru App Router
    './src/client/**/*.{js,ts,jsx,tsx,mdx}',   // Lokasi components & utils
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}