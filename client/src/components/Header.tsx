import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // 🔢 Contador total de productos
  const totalItems = cartItems.length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
        {/* 🏠 Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-10 w-auto"
          />
          <span className="text-lg font-semibold text-gray-800">
            The Neighborhood Coffee
          </span>
        </div>

        {/* 🛒 Icono de carrito */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/order")}
        >
          <ShoppingCart className="h-6 w-6 text-gray-800 hover:text-amber-600 transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-semibold rounded-full px-1.5">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
