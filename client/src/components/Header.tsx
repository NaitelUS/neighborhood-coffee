// src/components/Header.tsx
import React from "react";
import { ShoppingCart } from "lucide-react";

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6 border-b bg-white shadow-sm">
      {/* Logo + frase */}
      <div className="flex flex-col items-start">
        <img
          src="/attached_assets/tnclogo.png" // asegúrate que exista en public/attached_assets/
          alt="The Neighborhood Coffee Logo"
          className="h-14"
        />
        <p className="italic text-[#E5A645] text-sm">
          More than Coffee, it's a neighborhood tradition, from our home to yours.
        </p>
      </div>

      {/* Carrito */}
      <a href="#order-form" className="relative">
        <ShoppingCart size={28} className="text-[#1D9099] hover:text-[#00454E]" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {cartCount}
          </span>
        )}
      </a>
    </header>
  );
}
