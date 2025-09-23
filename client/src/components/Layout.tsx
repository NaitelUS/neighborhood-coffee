import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import tnclogo from "/attached_assets/tnclogo.png";

interface LayoutProps {
  children: ReactNode;
  cartCount?: number;
}

export default function Layout({ children, cartCount = 0 }: LayoutProps) {
  const location = useLocation();

  const hideCart =
    location.pathname.startsWith("/admin/orders") ||
    location.pathname.startsWith("/order-status");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={tnclogo} alt="The Neighborhood Coffee" className="h-10" />
        </div>

        {!hideCart && (
          <a href="#order-form" className="relative">
            <span className="material-icons text-3xl text-[#1D9099]">
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </a>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 mt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-6 text-sm text-gray-600">
        <p>
          <span className="text-red-500">♥</span> Crafted in El Paso
        </p>
        <p className="mt-1">©2025 The Neighborhood Coffee</p>
      </footer>
    </div>
  );
}
