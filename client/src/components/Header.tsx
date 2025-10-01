import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const itemCount = cartItems.length;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-3 sm:px-6 py-3">
        {/* 🏠 Logo (alineado a la izquierda) */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-10 sm:h-12 w-auto"
          />
        </div>

        {/* 🛒 Carrito (alineado a la derecha, con espacio) */}
        <div className="relative ml-3 sm:ml-6">
          <button
            onClick={() => navigate("/order")}
            className="flex items-center gap-2 bg-[#1D9099] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#00454E] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">View Order</span>
          </button>

          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
