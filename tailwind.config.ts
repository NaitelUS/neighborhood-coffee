import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        pulseOnce: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "50%": { opacity: 1, transform: "scale(1.05)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        pulseOnce: "pulseOnce 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
     
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
      },
      keyframes: {
        "fade-in-out": {
          "0%, 100%": { opacity: 0, transform: "translateY(20px)" },
          "10%, 90%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-out": "fade-in-out 2.5s ease-in-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
