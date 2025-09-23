import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50 flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-3">
          <img src="/attached_assets/tnclogo.png" alt="TNC Logo" className="h-12" />
        </div>
        <a href="#order-form" className="relative">
          <ShoppingCart className="h-7 w-7 text-[#1D9099]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#E5A645] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </a>
      </header>

      {/* Main */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-10 text-center text-sm">
        <p className="font-bold text-lg">
          The Neighborhood Coffee
          <br />
          12821 Little Misty Ln
          <br />
          El Paso, Texas 79938
          <br />
          +1 (915) 401-5547
        </p>
        <p className="mt-2 font-bold text-lg">
          We’re open weekdays, except Sundays
          <br />
          6:00 AM – 11:00 AM
        </p>
        <p className="mt-3 italic font-bold text-xl text-[#E5A645]">
          More than Coffee, it’s a neighborhood tradition, from our home to yours.
        </p>
        <div className="mt-6 flex flex-col items-center space-y-2">
          <span className="text-gray-600 text-sm">❤️ Crafted in El Paso with love</span>
          <span className="text-gray-400">@2025 The Neighborhood Coffee</span>
        </div>
      </footer>
    </div>
  );
}
