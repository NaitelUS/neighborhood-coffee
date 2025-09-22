import { ShoppingCart } from "lucide-react";

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
          <p className="italic text-[#E5A645] text-sm">
            More than coffee, it's a neighborhood tradition
          </p>
        </div>

        {/* Carrito */}
        <div className="relative">
          <a
            href="#order-form"
            className="relative flex items-center justify-center"
          >
            <ShoppingCart className="h-7 w-7 text-[#1D9099]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
