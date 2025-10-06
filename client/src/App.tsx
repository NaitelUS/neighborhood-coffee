import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🧩 Páginas principales
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import OrderStatus from "./pages/OrderStatus";
import AdminPanel from "./pages/AdminPanel";
import DeliveryPage from "./pages/DeliveryPage";

// 🧠 Contexto global del carrito
import { CartProvider } from "@/context/CartContext";

// 🎨 Estilos globales (Tailwind)
import "./index.css";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* ☕ Página principal (menú) */}
          <Route path="/" element={<Menu />} />

          {/* 🧾 Resumen y envío de orden */}
          <Route path="/order" element={<OrderPage />} />

          {/* ✅ Confirmación de pedido (usa ?id=) */}
          <Route path="/thank-you" element={<ThankYou />} />

          {/* 🔍 Seguimiento de pedido (usa ?id=) */}
          <Route path="/status" element={<OrderStatus />} />

          {/* 🧑‍🍳 Panel del barista/admin */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* 🚚 Panel del repartidor */}
          <Route path="/delivery" element={<DeliveryPage />} />

          {/* 🚫 Fallback (opcional) */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-3xl font-bold text-gray-700 mb-3">
                  Page not found
                </h1>
                <a
                  href="/"
                  className="text-[#1D9099] hover:text-[#00454E] underline"
                >
                  Go back to home
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
