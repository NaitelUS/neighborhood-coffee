import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="The Neighborhood Coffee" className="h-10" />
            <span className="font-semibold text-lg">The Neighborhood Coffee</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm">
            <div className="text-gray-700">
              📍 123 Main St, El Paso, TX  
              <br /> ⏰ Mon–Sat 6:00 AM – 11:00 AM  
              <br /> 💳 We accept Zelle, Cash & Card
            </div>
            <Link to="/cart" className="relative">
              🛒
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
        <div className="bg-gray-100 text-center py-1 text-xs italic text-gray-600">
          It is not coffee… it’s a neighborhood ritual ☕
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pt-28 pb-10">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} The Neighborhood Coffee. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
