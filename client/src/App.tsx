import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";
import AdminPanel from "@/pages/AdminPanel";
import AdminProducts from "@/pages/AdminProducts";
import BaristaPanel from "@/pages/BaristaPanel"; // 👈 Asegúrate de tener esta línea
import { CartProvider } from "@/context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Header solo en páginas públicas */}
          <Header />

          <main className="flex-1 bg-gray-50">
            <Routes>
              {/* Página principal */}
              <Route path="/" element={<OrderPage />} />
              <Route path="/order" element={<OrderPage />} />

              {/* Confirmación de orden */}
              <Route path="/thank-you/:orderId" element={<ThankYou />} />

              {/* Feedback del cliente */}
              <Route path="/feedback" element={<Feedback />} />

              {/* Panel admin general */}
              <Route path="/admin" element={<AdminOrders />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/admin-panel/products" element={<AdminProducts />} />

              {/* Panel del Barista (nuevo) */}
              <Route path="/barista" element={<BaristaPanel />} />

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
