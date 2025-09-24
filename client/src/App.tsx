import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus";
import AdminOrders from "@/pages/AdminOrders";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          {/* Aseguramos ambas rutas */}
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/thank-you/:id" element={<ThankYou />} />
          <Route path="/orders-status/:id" element={<OrderStatus />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </Layout>
    </Router>
  );
}
