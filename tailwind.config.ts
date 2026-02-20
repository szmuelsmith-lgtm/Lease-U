import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      colors: {
        bg_left: "#D7DFD5",
        bg_right: "#EEF2EE",
        text_primary: "#0B0F1A",
        text_muted: "rgba(11,15,26,0.55)",
        surface_card: "#FFFFFF",
        border_soft: "rgba(11,15,26,0.10)",
        accent: "#2F7D62",
        accent_soft: "rgba(47,125,98,0.16)",
        border: "rgba(11,15,26,0.10)",
        input: "rgba(11,15,26,0.10)",
        ring: "#2F7D62",
        background: "#FFFFFF",
        foreground: "#0B0F1A",
        primary: {
          DEFAULT: "#2F7D62",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#EEF2EE",
          foreground: "#0B0F1A",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(11,15,26,0.55)",
          foreground: "#0B0F1A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B0F1A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B0F1A",
        },
      },
      borderRadius: {
        lg: "14px",
        md: "calc(14px - 2px)",
        sm: "calc(14px - 4px)",
        pill: "999px",
      },
      boxShadow: {
        card: "0 10px 26px rgba(0,0,0,0.08)",
        input: "0 8px 20px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
