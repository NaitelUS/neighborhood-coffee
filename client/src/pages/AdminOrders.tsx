import { useState, useEffect } from "react";

const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      loadOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Order ID</th>
              <th className="border px-3 py-2">Customer</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border px-3 py-2">{o.id}</td>
                <td className="border px-3 py-2">{o.customerName}</td>
                <td className="border px-3 py-2 text-right">${o.total}</td>
                <td className="border px-3 py-2 text-center">{o.status}</td>
                <td className="border px-3 py-2 text-center">
                  {ORDER_STATUSES.map(
                    (s) =>
                      s !== o.status && (
                        <button
                          key={s}
                          onClick={() => updateStatus(o.id, s)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs m-1 hover:bg-blue-700"
                        >
                          {s}
                        </button>
                      )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
