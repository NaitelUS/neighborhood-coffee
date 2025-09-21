import { useState } from "react";

type Order = {
  orderNo: number;
  name: string;
  email: string;
  total: number;
  status: string;
};

const sampleOrders: Order[] = [
  { orderNo: 1, name: "Julio Mendez", email: "jcmendez@naitel.com", total: 12.5, status: "Received" },
  { orderNo: 2, name: "Ana Lopez", email: "ana@example.com", total: 8.0, status: "In Process" },
];

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const handleLogin = () => {
    if (password === "coffeeadmin") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const updateStatus = (orderNo: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderNo === orderNo ? { ...order, status: newStatus } : order
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#1D9099] hover:bg-[#00454E] text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Order No</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNo} className="hover:bg-gray-50">
              <td className="p-2 border">{order.orderNo}</td>
              <td className="p-2 border">{order.name}</td>
              <td className="p-2 border">{order.email}</td>
              <td className="p-2 border">${order.total.toFixed(2)}</td>
              <td className="p-2 border">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.orderNo, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Received</option>
                  <option>In Process</option>
                  <option>Ready for Pickup</option>
                  <option>Delivering</option>
                  <option>Completed</option>
                  <option>Canceled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
