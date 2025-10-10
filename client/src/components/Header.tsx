import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-white px-5 py-3 shadow-md">
      {/* Logo con fondo blanco/transparente */}
      <img
        src="/attached_assets/tnclogo.png"
        alt="The Neighborhood Coffee Logo"
        className="h-10 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Cart icon */}
      <button
        onClick={() => navigate("/order")}
        className="relative text-[#00454E] hover:text-[#1D9099] transition"
      >
        <ShoppingCart size={24} />
      </button>
    </header>
  );
};

export default Header;
