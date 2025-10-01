import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "@/context/CartContext";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.length;

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* 🏠 Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* 🛒 Carrito */}
        <div className="relative">
          <button
            onClick={() => navigate("/order")}
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="View Cart"
          >
            <ShoppingCart className="text-gray-700 w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
