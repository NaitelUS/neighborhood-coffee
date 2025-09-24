import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartItems } = useCart();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/attached_assets/tnclogo.png"
              alt="The Neighborhood Coffee"
              className="h-10"
            />
          </Link>

          {/* Info (solo en páginas no admin) */}
          {!isAdminPage && (
            <div className="text-right text-xs text-gray-700 leading-tight">
              <div className="font-semibold">The Neighborhood Coffee</div>
              <div>📍 123 Main St, El Paso, TX</div>
              <div>📞 (915) 555-1234</div>
              <div>⏰ Mon–Sat 6:00 AM – 11:00 AM</div>
              <div>💳 We accept Zelle, Cash & Card</div>
            </div>
          )}

          {/* Cart (oculto en admin) */}
          {!isAdminPage && (
            <nav className="flex items-center space-x-6 text-sm">
              <Link to="/cart" className="relative">
                🛒
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {cartItems?.length || 0}
                  </span>
                )}
              </Link>
            </nav>
          )}
        </div>

        {/* Tagline */}
        {!isAdminPage && (
          <div className="bg-gray-100 text-center py-1 text-xs italic text-gray-600">
            It is not coffee… it’s a neighborhood ritual ☕
          </div>
        )}
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
