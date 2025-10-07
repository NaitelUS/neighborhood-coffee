import React, { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [passwordInput, setPasswordInput] = useState("");
  const DELIVERY_PASSWORD = import.meta.env.VITE_DELIVERY_PASSWORD || "delivery2025!";

  const handleLogin = () => {
    if (passwordInput === DELIVERY_PASSWORD) {
      localStorage.setItem("deliveryAuth", "true");
      setAuthenticated(true);
      fetchOrders();
    } else alert("Incorrect password");
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      const filtered = data.filter(
        (o: any) =>
          o.order_type === "Delivery" &&
          (o.status === "Ready" || o.status === "Out for Delivery")
      );
      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const completeOrder = async (orderId: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "Completed" }),
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  if (!authenticated)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Delivery Access
        </h2>
        <input
          type="password"
          placeholder="Enter delivery password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border p-2 rounded mb-2 w-64 text-center"
        />
        <button
          onClick={handleLogin}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-teal-700 mb-6">
        🚚 Delivery Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No deliveries available.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-1">
                Order No: {o.order_number || o.id}
              </h2>
              <p className="text-gray-700 mb-1">{o.name}</p>
              <p className="text-gray-600 mb-1">📞 {o.phone}</p>
              <p className="text-gray-600 mb-1">🏠 {o.address}</p>
              <p className="text-gray-600 mb-2">
                📅 {formatDateTime(o.schedule_date, o.schedule_time)}
              </p>

              {o.items && o.items.length > 0 && (
                <div className="border-t border-b border-gray-300 py-2 mb-2">
                  {o.items.map((item: any, i: number) => (
                    <div key={i} className="text-base font-medium">
                      {item.product_name}
                      {item.option && (
                        <span className="text-gray-600 ml-1 text-sm">
                          ({item.option})
                        </span>
                      )}
                      {item.addons && (
                        <p className="text-sm text-gray-600 ml-2">
                          + {item.addons}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => completeOrder(o.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                ✅ Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
