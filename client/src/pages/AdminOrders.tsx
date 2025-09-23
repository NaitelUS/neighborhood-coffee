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

  // Pedir contraseña
  useEffect(() => {
    const pass = prompt("Enter admin password:");
    if (pass === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password.");
      window.location.href = "/";
    }
  }, []);

  // Cargar todas las órdenes desde localStorage
  useEffect(() => {
    if (authenticated) {
      const allOrders: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("order-")) {
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              allOrders.push({ ...parsed, id: key.replace("order-", "") });
            } catch (err) {
              console.error("Error parsing order:", err);
            }
          }
        }
      }
      setOrders(allOrders);
    }
  }, [authenticated]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const saved = localStorage.getItem(`order-${orderId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.status = newStatus;
      localStorage.setItem(`order-${orderId}`, JSON.stringify(parsed));
    }
  };

  if (!authenticated) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border px-2 py-1">{order.id}</td>
                  <td className="border px-2 py-1">
                    {order.info?.name} <br />
                    <span className="text-sm text-gray-600">
                      {order.info?.phone}
                    </span>
                  </td>
                  <td className="border px-2 py-1 text-sm">
                    <ul className="list-disc ml-4">
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx}>
                          {item.quantity}× {item.name}{" "}
                          {item.temperature && `(${item.temperature})`}
                          {item.option && ` - ${item.option}`}
                          {item.addOns?.length > 0 && (
                            <ul className="ml-4 list-disc text-xs text-gray-700">
                              {item.addOns.map((a: any) => (
                                <li key={a.id}>
                                  {a.name} (+${a.price.toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 font-semibold">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      value={order.status || "☕ Received"}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
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
        </div>
      )}
    </div>
  );
}
