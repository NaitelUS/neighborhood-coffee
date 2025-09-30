/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // asegúrate de incluir todos tus archivos React
  ],
  theme: {
    extend: {
      // 🔹 Animación personalizada para aplicar cupón (una sola vez)
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

      // 🔹 Paleta base desde variables CSS (usada en theme)
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};
