import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const { addToCart } = useCart();

  const menuItems = [
    { id: 1, name: "Cappuccino", price: 4.5, image: "/attached_assets/cappuccino.png" },
    { id: 2, name: "Latte", price: 4.0, image: "/attached_assets/latte.png" },
    { id: 3, name: "Mocha", price: 4.75, image: "/attached_assets/mocha.png" },
    { id: 4, name: "Espresso", price: 3.5, image: "/attached_assets/espresso.png" },
    { id: 5, name: "Cold Brew", price: 4.25, image: "/attached_assets/coldbrew.png" },
  ];

  return (
    <div className="menu-wrapper max-w-7xl mx-auto px-4 py-10 relative">
      <h2 className="text-2xl font-semibold text-[#00454E] mb-6 text-center">
        Our Menu
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-soft p-4 w-full max-w-[200px] transition-transform hover:scale-105 text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
            <p className="text-[#1D9099] font-semibold mb-3">${item.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(item)}
              className="bg-[#00454E] text-white py-1 px-4 rounded-full hover:bg-[#1D9099] transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/order"
          className="text-[#00454E] underline hover:text-[#1D9099] font-medium"
        >
          View My Order →
        </Link>
      </div>
    </div>
  );
}
