import React, { useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const itemCount = cartItems.length;

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee"
          className="h-12 w-auto"
        />
      </div>

      {/* Cart */}
      <button
        className="relative text-gray-800 hover:text-amber-600 transition"
        onClick={() => navigate("/order")}
      >
        <ShoppingCart size={28} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full px-2 py-0.5">
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
