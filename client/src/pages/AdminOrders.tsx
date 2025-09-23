import { useState, useEffect } from "react";

type Order = {
  orderNo: string;
  info: { name: string; phone: string; email: string };
  items: {
    name: string;
    temperature?: string;
    quantity: number;
    addOns: string[];
  }[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
};

export default function AdminOrders() {
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (authenticated) {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("order-")
      );
      const loaded = keys.map((k) => {
        const raw = localStorage.getItem(k);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
          orderNo: k.replace("order-", ""),
          ...parsed,
          status: parsed.status || "☕ Received",
        };
      });
      setOrders(loaded.filter((o) => o !== null) as Order[]);
    }
  }, [authenticated]);

  const updateStatus = (orderNo: string, status: string) => {
    const key = `order-${orderNo}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.status = status;
      localStorage.setItem(key, JSON.stringify(parsed));
      setOrders((prev) =>
        prev.map((o) => (o.orderNo === orderNo ? { ...o, status } : o))
      );
    }
  };

  if (!authenticated) {
    return (
      <div className="p-6 max-w-sm mx-auto">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter password"
          className="border rounded w-full p-2 mb-3"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button
          className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
          onClick={() => {
            if (passwordInput === "coffee123") {
              setAuthenticated(true);
            } else {
              alert("Incorrect password.");
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Order #</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNo} className="border-t">
                <td className="p-2 border">{o.orderNo}</td>
                <td className="p-2 border">
                  {o.info?.name}
                  <br />
                  <span className="text-xs text-gray-500">{o.info?.phone}</span>
                </td>
                <td className="p-2 border">
                  <ul className="list-disc ml-4">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        {it.quantity}x {it.name} ({it.temperature})
                        {it.addOns?.length > 0 && (
                          <ul className="ml-6 text-xs text-gray-600 list-disc">
                            {it.addOns.map((a, j) => (
                              <li key={j}>{a}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border font-semibold">
                  ${o.total.toFixed(2)}
                </td>
                <td className="p-2 border">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.orderNo, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option>☕ Received</option>
                    <option>👨‍🍳 In Process</option>
                    <option>🛵 On the Way</option>
                    <option>📦 Ready for Pickup</option>
                    <option>✅ Completed</option>
                    <option>❌ Cancelled</option>
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
