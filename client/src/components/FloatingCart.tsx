import { useLocation, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function FloatingCart() {
  const { cartItems } = useCart();
  const loc = useLocation();

  // ✅ Mostrar solo en home, menú y order
  const show = ["/", "/menu", "/order"].includes(loc.pathname);
  if (!show) return null;

  // 🔢 Total de ítems en el carrito
  const count = cartItems.reduce((acc, it) => acc + (it.qty || 1), 0);

  return (
    <Link
      to="/order"
      className="fixed right-4 bottom-4 z-50 shadow-lg rounded-full bg-[#00454E] text-white px-5 py-3 flex items-center gap-2 hover:bg-[#1D9099] transition-all"
    >
      <span className="inline-block font-medium">Cart</span>
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#00454E] text-sm font-semibold">
        {count}
      </span>
    </Link>
  );
}
