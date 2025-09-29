// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus";
import Feedback from "@/pages/Feedback";
import AdminOrders from "@/pages/AdminOrders";
import AdminFeedback from "@/pages/AdminFeedback";

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

            {/* Página de agradecimiento (POST-success) */}
            <Route path="/thank-you/:orderId" element={<ThankYou />} />

            {/* Estado del pedido */}
            <Route path="/order-status/:orderId" element={<OrderStatus />} />

            {/* Feedback del cliente */}
            <Route path="/feedback" element={<Feedback />} />

            {/* Panel de administración */}
            <Route path="/admin" element={<AdminOrders />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />

            {/* Página 404 */}
            <Route
              path="*"
              element={
                <div className="p-10 text-center text-gray-600">
                  <h1 className="text-2xl font-bold mb-4">Page not found</h1>
                  <p>Oops! The page you are looking for doesn’t exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
