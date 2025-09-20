import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"), // 👈 aquí está tu app
  build: {
    outDir: path.resolve(__dirname, "dist"), // 👈 saldrá en /dist
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
})
