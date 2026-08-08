/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // RentFlow brand palette — do not change without updating the logo too
        brand: {
          text: "#1e1e1e", // primary text / wordmark
          accent: "#9d5977", // strip / CTA / highlight color
          white: "#ffffff", // canvas
          accentSoft: "#f4e9ee", // tinted accent for backgrounds/badges
          accentDark: "#7c4560", // hover state for accent
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(30,30,30,0.06)",
        card: "0 1px 3px rgba(30,30,30,0.08), 0 8px 24px rgba(30,30,30,0.05)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
