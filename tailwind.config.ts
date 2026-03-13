import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        "lana-purple": "#5b21ff",
        "lana-purple-dark": "#1a1033",
        "lana-accent": "#f97316",
        "lana-accent-soft": "#7c2cff"
      },
      fontFamily: {
        display: ["system-ui", "sans-serif"],
        body: ["system-ui", "sans-serif"]
      },
      boxShadow: {
        "glow-purple": "0 0 30px rgba(91, 33, 255, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;

