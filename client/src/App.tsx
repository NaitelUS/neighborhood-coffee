import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Menu from "@/components/Menu"; // ✅ Página principal: productos
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import AdminOrders from "@/pages/AdminOrders";
import AdminPanel from "@/pages/AdminPanel";
import AdminProducts from "@/pages/AdminProducts";
import { CartProvider } from "@/context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* ✅ Header visible en todas las páginas */}
          <Header />

          {/* ✅ Contenido principal */}
          <main className="flex-1 px-4 sm:px-8 py-6">
            <Routes>
              {/* 🏠 Menú principal (productos) */}
              <Route path="/" element={<Menu />} />

              {/* 🧾 Orden y forma del cliente */}
              <Route path="/order" element={<OrderPage />} />

              {/* ✅ Página de confirmación */}
              <Route path="/thank-you/:orderId" element={<ThankYou />} />

              {/* ⭐ Feedback */}
              <Route path="/feedback" element={<Feedback />} />

              {/* 🧠 Panel administrativo */}
              <Route path="/admin" element={<AdminOrders />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route
                path="/admin-panel/products"
                element={<AdminProducts />}
              />

              {/* ❌ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
