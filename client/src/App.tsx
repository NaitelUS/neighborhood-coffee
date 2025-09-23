import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderPage from "@/pages/OrderPage";
import ThankYou from "@/pages/ThankYou";
import OrderStatus from "@/pages/OrderStatus"; // nuevo
import AdminOrders from "@/pages/AdminOrders";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/order-status/:id" element={<OrderStatus />} /> {/* público */}
          <Route path="/admin/orders" element={<AdminOrders />} /> {/* protegido */}
        </Routes>
      </Layout>
    </Router>
  );
}
