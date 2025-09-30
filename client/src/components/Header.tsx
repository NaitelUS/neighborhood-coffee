import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleCartClick = () => {
    // ✅ Envía al usuario al resumen del pedido en la misma página
    const section = document.getElementById("order-summary");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
        <h1 className="font-serif text-xl md:text-2xl tracking-wide">
          <span className="text-primary font-bold">Neighborhood</span> Coffee
        </h1>
      </div>

      {/* Carrito */}
      <button
        onClick={handleCartClick}
        className="relative flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        aria-label="Go to Cart"
      >
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    </header>
  );
}
