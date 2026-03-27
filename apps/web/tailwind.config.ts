import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1b1e",
        mist: "#eef6f2",
        mint: "#9fe3c3",
        teal: "#1d7f74",
        coral: "#ff7a59",
        slate: "#3d4f58"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(29, 127, 116, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
