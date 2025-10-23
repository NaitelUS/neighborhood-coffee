import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Componentes principales
import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import OrderStatus from "./pages/OrderStatus";
import AdminPanel from "./pages/AdminPanel";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";
import FloatingCart from "./components/FloatingCart"; // 🛒 Nuevo carrito flotante

// 🧠 Contexto global del carrito
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <Router>
      <CartProvider>
        {/* 🏠 Estructura principal */}
        <div className="min-h-screen bg-gray-50">
          {/* 🌐 Header visible en todas las páginas */}
          <Header />

          {/* 🛒 Carrito flotante (solo en /, /menu, /order) */}
          <FloatingCart />

          {/* 🔀 Rutas principales */}
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/status" element={<OrderStatus />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/delivery" element={<DeliveryPage />} />

            {/* ⚠️ Página no encontrada */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20 text-gray-600 text-lg">
                  Page not found
                </div>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}
