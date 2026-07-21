import type { Config } from "tailwindcss";

// Colors are CSS custom properties (defined in app/globals.css, swapped via
// [data-theme="light"|"dark"]) rather than fixed hex values, so the same
// Tailwind classes (bg-surface, text-primary, etc.) work in both themes.
// See ThemeProvider for how the toggle actually flips data-theme.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        nav: "var(--nav)",
        surface: "var(--card)",
        surface2: "var(--card2)",
        border: "var(--border)",
        border2: "var(--border2)",
        gold: "var(--gold)",
        gold2: "var(--gold2)",
        primary: "var(--blue)",
        primary2: "var(--blue2)",
        accent: "var(--green)",
        danger: "var(--red)",
        warning: "var(--yellow)",
        purple: "var(--purple)",
        foreground: "var(--text)",
        foreground2: "var(--text2)",
        muted: "var(--muted)",
        cyan: "var(--cyan)",
        cyan2: "var(--cyan2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
      },
      fontWeight: {
        heading: "700",
        body: "500",
        button: "600",
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 12px 32px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
