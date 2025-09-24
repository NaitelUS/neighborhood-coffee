// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import AdminOrders from "@/pages/AdminOrders";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header en todas las páginas */}
        <Header />

        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Página principal de pedidos */}
            <Route path="/" element={<OrderPage />} />
            <Route path="/order" element={<OrderPage />} />

            {/* Página de confirmación */}
            <Route path="/thank-you/:orderId" element={<ThankYou />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminOrders />} />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="p-10 text-center text-gray-600">
                  <h1 className="text-2xl font-bold mb-4">Page not found</h1>
                  <p>Oops, the page you are looking for doesn’t exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
