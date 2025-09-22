// src/components/Layout.tsx
import React from "react";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header global */}
      <Header />

      {/* Contenido dinámico */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer global */}
      <footer className="bg-[#1D9099] text-white text-center py-4 mt-6">
        <p className="text-sm">© {new Date().getFullYear()} The Neighborhood Coffee</p>
        <p className="text-xs mt-1">
          Crafted with ❤️ in El Paso — More than coffee, it's a neighborhood tradition.
        </p>
      </footer>
    </div>
  );
}
