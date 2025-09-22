// src/components/Header.tsx
import React from "react";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center py-6 border-b bg-white shadow-sm">
      <img
        src="/attached_assets/logo.png"
        alt="The Neighborhood Coffee Logo"
        className="h-20 mb-2"
      />
      <p className="italic text-[#E5A645] text-center max-w-md">
        More than Coffee, it's a neighborhood tradition, from our home to yours.
      </p>
    </header>
  );
}
