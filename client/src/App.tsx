import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Componentes globales
import Header from "@/components/Header";
import Menu from "@/components/Menu";

// 🧱 Pages principales
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";
import DeliveryPage from "@/pages/DeliveryPage";
import OrderStatus from "@/pages/OrderStatus";

export default function App() {
  return (
    <Router>
      {/* 🧭 Encabezado fijo */}
      <Header />

      {/* 📍 Rutas principales */}
      <div className="pt-20"> {/* deja espacio bajo el header fijo */}
        <Routes>
          {/* 🏠 Página principal: Menú */}
          <Route path="/" element={<Menu />} />

          {/* ☕ Página de orden (cliente) */}
          <Route path="/order" element={<OrderPage />} />

          {/* 🎉 Confirmación post-orden */}
          <Route path="/thank-you" element={<ThankYou />} />

          {/* 📦 Panel del barista (admin) */}
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* 🚚 Panel del repartidor */}
          <Route path="/delivery" element={<DeliveryPage />} />

          {/* 🔍 Estado de la orden (cliente) */}
          <Route path="/status" element={<OrderStatus />} />

          {/* 🧭 Ruta por defecto (redirige a menú) */}
          <Route path="*" element={<Menu />} />
        </Routes
