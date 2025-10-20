import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin2025!";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/orders");
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (isAuth === "true") navigate("/admin/orders");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">☕ Admin Access</h1>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-64 mb-3 text-center"
      />
      <button
        onClick={handleLogin}
        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
