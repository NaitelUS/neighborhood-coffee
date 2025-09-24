// client/src/components/Header.tsx
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { cart } = useCart();
  const cartCount = cart?.length ?? 0;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/tnclogo.png"
            alt="The Neighborhood Coffee"
            className="h-8"
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link to="/order" className="hover:text-green-700 font-medium">
            Order Online
          </Link>
          <Link to="/contact" className="hover:text-green-700 font-medium">
            Contact
          </Link>

          {/* Cart */}
          <Link
            to="/order"
            className="relative inline-flex items-center p-2 hover:text-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9.55a1 1 0 00.9-.55L21 9M7 13h10"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
