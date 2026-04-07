/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--app-radius)",
        md: "calc(var(--app-radius) - 2px)",
        sm: "calc(var(--app-radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--app-background))",
        foreground: "hsl(var(--app-foreground))",
        card: {
          DEFAULT: "hsl(var(--app-card))",
          foreground: "hsl(var(--app-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--app-popover))",
          foreground: "hsl(var(--app-popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--app-primary))",
          foreground: "hsl(var(--app-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--app-secondary))",
          foreground: "hsl(var(--app-secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--app-muted))",
          foreground: "hsl(var(--app-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--app-accent))",
          foreground: "hsl(var(--app-accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--app-destructive))",
          foreground: "hsl(var(--app-destructive-foreground))",
        },
        border: "hsl(var(--app-border))",
        input: "hsl(var(--app-input))",
        ring: "hsl(var(--app-ring))",
        chart: {
          1: "hsl(var(--app-chart-1))",
          2: "hsl(var(--app-chart-2))",
          3: "hsl(var(--app-chart-3))",
          4: "hsl(var(--app-chart-4))",
          5: "hsl(var(--app-chart-5))",
        },
      },
    },

    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
