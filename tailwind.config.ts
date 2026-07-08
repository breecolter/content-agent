import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F9F7",
        terracotta: "#7A9E7E",
        burgundy: "#4A6B5A",
        "warm-gray": "#7A8C7E",
        "light-tan": "#E8D5D8",
        blush: "#F2C4CE",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
