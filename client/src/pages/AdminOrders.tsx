import { useEffect, useState } from "react";

interface Order {
  id: string;
  CustomerName?: string;
  Phone?: string;
  Total?: number;
  Status?: string;
  OrderType?: string; // Pickup / Delivery
  Created?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-list");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, Status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, Status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No orders found.
      </div>
    );
  }

  const getNextStatuses = (order: Order): { label: string; value: string }[] => {
    const type = order.OrderType || "Pickup";
    const s = order.Status || "Pending";

    switch (s) {
      case "Pending":
        return [{ label: "Start Processing", value: "In Process" }];
      case "In Process":
        return type === "Delivery"
          ? [{ label: "Out for Delivery", value: "Out for Delivery" }]
          : [{ label: "Mark Ready", value: "Ready for Pickup" }];
      case "Ready for Pickup":
      case "Out for Delivery":
        return [{ label: "Mark Completed", value: "Completed" }];
      default:
        return [];
    }
  };

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Process": "bg-blue-100 text-blue-800",
    "Ready for Pickup": "bg-green-100 text-green-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    Completed: "bg-gray-100 text-gray-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        ☕ Admin – Orders Dashboard
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const nextStatuses = getNextStatuses(order);
              return (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{order.CustomerName}</td>
                  <td className="p-3">{order.Phone}</td>
                  <td className="p-3">{order.OrderType || "Pickup"}</td>
                  <td className="p-3">${order.Total?.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColor[order.Status || "Pending"]
                      }`}
                    >
                      {order.Status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {nextStatuses.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={() => updateStatus(order.id, btn.value)}
                          disabled={updating === order.id}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
