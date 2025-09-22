// src/components/Header.tsx
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo + Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-lg font-bold text-[#1D9099]">
              The Neighborhood Coffee
            </h1>
            <p className="text-xs italic text-gray-600">
              More than coffee, it's a neighborhood tradition
            </p>
          </div>
        </div>

        {/* Carrito */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="relative"
            onClick={() => {
              const form = document.getElementById("order-form");
              if (form) {
                form.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <ShoppingCart className="h-6 w-6 text-[#1D9099]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
