import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
     <header className="bg-white w-full border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3">
        {/* 🏠 Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="/attached_assets/tnclogo.png"
            alt="The Neighborhood Coffee Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* ✨ Tagline */}
        <p className="text-sm font-medium text-[#1D9099] mt-2 sm:mt-0 italic text-center tracking-wide">
          Freshly brewed coffee every day, from our house to yours.
        </p>
      </div>
    </header>
  );
}
