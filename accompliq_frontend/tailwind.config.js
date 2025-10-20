/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src folder
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
