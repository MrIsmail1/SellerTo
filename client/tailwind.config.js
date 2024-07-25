const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "320px",
      },
      colors: {
        "primary-100": "#c21d03",
        "primary-200": "#fd5732",
        "primary-300": "#ffb787",
        "accent-100": "#393939",
        "accent-200": "#bebebe",
        "text-100": "#232121",
        "text-200": "#4b4848",
        "bg-100": "#fbfbfb",
        "bg-200": "#f1f1f1",
        "bg-300": "#c8c8c8",
      },
      fontSize: {
        xl: "26px",
        lg: "20px",
        md: "16px",
        sm: "14px",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      fontWeight: {
        bold: "700",
        medium: "500",
        regular: "400",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
