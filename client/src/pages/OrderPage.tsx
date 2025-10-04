import React from "react";
import Menu from "@/components/Menu";
import OrderSummary from "@/components/OrderSummary";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Our Menu</h1>
        <button
          onClick={() => navigate("/thank-you")}
          className="hidden md:inline-block px-4 py-2 bg-[#1D9099] hover:bg-[#00454E] text-white rounded-lg transition"
        >
          Checkout
        </button>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🧁 Menú (Productos) */}
        <div className="order-2 md:order-1">
          <Menu />
        </div>

        {/* 🧾 Carrito / Resumen */}
        <div className="order-1 md:order-2">
          <OrderSummary />
        </div>
      </div>

      {/* Botón inferior móvil */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-3 flex justify-between items-center">
        <span className="font-semibold text-gray-800">Ready to checkout?</span>
        <button
          onClick={() => navigate("/order")}
          className="px-4 py-2 bg-[#1D9099] hover:bg-[#00454E] text-white rounded-lg transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
