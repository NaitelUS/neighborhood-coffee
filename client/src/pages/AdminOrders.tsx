import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [auth, setAuth] = useState(false);
  const password = "coffee123";

  useEffect(() => {
    const allOrders: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("order-")) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          allOrders.push({ ...parsed, id: key });
        }
      }
    }
    setOrders(allOrders);
  }, []);

  if (!auth) {
    return (
      <div className="p-6">
        <input
          type="password"
          placeholder="Enter password"
          id="admin-pass"
          className="border rounded p-2"
        />
        <button
          className="ml-2 bg-[#1D9099] text-white px-4 py-2 rounded"
          onClick={() => {
            const input = (document.getElementById("admin-pass") as HTMLInputElement).value;
            if (input === password) setAuth(true);
            else alert("Incorrect password");
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
        <p>No orders found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border">
                <td className="p-2 border">{order.orderNo}</td>
                <td className="p-2 border">{order.info?.name}</td>
                <td className="p-2 border">
                  {order.items.map((item: any, i: number) => (
                    <div key={i}>
                      {item.quantity}x {item.name} ({item.temperature})
                    </div>
                  ))}
                </td>
                <td className="p-2 border font-bold">${order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
