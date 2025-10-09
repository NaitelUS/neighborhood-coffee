import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import OrderStatus from "./pages/OrderStatus";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";

import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-3xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/status" element={<OrderStatus />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route
                path="*"
                element={
                  <div className="text-center mt-20 text-gray-600 text-lg">
                    Page not found
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
