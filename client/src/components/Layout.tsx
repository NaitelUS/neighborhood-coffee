import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white sticky top-0 z-50">
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee"
          className="h-10"
        />
        <div className="relative">
          <Link to="/order">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-7 w-7 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 2.25h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h10.721c.873 0 1.636-.564 1.894-1.395l2.382-7.617A.75.75 0 0021.75 4.5H5.016M7.5 14.25L5.016 4.5M7.5 14.25L6.375 18m0 0a2.25 2.25 0 104.5 0m-4.5 0h4.5m6.375-3.75L17.625 18m0 0a2.25 2.25 0 104.5 0m-4.5 0h4.5"
              />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
