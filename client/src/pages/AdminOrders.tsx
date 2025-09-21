import { useState, useEffect } from "react";

interface Order {
  orderNo: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: string[];
  total: number;
  status: string;
}

const PASSWORD = "barista123"; // ⚠️ cambiar cuando gustes

export default function AdminOrders() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleLogin = () => {
    if (inputPassword === PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  const updateStatus = (orderNo: number, newStatus: string) => {
    const updated = orders.map((o) =>
      o.orderNo === orderNo ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Enter password"
          className="border p-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded"
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
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order No</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNo}>
                <td className="border p-2">{order.orderNo}</td>
                <td className="border p-2">
                  <div>{order.customer.name}</div>
                  <div>{order.customer.email}</div>
                  <div>{order.customer.phone}</div>
                  {order.customer.address && <div>{order.customer.address}</div>}
                </td>
                <td className="border p-2">
                  <ul>
                    {order.items.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">${order.total.toFixed(2)}</td>
                <td className="border p-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.orderNo, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Received">Received</option>
                    <option value="In Process">In Process</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="On the Way">On the Way</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
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
