import { useState, useEffect } from "react";

const statusOptions = [
  "received",
  "preparing",
  "ready",
  "delivering",
  "completed",
  "canceled",
];

export default function AdminOrders() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isAuth) {
      const stored = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(stored);
    }
  }, [isAuth]);

  const handleLogin = () => {
    if (password === "coffeeAdmin123") {
      setIsAuth(true);
    } else {
      alert("Wrong password");
    }
  };

  const updateStatus = (orderNo: number, status: string) => {
    const updated = orders.map((o) =>
      o.orderNo === orderNo ? { ...o, status } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleLogin}
            className="bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <h1 className="text-2xl font-serif font-bold mb-6 text-center">
        Admin Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-center">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order No</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNo} className="text-center">
                <td className="border p-2">{order.orderNo}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">${order.total.toFixed(2)}</td>
                <td className="border p-2 capitalize">{order.status}</td>
                <td className="border p-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.orderNo, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    {statusOptions.map((s) => (
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
