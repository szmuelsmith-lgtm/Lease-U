import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garnet: "#8B1E3F",
        garnetDark: "#7A1735",
        "garnet-dark": "#7A1735",
        gold: "#C9A227",
        cream: "#F8F9FC",
        background: "#F8F9FC",
        foreground: "#14151A",
        surface: "#FFFFFF",
        "surface-2": "#F3F4F8",
        muted: "#5B606C",
        "text-subtle": "#7B8190",
        border: "#E7E9F0",
        "border-strong": "#D8DBE6",
        "garnet-muted": "rgba(139,30,63,0.12)",
        "primary-100": "#F4E7EC",
        "primary-300": "#C96A86",
        "accent-100": "#FBF4DD",
        "accent-600": "#B28C1F",
        primary: { DEFAULT: "#8B1E3F", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#FFFFFF", foreground: "#8B1E3F" },
        accent: { DEFAULT: "#C9A227", foreground: "#8B1E3F" },
        ring: "rgba(139,30,63,0.35)",
        success: "#1F8A4C",
        warning: "#B7791F",
        danger: "#C2413B",
        info: "#2563EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.05" }],
        "display-md": ["2.5rem", { lineHeight: "1.1" }],
        "display-sm": ["2.25rem", { lineHeight: "1.1" }],
        "section": ["1.75rem", { lineHeight: "1.2" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06)",
        soft: "0 1px 2px rgba(16,24,40,0.06)",
        premium: "0 4px 14px rgba(16,24,40,0.10)",
        premiumHover: "0 10px 30px rgba(16,24,40,0.12)",
        "card-premium": "0 4px 14px rgba(16,24,40,0.10)",
        "card-hover": "0 10px 30px rgba(16,24,40,0.12)",
        elevated: "0 4px 20px rgba(139,30,63,0.12)",
        nav: "0 1px 0 rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.03)",
      },
      transitionDuration: {
        "220": "220ms",
      },
      borderRadius: {
        "radius-xl": "14px",
        "radius-2xl": "18px",
        xl: "14px",
        "2xl": "18px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
