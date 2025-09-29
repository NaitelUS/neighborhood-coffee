import { useState } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Neighbor2025!";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("auth", "true");
      setAuthenticated(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (!authenticated && sessionStorage.getItem("auth") !== "true") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-80">
          <h1 className="text-xl font-bold mb-4 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="border w-full rounded p-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 🔒 Si ya está logueado, muestra el panel base
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <p className="text-gray-500 mb-6">
        Welcome back! Choose a section below to manage your data.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <h2 className="font-semibold mb-2">Products</h2>
          <p className="text-sm text-gray-500 mb-3">
            Edit product names, prices, and descriptions.
          </p>
          <a
            href="/admin-panel/products"
            className="text-blue-600 font-medium hover:underline"
          >
            Manage →
          </a>
        </div>

        <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <h2 className="font-semibold mb-2">AddOns</h2>
          <p className="text-sm text-gray-500 mb-3">
            Manage extra ingredients and prices.
          </p>
          <a
            href="/admin-panel/addons"
            className="text-blue-600 font-medium hover:underline"
          >
            Manage →
          </a>
        </div>

        <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <h2 className="font-semibold mb-2">Coupons</h2>
          <p className="text-sm text-gray-500 mb-3">
            Create or update discount codes.
          </p>
          <a
            href="/admin-panel/coupons"
            className="text-blue-600 font-medium hover:underline"
          >
            Manage →
          </a>
        </div>
      </div>
    </div>
  );
}
