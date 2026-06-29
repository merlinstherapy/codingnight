import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: "#1f7a6d",
          light: "#34d0bb",
          dark: "#155e54",
          bg: "#e7f1ef",
        },
        navy: { DEFAULT: "#123a4f", dark: "#11161a" },
        warm: { accent: "#d2774e", dark: "#c2693f", bg: "#f7ebe2" },
        sand: { DEFAULT: "#e9e7e1", light: "#f6f5f2", border: "#ece9e2" },
        ink: { DEFAULT: "#21201d", mid: "#6f6a63", muted: "#9a958c" },
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        body: ["Hanken Grotesk", "sans-serif"],
        mono: ["ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: { phone: "48px" },
      boxShadow: {
        phone: "0 34px 60px -22px rgba(20,30,40,.4), 0 12px 26px -14px rgba(20,30,40,.3)",
      },
    },
  },
  plugins: [],
};

export default config;
