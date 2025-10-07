import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "@/context/CartContext";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Mostrar el header solo en la página principal (/)
  if (location.pathname !== "/") return null;

  const totalItems = cartItems.reduce((sum, item) => sum + 1, 0);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        {/* 🏠 Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* ☕ Botón para ver la orden solo si hay ítems */}
        {totalItems > 0 && (
          <button
            onClick={() => navigate("/order")}
            className="bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
          >
            View Order ({totalItems})
          </button>
        )}
      </div>
    </header>
  );
}
