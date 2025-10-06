import React, { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  const DELIVERY_PASSWORD = import.meta.env.VITE_DELIVERY_PASSWORD;

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      const filtered = data
        .filter(
          (o: any) =>
            o.order_type?.toLowerCase() === "delivery" &&
            ["Ready", "Out for Delivery"].includes(o.status)
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("deliveryAuth");
    if (auth === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
      // ⏱️ Auto-refresh cada 30 segundos
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (passwordInput === DELIVERY_PASSWORD) {
      localStorage.setItem("deliveryAuth", "true");
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl font-semibold mb-3">Delivery Access</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border p-2 rounded mb-2 w-64 text-center"
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

  async function handleComplete(orderId: string) {
    const confirmAction = window.confirm("Mark this order as completed?");
    if (!confirmAction) return;

    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          fields: { status: "Completed" },
        }),
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert("Error updating order");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-1">
        🚚 Delivery Orders
      </h1>
      <p className="text-center text-xs text-gray-400 mb-3">
        Auto-refresh every 30s
      </p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No delivery orders available</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-lg">#{order.id}</h2>
                <span className="text-xs text-gray-500">{order.status}</span>
              </div>

              <p><strong>👤</strong> {order.name}</p>
              <p><strong>📞</strong> {order.phone}</p>
              <p>🕓 {order.schedule_time || "N/A"}</p>
              <p className="mt-1 font-bold text-lg text-green-700">
                💲{Number(order.total).toFixed(2)}
              </p>

              <button
                onClick={() => handleComplete(order.id)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Mark as Completed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
