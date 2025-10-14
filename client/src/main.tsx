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
  // 🔥 Esto borra cualquier Service Worker viejo que esté registrado
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let reg of registrations) {
      reg.unregister();
    }
  });
}
