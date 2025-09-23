import { useState, useEffect } from "react";

type OrderData = {
  orderNo: string;
  items: {
    id: string;
    name: string;
    temperature?: "hot" | "iced";
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
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authorized) {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("order-")
      );
      const loaded: OrderData[] = keys.map((k) => {
        const orderNo = k.replace("order-", "");
        const parsed = JSON.parse(localStorage.getItem(k) || "{}");
        return { orderNo, ...parsed };
      });
      setOrders(loaded);
    }
  }, [authorized]);

  const handleLogin = () => {
    if (password === "coffee123") {
      setAuthorized(true);
    } else {
      alert("Invalid password");
    }
  };

  const updateStatus = (orderNo: string, newStatus: string) => {
    const key = `order-${orderNo}`;
    const saved = localStorage.getItem(key);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    parsed.status = newStatus;
    localStorage.setItem(key, JSON.stringify(parsed));

    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === orderNo ? { ...o, status: newStatus } : o
      )
    );
  };

  if (!authorized) {
    return (
      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full border rounded p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order No</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Items</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNo}>
                <td className="border px-2 py-1">{o.orderNo}</td>
                <td className="border px-2 py-1">
                  {o.info?.name || "N/A"} <br />
                  {o.info?.email}
                </td>
                <td className="border px-2 py-1">
                  <ul className="list-disc ml-4">
                    {o.items.map((item, i) => (
                      <li key={i}>
                        {item.quantity}x {item.name}{" "}
                        {item.temperature && `(${item.temperature})`}
                        {item.addOns.length > 0 && (
                          <ul className="ml-4 text-xs text-gray-600">
                            {item.addOns.map((a, j) => (
                              <li key={j}>{a}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1 font-semibold">
                  ${o.total.toFixed(2)}
                </td>
                <td className="border px-2 py-1">{o.status || "☕ Received"}</td>
                <td className="border px-2 py-1">
                  <select
                    value={o.status || "☕ Received"}
                    onChange={(e) => updateStatus(o.orderNo, e.target.value)}
                    className="border rounded p-1"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
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
