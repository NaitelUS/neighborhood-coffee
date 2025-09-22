// src/pages/AdminOrders.tsx
import { useEffect, useState } from "react";

const STATUSES = [
  "Received",
  "In Process",
  "Ready for Pickup",
  "On the Way",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const pwd = prompt("Enter admin password:");
    if (pwd === "coffee123") {
      setAuthorized(true);
      const stored = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(stored);
    } else {
      alert("Unauthorized");
      window.location.href = "/";
    }
  }, []);

  const updateStatus = (orderNo: number, newStatus: string) => {
    const updated = orders.map((o) => (o.orderNo === orderNo ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  if (!authorized) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order No</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Items</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNo}>
                <td className="border px-2 py-1">#{o.orderNo}</td>
                <td className="border px-2 py-1">
                  {o.customer?.name}<br />
                  {o.customer?.phone}
                </td>
                <td className="border px-2 py-1">
                  <ul>
                    {o.items.map((it: any, idx: number) => (
                      <li key={idx}>
                        {it.quantity}x {it.temperature} {it.drinkName}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1">${o.total.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.orderNo, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
