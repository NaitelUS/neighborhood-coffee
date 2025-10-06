import React, { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const DELIVERY_PASSWORD = "delivery2025!";

  const handleLogin = () => {
    if (passwordInput === DELIVERY_PASSWORD) {
      localStorage.setItem("deliveryAuth", "true");
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("deliveryAuth") === "true") setAuthenticated(true);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      const filtered = data
        .filter(
          (o: any) =>
            o.order_type?.toLowerCase() === "delivery" &&
            ["Ready", "Out for Delivery"].includes(o.status)
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.schedule_date + " " + b.schedule_time).getTime() -
            new Date(a.schedule_date + " " + a.schedule_time).getTime()
        );
      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
    }
  };

  useEffect(() => {
    if (authenticated) fetchOrders();
  }, [authenticated]);

  const handleComplete = async (orderId: string) => {
    if (!window.confirm("Mark this order as completed?")) return;
    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "Completed" }),
      });
      if (res.ok) setOrders((prev) => prev.filter((o) => o.id !== orderId));
      else alert("Error updating order");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!authenticated)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl font-semibold mb-3">Delivery Access</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border p-2 rounded mb-2 w-64 text-center"
        />
        <button
          onClick={handleLogin}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">🚚 Delivery Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No delivery orders available</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <h2 className="font-bold text-xl text-gray-800 mb-1">
                #{o.id} — 💲{Number(o.total).toFixed(2)}
              </h2>
              <p className="text-gray-700 text-lg font-semibold mb-1">
                👤 {o.name}
              </p>
              <p className="text-gray-700 mb-1">📞 {o.phone}</p>
              {o.address && <p className="text-gray-600 mb-1">🏠 {o.address}</p>}
              <p className="text-gray-800 mt-2 font-medium">
                🕓 {formatDateTime(o.schedule_date, o.schedule_time)}
              </p>
              {o.notes && (
                <p className="text-sm text-gray-600 mt-1">📝 {o.notes}</p>
              )}
              <button
                onClick={() => handleComplete(o.id)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                ✅ Mark as Completed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
