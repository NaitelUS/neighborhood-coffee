// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Menu from "@/components/Menu"; // ✅ Se agregó el menú principal
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import AdminPanel from "@/pages/AdminPanel";
import AdminProducts from "@/pages/AdminProducts";
import { CartProvider } from "@/context/CartContext"; // ✅ Provider global del carrito

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* ✅ Header fijo en todas las páginas */}
          <Header />

          <main className="flex-1 bg-gray-50">
            <Routes>
              <Route path="/barista" element={<BaristaPanel />} />
              
              {/* ✅ Menú principal con productos */}
              <Route path="/" element={<Menu />} />

              {/* 🧾 Página de pedido y checkout */}
              <Route path="/order" element={<OrderPage />} />

              {/* ✅ Confirmación de pedido */}
              <Route path="/thank-you/:orderId" element={<ThankYou />} />

              {/* ⭐ Feedback del cliente */}
              <Route path="/feedback" element={<Feedback />} />

              {/* ⚙️ Panel de administración */}
              <Route path="/admin" element={<AdminOrders />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/admin-panel/products" element={<AdminProducts />} />

              {/* 🚫 Página no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
