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
