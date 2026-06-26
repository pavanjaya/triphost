import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1a2744", deep: "#0d1b2a" },
        primary: "#2563eb",
        warm: "#f97316",
        bg: "#f7f7f5",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Rounded", "SF Pro Display", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        "card-md": "0 4px 20px rgba(0,0,0,0.09)",
        "card-lg": "0 8px 32px rgba(0,0,0,0.11)",
      },
      borderRadius: {
        "4xl": "28px",
        "5xl": "36px",
      },
    },
  },
  plugins: [],
};
export default config;
