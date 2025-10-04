import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  name: string;
  phone: string;
  order_type: string;
  total: number;
  status: string;
  schedule_time: string;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">☕ Active Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white shadow-sm rounded-lg border border-gray-200"
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-1">
              {order.name}
            </h2>
            <p className="text-sm text-gray-600">
              📞 {order.phone || "N/A"} — {order.order_type}
            </p>
            <p className="text-sm text-gray-600">
              ⏰ {order.schedule_time || "Not Scheduled"}
            </p>
            <p className="text-sm text-gray-600">
              💲 Total: ${order.total.toFixed(2)}
            </p>
            <p className="text-sm mt-2">
              <span
                className={`font-bold ${
                  order.status === "Ready"
                    ? "text-green-600"
                    : order.status === "In Process"
                    ? "text-blue-600"
                    : "text-amber-600"
                }`}
              >
                {order.status}
              </span>
            </p>

            {/* Status Buttons */}
            <div className="flex gap-2 mt-3">
              {["Received", "In Process", "Ready", "Completed"].map(
                (s, index) => (
                  <button
                    key={index}
                    onClick={() => updateStatus(order.id, s)}
                    className={`px-2 py-1 rounded text-xs font-semibold border ${
                      order.status === s
                        ? "bg-amber-600 text-white"
                        : "hover:bg-amber-100 border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
