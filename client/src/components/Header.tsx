import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "@/context/CartContext";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center border-b">
      <div className="flex items-center gap-3">
        <img
          src="/attached_assets/tnclogo.png"
          alt="Logo"
          className="h-10 w-auto"
        />
        <h1 className="font-bold text-lg text-gray-800">
          The Neighborhood Coffee
        </h1>
      </div>

      <Link to="/order" className="relative flex items-center gap-2 text-gray-700 hover:text-black">
        <ShoppingCart size={22} />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}
