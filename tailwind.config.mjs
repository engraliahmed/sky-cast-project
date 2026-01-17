/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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