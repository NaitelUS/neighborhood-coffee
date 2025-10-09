import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // 🧮 Contador total de artículos en carrito
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Ocultar el carrito en algunas páginas
  const hideCart =
    location.pathname === "/thank-you" || location.pathname === "/status";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#00454E] text-white shadow-md">
      {/* Logo o Nombre del Negocio */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        The Neighborhood Coffee
      </h1>

      {/* Ícono del carrito (solo si no estamos en thank-you o status) */}
      {!hideCart && (
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/order")}
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-black rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
