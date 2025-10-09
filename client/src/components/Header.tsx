import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Contador que suma las cantidades (quantity)
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // ✅ Ocultar el carrito en páginas específicas
  const hideCart =
    location.pathname.includes("/thank-you") ||
    location.pathname.includes("/status");

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        {/* 🏠 Logo: redirige al menú */}
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

        {/* 🛒 Icono del carrito (solo si no estamos en ThankYou/Status) */}
        {!hideCart && (
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/order")}
          >
            <ShoppingCart
              size={28}
              className="text-[#1D9099] hover:text-[#00454E]"
            />

            {/* 🔢 Burbuja con número de ítems */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1D9099] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
