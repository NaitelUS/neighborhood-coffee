import { ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Layout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-12 w-auto"
          />

          <a href="#order-form" className="relative">
            <ShoppingCart className="h-7 w-7 text-[#1D9099]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E5A645] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
        </div>
      </header>

      <main className="flex-grow pt-20">{children}</main>

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
