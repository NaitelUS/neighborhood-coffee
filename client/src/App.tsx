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
          {/* Página principal de pedidos */}
          <Route path="/" element={<OrderPage />} />

          {/* Confirmación del pedido */}
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Estado del pedido */}
          <Route path="/order-status/:id" element={<OrderStatus />} />

          {/* Panel de administrador/barista */}
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* Ruta fallback */}
          <Route path="*" element={<h2 className="p-6">Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
}
