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

// 🧠 Contexto global del carrito
import { CartProvider } from "./context/CartContext";

// 🍂 Splash Screen Promocional
import SplashScreen from "./components/SplashScreen";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 relative">
          {/* 🍂 Splash Screen visible una sola vez por sesión */}
          <SplashScreen />

          {/* 🌐 Header visible en todas las páginas */}
          <Header />

          <Routes>
            {/* 🏠 Menú principal */}
            <Route path="/" element={<Menu />} />

            {/* 🛒 Página de orden */}
            <Route path="/order" element={<OrderPage />} />

            {/* ✅ Confirmación de orden */}
            <Route path="/thank-you" element={<ThankYou />} />

            {/* 🔍 Estado de orden */}
            <Route path="/status" element={<OrderStatus />} />

            {/* 🧑‍🍳 Panel de administración */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/orders" element={<AdminOrders />} />

            {/* 🚚 Página del repartidor */}
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
