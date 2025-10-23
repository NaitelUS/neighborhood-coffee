import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
// 🧩 Componentes principales
import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import OrderStatus from "./pages/OrderStatus";
import AdminPanel from "./pages/AdminPanel";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";
import FloatingCart from "./components/FloatingCart";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";

// 🧠 Contexto global del carrito
import { CartProvider } from "./context/CartContext";

// 📜 Páginas legales
import TermsOfService from "./pages/TermsofService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export default function App() {
  return (
    <Router>
      <CartProvider>
        {/* 🏠 Estructura principal */}
        <div className="min-h-screen bg-white flex flex-col justify-between">
          {/* 🌐 Header fijo */}
          <Header />

          {/* 🛒 y 💬 botones flotantes */}
          <FloatingCart />
          <WhatsAppButton />

          {/* 🔀 Rutas principales */}
           <main className="flex-grow">   {/* antes tenía pt-[64px] */}
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/status" element={<OrderStatus />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/delivery" element={<DeliveryPage />} />

              {/* ⚖️ Legal pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

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
          </main>

          {/* ☕️ Footer */}
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}
