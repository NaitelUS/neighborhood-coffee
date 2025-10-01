import React from "react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart } = useCart();

  const scrollToOrder = () => {
    const orderSection = document.querySelector("section.bg-card");
    orderSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-3 cursor-pointer">
        <img src="/attached_assets/tnclogo.png" alt="Logo" className="h-12" />
        <h1 className="text-xl font-bold text-gray-800">
          The Neighborhood Coffee
        </h1>
      </div>

      <button
        onClick={scrollToOrder}
        className="relative bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
      >
        🛒 Cart
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </button>
    </header>
  );
}
