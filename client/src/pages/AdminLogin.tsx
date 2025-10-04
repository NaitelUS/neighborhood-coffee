import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === correctPass) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      alert("Invalid password. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          ☕ Barista Login
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border rounded-lg p-2 w-full text-center mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
