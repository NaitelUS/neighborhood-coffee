import { useState } from "react";

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 🔑 Contraseña mínima (puedes cambiarla a la que quieras)
    if (password === "coffeeadmin") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // 🔽 Una vez logueado, aquí iría la tabla de pedidos más adelante
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <p>Welcome, admin! 🚀</p>
      <p className="mt-2 text-gray-600">
        Aquí verás los pedidos registrados en el sistema.
      </p>
    </div>
  );
}
