import React, { useEffect, useState } from "react";

export default function AdminOrders() {
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin2025!";

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setAuthenticated(true);
      fetchOrders();
    } else alert("Incorrect password");
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.schedule_date + " " + b.schedule_time).getTime() -
          new Date(a.schedule_date + " " + a.schedule_time).getTime()
      );
      setOrders(sorted);
      applyFilter(filter, sorted);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 20000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });

      const result = await res.json();
      if (!result.success) throw new Error("Failed");

      const updated = orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
      setOrders(updated);
      applyFilter(filter, updated);
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  };

  const applyFilter = (status: string, data = orders) => {
    if (status === "All") setFilteredOrders(data);
    else setFilteredOrders(data.filter((o) => o.status === status));
  };

  useEffect(() => applyFilter(filter), [filter, orders]);

  if (!authenticated)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Barista Access
        </h2>
        <input
          type="password"
          placeholder="Enter admin password"
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
      <h1 className="text-2xl font-bold text-center text-teal-700 mb-4">
        ☕ Barista Orders Panel
      </h1>

      {/* Filtro */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {["All", "Received", "In Progress", "Ready", "Out for Delivery", "Completed", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === status
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Cards */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Order No: {o.order_number || o.id}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                Current Status: <strong>{o.status}</strong>
              </p>

              <p className="text-xl font-semibold text-gray-800 mb-1">
                {o.name}
              </p>

              <p className="text-gray-700 font-medium mb-1">
                {o.order_type}
              </p>

              <p className="text-gray-600 mb-3 font-medium">
                {formatDateTime(o.schedule_date, o.schedule_time)}
              </p>

              {o.items && o.items.length > 0 ? (
                <div className="border-t border-b border-gray-300 py-3 mb-3">
                  {o.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-lg font-semibold mb-2">
                      {item.product_name}
                      {item.option && (
                        <span className="text-gray-600 ml-2 text-base">
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
              ) : (
                <p className="text-gray-500 italic mb-3">(No items found)</p>
              )}

              <div className="text-sm text-gray-700 mb-4 space-y-1">
                {o.notes && <p>📝 Notes: {o.notes}</p>}
                {o.phone && <p>📞 {o.phone}</p>}
                {o.address && <p>🏠 {o.address}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(o.id, "Received")}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
                >
                  📦 Received
                </button>
                <button
                  onClick={() => updateStatus(o.id, "In Progress")}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
                >
                  ☕ In Progress
                </button>
                <button
                  onClick={() => updateStatus(o.id, "Ready")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                  ✅ Ready
                </button>
                {o.order_type === "Delivery" && (
                  <button
                    onClick={() => updateStatus(o.id, "Out for Delivery")}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold"
                  >
                    🚚 Out for Delivery
                  </button>
                )}
                <button
                  onClick={() => updateStatus(o.id, "Completed")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                >
                  🎉 Completed
                </button>
                <button
                  onClick={() => updateStatus(o.id, "Cancelled")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  ❌ Cancelled
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
