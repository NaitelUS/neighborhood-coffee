// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus";
import AdminOrders from "@/pages/AdminOrders";
import Header from "@/components/Header";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header con logo + frase */}
        <Header />

        {/* Contenido de páginas */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/order-status/:id" element={<OrderStatus />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
