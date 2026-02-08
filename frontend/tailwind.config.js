/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#e3e8ee",
          200: "#c6d0dc",
          300: "#a2b1c4",
          400: "#7b8ea6",
          500: "#5f738a",
          600: "#4a5a70",
          700: "#3a485a",
          800: "#2c3745",
          900: "#1f2732"
        },
        accent: {
          100: "#f3f1ff",
          200: "#d9d3ff",
          300: "#b8afff",
          400: "#8b7dff",
          500: "#6b4bff",
          600: "#5636db"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 6px 18px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
