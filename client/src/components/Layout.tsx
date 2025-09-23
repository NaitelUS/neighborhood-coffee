import { ReactNode } from "react";
import { useCart } from "@/hooks/useCart";

export default function Layout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 shadow-md fixed top-0 w-full bg-white z-50">
        <div className="flex items-center space-x-3">
          <img src="/tnclogo.png" alt="The Neighborhood Coffee" className="h-12" />
        </div>

        {/* Shopping Cart */}
        <a href="/order" className="relative flex items-center">
          <span className="material-icons text-3xl">shopping_cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
              {totalItems}
            </span>
          )}
        </a>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-20">{children}</main>

      {/* FOOTER */}
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        <div className="flex flex-col items-center space-y-1">
          <span>© 2025 The Neighborhood Coffee</span>
          <span className="flex items-center gap-1">
            <span className="text-red-500">♥</span> Crafted in El Paso, TX
          </span>
        </div>
      </footer>
    </div>
  );
}
