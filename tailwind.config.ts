/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🌟 Animación de "pulseOnce" con leve flash verde
      keyframes: {
        pulseOnce: {
          "0%": {
            opacity: 0,
            transform: "scale(0.95)",
            color: "hsl(140, 70%, 40%)",
          },
          "50%": {
            opacity: 1,
            transform: "scale(1.08)",
            color: "hsl(140, 80%, 55%)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
            color: "hsl(142, 76%, 36%)",
          },
        },
      },
      animation: {
        pulseOnce: "pulseOnce 1s ease-out forwards",
      },

      // 🎨 Paleta base del tema + colores personalizados
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",

        // ✅ Colores del tema corporativo
        primary: "#1D9099",
        primaryHover: "#00454E",
      },
    },
  },
  plugins: [],
};
