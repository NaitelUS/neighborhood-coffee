import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!authorized) {
      const pass = prompt("Enter password:");
      if (pass === "coffee123") {
        setAuthorized(true);
        const storedOrders: any[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("order-")) {
            const order = JSON.parse(localStorage.getItem(key) || "{}");
            storedOrders.push({ id: key.replace("order-", ""), ...order });
          }
        }
        setOrders(storedOrders);
      }
    }
  }, [authorized]);

  const updateStatus = (id: string, status: string) => {
    const key = `order-${id}`;
    const order = JSON.parse(localStorage.getItem(key) || "{}");
    if (order) {
      order.status = status;
      localStorage.setItem(key, JSON.stringify(order));
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  };

  if (!authorized) return <p className="p-6">Unauthorized</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order #</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border px-2 py-1">{o.id}</td>
                <td className="border px-2 py-1">{o.info?.name}</td>
                <td className="border px-2 py-1">${o.total.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  <select
                    value={o.status || "Received"}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option>Received</option>
                    <option>In Process</option>
                    <option>On the Way</option>
                    <option>Ready for Pickup</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
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
