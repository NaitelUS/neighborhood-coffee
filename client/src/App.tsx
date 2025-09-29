// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header visible en todas las páginas */}
        <Header />

        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<OrderPage />} />
            <Route path="/order" element={<OrderPage />} />

            {/* Página de confirmación */}
            <Route path="/thank-you/:orderId" element={<ThankYou />} />

            {/* Página de feedback */}
            <Route path="/feedback" element={<Feedback />} />

            {/* Página admin */}
            <Route path="/admin" element={<AdminOrders />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
