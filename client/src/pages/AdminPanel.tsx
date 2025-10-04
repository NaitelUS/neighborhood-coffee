// client/src/pages/AdminPanel.tsx
import React, { useState } from "react";
import AdminOrders from "@/pages/AdminOrders";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "";
    if (password.trim() === adminPass.trim()) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="border border-gray-300 w-full px-3 py-2 rounded mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <AdminOrders />;
}
