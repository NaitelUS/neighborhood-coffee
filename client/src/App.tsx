import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Contexto global del carrito
import { CartProvider } from "@/context/CartContext";

// 🧱 Componentes globales
import Header from "@/components/Header";
import Menu from "@/components/Menu";

// 🧱 Pages
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";
import DeliveryPage from "@/pages/DeliveryPage";
import OrderStatus from "@/pages/OrderStatus";

export default function App() {
  return (
    <CartProvider>
      <Router>
        {/* 🧭 Encabezado fijo */}
        <Header />

        {/* 🧭 Contenedor principal */}
        <div className="pt-20">
          <Routes>
            {/* 🏠 Página principal: Menú */}
            <Route path="/" element={<Menu />} />

            {/* ☕ Pedido del cliente */}
            <Route path="/order" element={<OrderPage />} />

            {/* 🎉 Confirmación */}
            <Route path="/thank-you" element={<ThankYou />} />

            {/* 📦 Panel del barista */}
            <Route path="/admin/orders" element={<AdminOrders />} />

            {/* 🚚 Panel del repartidor */}
            <Route path="/delivery" element={<DeliveryPage />} />

            {/* 🔍 Seguimiento del cliente */}
            <Route path="/status" element={<OrderStatus />} />

            {/* 🚦 Fallback: redirige al menú */}
            <Route path="*" element={<Menu />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}
