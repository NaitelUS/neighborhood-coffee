import React, { useEffect, useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "settings">("orders");

  // ✅ Redirigir si no hay login
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      window.location.href = "/admin-login";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔸 Header fijo */}
      <header className="bg-[#1D9099] text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold">☕ The Neighborhood Coffee</h1>
        <button
          onClick={() => {
            localStorage.removeItem("adminAuth");
            window.location.href = "/admin-login";
          }}
          className="bg-white text-[#00454E] px-3 py-1 rounded font-semibold hover:bg-gray-200"
        >
          Logout
        </button>
      </header>

      {/* 🔹 Tabs de navegación */}
      <nav className="flex justify-center gap-3 bg-[#00454E] py-3">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === "orders"
              ? "bg-[#1D9099] text-white"
              : "bg-white text-[#00454E] hover:bg-[#E0F7FA]"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === "products"
              ? "bg-[#1D9099] text-white"
              : "bg-white text-[#00454E] hover:bg-[#E0F7FA]"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === "settings"
              ? "bg-[#1D9099] text-white"
              : "bg-white text-[#00454E] hover:bg-[#E0F7FA]"
          }`}
        >
          Settings
        </button>
      </nav>

      {/* 🔸 Contenido dinámico */}
      <main className="p-6">
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Settings</h2>
            <p className="text-gray-600 mb-3">
              Aquí podrás configurar horarios, días festivos y límites de pedidos diarios.
            </p>

            <p className="text-sm text-gray-500">
              (Próximamente: edición directa de la tabla Settings en Airtable)
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
