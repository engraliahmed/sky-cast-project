/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.03)",
        borderWhite: "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        'dashboard-bg': "linear-gradient(to bottom right, #020617, #0f172a, #1e293b)",
      }
    },
  },
  plugins: [],
};