import { useEffect, useState } from "react";

const PASSWORD = "coffee123";
const STATUS_OPTIONS = [
  "☕ Received",
  "👨‍🍳 In Process",
  "🛵 On the Way",
  "📦 Ready for Pickup",
  "✅ Completed",
  "❌ Cancelled",
];

export default function AdminOrders() {
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const pass = prompt("Enter admin password:");
    if (pass === PASSWORD) setAuthenticated(true);
    else {
      alert("Incorrect password.");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const all: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("order-")) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || "null");
          all.push({ ...parsed, id: key.replace("order-", "") });
        } catch {}
      }
    }
    setOrders(all);
  }, [authenticated]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    const raw = localStorage.getItem(`order-${orderId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.status = newStatus;
      localStorage.setItem(`order-${orderId}`, JSON.stringify(parsed));
    }
  };

  if (!authenticated) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Orders Panel</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Order #</th>
                <th className="border px-2 py-1">Customer</th>
                <th className="border px-2 py-1">Items</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="border px-2 py-1">{o.id}</td>
                  <td className="border px-2 py-1">
                    {o.info?.name}
                    <div className="text-xs text-gray-600">{o.info?.phone}</div>
                  </td>
                  <td className="border px-2 py-1 text-sm">
                    <ul className="list-disc ml-4">
                      {o.items?.map((it: any, i: number) => (
                        <li key={i}>
                          {it.quantity}× {it.name}
                          {it.temperature && ` (${it.temperature})`}
                          {it.option && ` - ${it.option}`}
                          {(it.addOns && it.addOns.length > 0) && (
                            <ul className="ml-4 list-disc text-xs text-gray-700">
                              {it.addOns.map((a: any) => (
                                <li key={a.id}>{a.name} (+${Number(a.price || 0).toFixed(2)})</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 font-semibold">${Number(o.total || 0).toFixed(2)}</td>
                  <td className="border px-2 py-1">
                    <select
                      value={o.status || "☕ Received"}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
