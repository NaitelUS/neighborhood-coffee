import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const hideCart =
    location.pathname === "/thank-you" || location.pathname === "/status";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white text-[#00454E] shadow-md">
      {/* Logo + Nombre */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/attached_assets/tnclogo.png"
          alt="The Neighborhood Coffee logo"
          className="h-10 w-auto"
        />
        <h1 className="text-xl font-semibold tracking-tight">
          The Neighborhood Coffee
        </h1>
      </div>

      {/* Ícono del carrito */}
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
