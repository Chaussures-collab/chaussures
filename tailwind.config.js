/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  darkMode: "class",

  theme: {
    /* -----------------------------
       TYPOGRAPHIE
    ------------------------------*/
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      display: ["Poppins", "Inter", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"]
    },

    fontSize: {
      "8xl": [
        "120px",
        { lineHeight: "1", letterSpacing: "-0.06em", fontWeight: "600" }
      ],
      "7xl": [
        "72px",
        { lineHeight: "1.1", letterSpacing: "-0.045em", fontWeight: "600" }
      ],
      "6xl": [
        "56px",
        { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }
      ],
      "5xl": [
        "48px",
        { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "500" }
      ],
      "4xl": [
        "36px",
        { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "500" }
      ],
      "3xl": [
        "28px",
        { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "500" }
      ],
      "2xl": [
        "24px",
        { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "500" }
      ],
      xl: ["20px", { lineHeight: "1.5" }],
      lg: ["18px", { lineHeight: "1.6" }],
      base: ["16px", { lineHeight: "1.6" }],
      sm: ["14px", { lineHeight: "1.5" }],
      xs: ["12px", { lineHeight: "1.4" }],
      sm: ["18px", { lineHeight: "23px" }]
    },

    /* -----------------------------
       COULEURS (DESIGN TOKENS)
    ------------------------------*/
    colors: {
      transparent: "transparent",
      current: "currentColor",

      white: "#FFFFFF",
      black: "#0A0A0A",

      primary: {
        50: "#FFF7E6",
        80: "#FFF3E3",
        100: "#FFE7BF",
        200: "#FFD27A",
        300: "#FFC046",
        400: "#FFB020",
        500: "#B88E2F",
        600: "#9E7826",
        700: "#7C5E1E",
        800: "#5A4416",
        900: "#3A2C0E",
        DEFAULT: "#B88E2F"
      },

      secondary: {
        50: "#EAF8F4",
        100: "#CFF0E6",
        200: "#9EE1CE",
        300: "#6FD1B6",
        400: "#2AB691",
        500: "#22A081",
        600: "#1C8A71",
        700: "#16645A",
        800: "#104E47",
        900: "#0B3A36",
        DEFAULT: "#2AB691"
      },

      gray: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        DEFAULT: "#1D1D1D"
      },

      red: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        200: "#FECACA",
        300: "#FCA5A5",
        400: "#F87171",
        500: "#EF4444",
        600: "#DC2626",
        700: "#B91C1C",
        800: "#991B1B",
        900: "#7F1D1D",
        DEFAULT: "#DC2626"
      },

      success: "#22C55E",
      warning: "#F59E0B",
      danger: "#EF4444",
      info: "#3B82F6"
    },

    /* -----------------------------
       RADIUS (MODERNE / SOFT)
    ------------------------------*/
    borderRadius: {
      none: "0px",
      sm: "6px",
      DEFAULT: "10px",
      md: "14px",
      lg: "18px",
      xl: "24px",
      full: "9999px"
    },

    /* -----------------------------
       SHADOWS MODERNES
    ------------------------------*/
    boxShadow: {
      sm: "0 2px 8px rgba(0,0,0,0.04)",
      DEFAULT: "0 4px 16px rgba(0,0,0,0.06)",
      md: "0 8px 30px rgba(0,0,0,0.08)",
      lg: "0 20px 60px rgba(0,0,0,0.12)",
      glow: "0 0 0 4px rgba(184,142,47,0.15)"
    },

    /* -----------------------------
       BREAKPOINTS
    ------------------------------*/
    screens: {
      xs: "390px",
      sm: "700px",
      md: "768px",
      custom: "900px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },

    /* -----------------------------
       EXTENSIONS
    ------------------------------*/
    extend: {
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem"
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)"
      },

      animation: {
        fade: "fade 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out"
      },

      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      }
    }
  },

  plugins: []
};
