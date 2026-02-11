/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./config/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007A7A",
          hover: "#006666",
        },
        secondary: "#002D36",
        contactCard: "#053B45",
        accent: "#FFB800",
        darkText: "rgb(26, 26, 26)",
        bodyText: "rgb(74, 74, 74)",
        mutedText: "#BDC3C7",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
