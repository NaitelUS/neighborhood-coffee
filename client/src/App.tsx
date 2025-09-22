// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus";
import AdminOrders from "@/pages/AdminOrders";
import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/order-status/:id" element={<OrderStatus />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </Layout>
    </Router>
  );
}
