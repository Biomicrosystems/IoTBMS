/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        // Brand Colors
        accent: "#4F46E5",
        dark: "#19191C",
        success: "#E7F8F6",
        sucessText: "#29867F",
        danger: "#EF4444",
        lightText: "#737373",
        darkText: "#898989",
        error: "#FEEBEF",
        errorText: "#C11D45",
        destructive: "#DC2626",

        // light mode
      },

      spacing: {
        "70vh": "70vh",
        "75vw": "75vw",
        "700px": "700px",
        "500px": "500px",
        "10%": "10%",
        "15%": "15%",
        "50vh": "50vh",
      },
    },
    keyframes: {
      openMenu: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
    animation: {
      openMenu: "openMenu 0.2s",
    },
  },

  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
  darkMode: "selector",
};
