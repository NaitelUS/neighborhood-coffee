import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-white shadow">
      {/* Logo */}
      <Link to="/order">
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee"
          className="h-10"
        />
      </Link>

      {/* Cart */}
      <Link to="/order" className="relative">
        <span className="text-2xl">🛒</span>
        {(cart ?? []).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {cart.length}
          </span>
        )}
      </Link>
    </header>
  );
}
