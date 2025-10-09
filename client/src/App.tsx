import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

// 🧩 Pages
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";
import OrderStatus from "./pages/OrderStatus";

// 🧭 Global UI
import Header from "./components/Header";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <main className="p-4 max-w-3xl mx-auto">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/status" element={<OrderStatus />} />
              <Route path="*" element={<Menu />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
