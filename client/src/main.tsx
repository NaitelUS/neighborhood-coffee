import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "@/context/CartContext"; // ✅ importa el provider

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ✅ Envolvemos toda la app con el CartProvider */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

// ✅ Registro del Service Worker para habilitar PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "✅ Service Worker registrado correctamente con scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("❌ Error al registrar el Service Worker:", error);
      });
  });
}
