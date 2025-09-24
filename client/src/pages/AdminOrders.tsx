// client/src/pages/AdminOrders.tsx
import { useState, useEffect } from "react";

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: string;
}

const ORDER_STATUSES = [
  "Received",
  "In Progress",
  "Ready",
  "Out for Delivery",
  "Completed",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Cargar órdenes de localStorage
  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const currentIndex = ORDER_STATUSES.indexOf(order.status);
          if (currentIndex < ORDER_STATUSES.length - 1) {
            return { ...order, status: ORDER_STATUSES[currentIndex + 1] };
          }
        }
        return order;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Order ID</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-left">Items</th>
              <th className="border px-3 py-2 text-right">Total</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-3 py-2">{order.id}</td>
                <td className="border px-3 py-2">{order.customerName}</td>
                <td className="border px-3 py-2">
                  {order.items.join(", ")}
                </td>
                <td className="border px-3 py-2 text-right">
                  ${order.total.toFixed(2)}
                </td>
                <td className="border px-3 py-2 text-center">
                  {order.status}
                </td>
                <td className="border px-3 py-2 text-center">
                  {order.status !== "Completed" && (
                    <button
                      onClick={() => advanceStatus(order.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Advance
                    </button>
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
