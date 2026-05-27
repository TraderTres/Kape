import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          50:  "#fdf8f3",
          100: "#faeee0",
          200: "#f3d9bc",
          300: "#e8be8e",
          400: "#d99a5e",
          500: "#cc7f3a",
          600: "#be6a2c",
          700: "#9e5426",
          800: "#7e4425",
          900: "#78350F",
          950: "#451A03",
        },
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        cream: "#FEF3C7",
      },
      fontFamily: {
        heading: ["var(--font-fira-code)", "monospace"],
        body: ["var(--font-fira-sans)", "sans-serif"],
        sans: ["var(--font-fira-sans)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      backgroundImage: {
        "espresso-gradient": "linear-gradient(135deg, #451A03 0%, #78350F 50%, #92400E 100%)",
        "gold-gradient": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
        "cream-gradient": "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)",
      },
      animation: {
        "points-pop": "pointsPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "quest-complete": "questComplete 0.5s ease forwards",
        "progress-fill": "progressFill 1.2s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        pointsPop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        questComplete: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.6", filter: "grayscale(50%)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "espresso": "0 4px 24px rgba(120, 53, 15, 0.25)",
        "gold": "0 4px 24px rgba(251, 191, 36, 0.35)",
        "card": "0 2px 12px rgba(69, 26, 3, 0.08)",
        "card-hover": "0 8px 32px rgba(69, 26, 3, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
