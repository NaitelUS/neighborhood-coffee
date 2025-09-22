// src/pages/AdminOrders.tsx
import { useState, useEffect } from "react";

type Order = {
  orderNo: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: string[];
  total: number;
  status: string;
};

const PASSWORD = "coffeeadmin123";

const STATUSES = [
  "Order Received",
  "In Process",
  "Ready for Pickup",
  "On the Way",
  "Completed",
  "Canceled",
];

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  const handleLogin = () => {
    const input = prompt("Enter admin password:");
    if (input === PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const updateStatus = (orderNo: number, status: string) => {
    const updatedOrders = orders.map((order) =>
      order.orderNo === orderNo ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={handleLogin}
          className="bg-[#1D9099] hover:bg-[#00454E] text-white px-6 py-3 rounded-lg"
        >
          Enter Admin Area
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Order No</th>
              <th className="border px-3 py-2">Customer</th>
              <th className="border px-3 py-2">Items</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNo}>
                <td className="border px-3 py-2">{order.orderNo}</td>
                <td className="border px-3 py-2">
                  {order.customer.name} <br />
                  {order.customer.email} <br />
                  {order.customer.phone} <br />
                  {order.customer.address || "Pickup"}
                </td>
                <td className="border px-3 py-2">
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-3 py-2">
                  ${order.total.toFixed(2)}
                </td>
                <td className="border px-3 py-2">
                  <div className="flex flex-col gap-1">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.orderNo, status)}
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === status
                            ? "bg-[#1D9099] text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
