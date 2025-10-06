import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import AdminOrders from "./pages/AdminOrders";
import AdminPanel from "./pages/AdminPanel";
import DeliveryPage from "./pages/DeliveryPage";
import OrderStatus from "./pages/OrderStatus";

import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {/* 🧠 Header global */}
          <Header />

          {/* 📦 Contenido dinámico por ruta */}
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/status" element={<OrderStatus />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/delivery" element={<DeliveryPage />} />

            {/* 🧭 Fallback: si ruta no existe */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20 text-gray-500 text-lg">
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
