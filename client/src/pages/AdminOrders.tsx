import { useEffect, useState } from "react";

const STATUSES = [
  "Received",
  "In Process",
  "On the Way",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Verificación de contraseña al entrar
  useEffect(() => {
    const pwd = prompt("Enter admin password:");
    if (pwd === "coffee123") {
      setIsAuthorized(true);
      const stored = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(stored);
    } else {
      alert("Unauthorized");
      window.location.href = "/";
    }
  }, []);

  const updateStatus = (orderNo: number, newStatus: string) => {
    const updatedOrders = orders.map((o) =>
      o.orderNo === orderNo ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  if (!isAuthorized) return null;

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
            {orders.map((order) => (
              <tr key={order.orderNo}>
                <td className="border px-2 py-1">{order.orderNo}</td>
                <td className="border px-2 py-1">
                  {order.customer.name} <br />
                  {order.customer.phone}
                </td>
                <td className="border px-2 py-1">
                  <ul>
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.quantity}x {item.temperature} {item.drinkName}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1">${order.total.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.orderNo, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
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
