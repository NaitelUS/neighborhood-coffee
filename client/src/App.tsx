import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Menu from "./components/Menu";
import OrderPage from "./pages/OrderPage";
import ThankYou from "./pages/ThankYou";
import OrderStatus from "./pages/OrderStatus";
import AdminOrders from "./pages/AdminOrders";
import DeliveryPage from "./pages/DeliveryPage";

import { CartProvider } from "./context/CartContext";

// 🧠 Componente para atrapar y mostrar errores visualmente
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <React.Fragment>
      {error ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            ⚠️ Render Error
          </h1>
          <p className="text-gray-700 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00454E] text-white px-4 py-2 rounded-md"
          >
            Reload App
          </button>
        </div>
      ) : (
        <React.ErrorBoundary
          fallbackRender={({ error }) => {
            setError(error);
            return null;
          }}
        >
          {children}
        </React.ErrorBoundary>
      )}
    </React.Fragment>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
}
