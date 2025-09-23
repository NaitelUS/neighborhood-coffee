// src/pages/AdminOrders.tsx
import { useState, useEffect } from "react";

type OrderData = {
  items: {
    id: string;
    name: string;
    temperature?: string;
    option?: string;
    quantity: number;
    basePrice: number;
    addOns: string[];
  }[];
  info: any;
  subtotal: number;
  discount: number;
  total: number;
  status?: string;
};

const ORDER_STATUSES = [
  "☕ Received",
  "👨‍🍳 In Process",
  "🛵 On the Way",
  "📦 Ready for Pickup",
  "✅ Completed",
  "❌ Cancelled",
];

export default function AdminOrders() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<{ id: string; data: OrderData }[]>([]);

  useEffect(() => {
    if (authed) {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("order-"));
      const loaded = keys.map((k) => ({
        id: k.replace("order-", ""),
        data: JSON.parse(localStorage.getItem(k) || "{}"),
      }));
      setOrders(loaded);
    }
  }, [authed]);

  const updateStatus = (orderId: string, newStatus: string) => {
    const key = `order-${orderId}`;
    const order = localStorage.getItem(key);
    if (order) {
      const parsed = JSON.parse(order);
      parsed.status = newStatus;
      localStorage.setItem(key, JSON.stringify(parsed));

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, data: { ...o.data, status: newStatus } } : o
        )
      );
    }
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => {
            if (password === "coffee123") {
              setAuthed(true);
            } else {
              alert("Invalid password");
            }
          }}
          className="bg-[#1D9099] text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Order #</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-left">Items</th>
              <th className="border px-3 py-2 text-left">Subtotal</th>
              <th className="border px-3 py-2 text-left">Discount</th>
              <th className="border px-3 py-2 text-left">Total</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ id, data }) => (
              <tr key={id} className="border-t">
                <td className="border px-3 py-2">{id}</td>
                <td className="border px-3 py-2">
                  {data.info?.name} <br />
                  {data.info?.phone}
                </td>
                <td className="border px-3 py-2">
                  <ul className="list-disc ml-4">
                    {data.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} ({item.temperature || item.option}) x{item.quantity}
                        {item.addOns?.length > 0 && (
                          <ul className="list-disc ml-6 text-sm text-gray-600">
                            {item.addOns.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-3 py-2">${data.subtotal.toFixed(2)}</td>
                <td className="border px-3 py-2">
                  {data.discount > 0 ? `-$${data.discount.toFixed(2)}` : "-"}
                </td>
                <td className="border px-3 py-2 font-bold">
                  ${data.total.toFixed(2)}
                </td>
                <td className="border px-3 py-2">
                  <select
                    value={data.status || "☕ Received"}
                    onChange={(e) => updateStatus(id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
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
