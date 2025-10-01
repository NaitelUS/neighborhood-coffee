import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "@/context/CartContext";

export default function Header() {
  const { cartItems } = useContext(CartContext);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/">
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-10 w-auto"
          />
        </Link>

        <Link to="/order" className="relative">
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#1D9099] text-white text-xs font-bold px-2 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
