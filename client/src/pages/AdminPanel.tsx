import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const ADMIN_PASSWORD = "admin2025!";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setAuthenticated(true);
      navigate("/admin/orders");
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setAuthenticated(true);
      navigate("/admin/orders");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Admin Access
      </h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-3 w-64 text-center"
      />
      <button
        onClick={handleLogin}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
