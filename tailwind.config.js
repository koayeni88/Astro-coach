/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface system
        surface: {
          DEFAULT: "rgba(15, 10, 30, 1)",
          raised: "rgba(22, 15, 45, 0.80)",
          overlay: "rgba(30, 20, 60, 0.65)",
          glass: "rgba(40, 28, 80, 0.35)",
        },
        // Borders
        border: {
          DEFAULT: "rgba(139, 92, 246, 0.15)",
          subtle: "rgba(139, 92, 246, 0.08)",
          accent: "rgba(139, 92, 246, 0.30)",
        },
        // Accent
        accent: {
          DEFAULT: "#a78bfa",
          dim: "#7c3aed",
          bright: "#c4b5fd",
          glow: "rgba(167, 139, 250, 0.40)",
        },
        // Semantic
        cosmic: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        astro: {
          gold: "#fbbf24",
          rose: "#fb7185",
          teal: "#2dd4bf",
          blue: "#60a5fa",
        },
        // Text
        txt: {
          DEFAULT: "rgba(255, 255, 255, 0.92)",
          secondary: "rgba(196, 181, 253, 0.78)",
          muted: "rgba(167, 139, 250, 0.64)",
          dim: "rgba(167, 139, 250, 0.46)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.25), 0 0 60px rgba(139, 92, 246, 0.10)",
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.20)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.20)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.25)",
        card: "0 4px 24px rgba(0, 0, 0, 0.20), 0 0 0 1px rgba(139, 92, 246, 0.08)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      backgroundImage: {
        "aurora-subtle":
          "radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(45, 212, 191, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(251, 191, 36, 0.04) 0%, transparent 50%)",
        "nebula-card":
          "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.10) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
