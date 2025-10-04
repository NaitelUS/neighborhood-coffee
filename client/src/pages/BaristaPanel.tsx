import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

interface Order {
  id: string;
  Name: string;
  Phone: string;
  OrderType: string;
  Total: number;
  Status: string;
  ScheduleTime?: string;
  CreatedTime?: string;
}

export default function BaristaPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  // 🔐 Validar password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchOrders();
    } else {
      alert("Incorrect password");
    }
  };

  // 🚀 Cargar órdenes desde Netlify Function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();

      if (Array.isArray(data)) {
        // 🕒 Ordenar por hora más reciente arriba
        const sorted = data.sort((a, b) =>
          dayjs(b.CreatedTime).isAfter(dayjs(a.CreatedTime)) ? 1 : -1
        );
        setOrders(sorted);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Cambiar estado de orden
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, Status: newStatus } : o))
        );
      } else {
        alert("Error updating order");
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  // 🔁 Auto refresh cada 60s
  useEffect(() => {
    if (authenticated) {
      const interval = setInterval(fetchOrders, 60000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <h1 className="text-3xl font-bold text-amber-700 mb-6">
          ☕ Barista Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-lg p-6 w-80"
        >
          <input
            type="password"
            placeholder="Enter password"
            className="border w-full mb-4 px-3 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-800">Barista Orders</h1>
        <button
          onClick={fetchOrders}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          🔄 Refresh
        </button>
      </header>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found ☕</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{order.Name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {order.OrderType} • {order.Phone || "No phone"}
              </p>
              <p className="text-gray-700">
                <strong>Total:</strong> ${order.Total.toFixed(2)}
              </p>
              <p className="text-gray-700">
                <strong>Time:</strong> {order.ScheduleTime || "ASAP"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Status:</strong> {order.Status}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(order.id, "In Progress")}
                  className={`px-3 py-1 rounded text-sm ${
                    order.Status === "In Progress"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(order.id, "Ready")}
                  className={`px-3 py-1 rounded text-sm ${
                    order.Status === "Ready"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  Ready
                </button>
                <button
                  onClick={() => updateStatus(order.id, "Completed")}
                  className={`px-3 py-1 rounded text-sm ${
                    order.Status === "Completed"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
