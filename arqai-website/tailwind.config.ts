import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors using CSS variables for dark mode support
      colors: {
        // Base colors (swap in dark mode)
        base: {
          DEFAULT: "var(--base)",
          tint: "var(--base-tint)",
          shade: "var(--base-shade)",
          opp: "var(--base-opp)",
          "opp-tint": "var(--base-opp-tint)",
        },
        // Accent colors (swap in dark mode)
        accent: {
          DEFAULT: "var(--accent)",
        },
        additional: {
          DEFAULT: "var(--additional)",
        },
        // Text colors
        text: {
          bright: "var(--text-bright)",
          medium: "var(--text-medium)",
          muted: "var(--text-muted)",
          "muted-extra": "var(--text-muted-extra)",
          "opp-bright": "var(--text-opp-bright)",
          "opp-medium": "var(--text-opp-medium)",
          "opp-muted": "var(--text-opp-muted)",
        },
        // Stroke colors
        stroke: {
          bright: "var(--stroke-bright)",
          medium: "var(--stroke-medium)",
          muted: "var(--stroke-muted)",
          "opp-bright": "var(--stroke-opp-bright)",
        },
      },
      // Typography
      fontFamily: {
        display: ['"Funnel Display"', "sans-serif"],
        sans: ['"Funnel Sans"', "sans-serif"],
      },
      fontSize: {
        // Matching the template sizes
        "display-xl": ["clamp(3rem, 8vw, 8rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "body-lg": ["1.25rem", { lineHeight: "1.6" }],
        "body-md": ["1.125rem", { lineHeight: "1.6" }],
        "body-sm": ["1rem", { lineHeight: "1.6" }],
        "body-xs": ["0.875rem", { lineHeight: "1.5" }],
      },
      // Spacing and sizing
      spacing: {
        "section": "clamp(4rem, 10vw, 8rem)",
        "section-sm": "clamp(2rem, 5vw, 4rem)",
      },
      // Border radius matching template
      borderRadius: {
        "sm": "1rem",
        "md": "1.6rem",
        "lg": "3.8rem",
        "xl": "6rem",
      },
      // Animation
      transitionTimingFunction: {
        "arq": "cubic-bezier(0.23, 0.65, 0.74, 1.09)",
      },
      transitionDuration: {
        "fast": "100ms",
        "medium": "300ms",
        "slow": "600ms",
      },
      // Keyframes for animations
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(4, 50, 165, 0.4)" },
          "50%": { boxShadow: "0 0 20px 10px rgba(4, 50, 165, 0)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "rotate-slow": "rotate 20s linear infinite",
        "rotate-reverse": "rotate 20s linear infinite reverse",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
