// client/src/pages/OrderPage.tsx
import React from "react";
import Menu from "@/components/Menu";

export default function OrderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 🧭 Encabezado */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Our Menu
      </h1>

      {/* 🧃 Lista de productos */}
      <Menu />
    </div>
  );
}
