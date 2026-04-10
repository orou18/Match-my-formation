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
        sans: ["Inter", "Space Grotesk", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bounce-out": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      animation: {
        "fade-in": "fadeIn 300ms cubic-bezier(0.4, 0, 0.2)",
        "slide-in": "slideIn 300ms cubic-bezier(0.4, 0, 0.2)",
        "scale-in": "scaleIn 200ms cubic-bezier(0.4, 0, 0.2)",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6) infinite",
      },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};