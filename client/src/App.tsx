import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import OrderPage from "@/pages/OrderPage";
import OrderSummary from "@/components/OrderSummary";
import ThankYou from "@/pages/ThankYou";
import AdminPanel from "@/pages/AdminPanel";
import AdminOrders from "@/pages/AdminOrders";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* 🧭 Header fijo */}
          <Header />

          {/* 📦 Rutas principales */}
          <main className="flex-1">
            <Routes>
              {/* 🌟 Menú principal */}
              <Route path="/" element={<OrderPage />} />

              {/* 🛒 Checkout (carrito + forma cliente) */}
              <Route path="/order" element={<OrderSummary />} />

              {/* ✅ Gracias / Confirmación */}
              <Route path="/thank-you/:orderId" element={<ThankYou />} />

              {/* ⭐ Feedback del cliente */}
              <Route path="/feedback" element={<Feedback />} />

              {/* 🔐 Panel administrativo */}
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/admin-panel/orders" element={<AdminOrders />} />

              {/* 🚫 Página no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
