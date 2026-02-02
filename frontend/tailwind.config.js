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
        /* 🎨 Couleurs principales */
        primary: {
          DEFAULT: "#FF8A00", // Orange DeliceDelice
          foreground: "#FFFFFF",
        },

        secondary: {
          DEFAULT: "#1F2937", // Dark gray / presque noir
          foreground: "#FFFFFF",
        },

        accent: {
          DEFAULT: "#FACC15", // jaune doux
          foreground: "#111827",
        },

        background: "#FFFFFF",
        foreground: "#111827",

        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },

        border: "#E5E7EB",
      },

      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },

  plugins: [],
};