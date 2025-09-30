import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart } = useCart();

  const scrollToSummary = () => {
    const summary = document.getElementById("order-summary");
    if (summary) summary.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <a href="/" className="text-xl font-serif font-bold">
          The Neighborhood Coffee
        </a>

        {/* 🔔 Ícono del carrito con contador */}
        <button
          onClick={scrollToSummary}
          className="relative text-gray-700 hover:text-primary transition"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
