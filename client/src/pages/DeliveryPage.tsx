import React, { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // 🧠 Formatear fecha corta
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();

      // 🎯 Filtrar solo órdenes de tipo Delivery y estados válidos
      const filtered = data.filter(
        (o: any) =>
          o.order_type === "Delivery" &&
          ["Ready", "Out for Delivery"].includes(o.status)
      );

      setOrders(filtered);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchOrders();
      let interval: any;
      if (autoRefresh) {
        interval = setInterval(fetchOrders, 30000);
      }
      return () => interval && clearInterval(interval);
    }
  }, [loggedIn, autoRefresh]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🧠 Ordenar pedidos: “Today” primero
  const sortedOrders = [...orders].sort((a, b) => {
    const today = new Date().toISOString().split("T")[0];
    const isTodayA = a.schedule_date === today;
    const isTodayB = b.schedule_date === today;
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    return (
      new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime()
    );
  });

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🚚 Delivery Login
        </h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-lg mb-3 w-64 text-center"
        />
        <button
          onClick={() => {
            if (password === "delivery2025!") setLoggedIn(true);
            else alert("Incorrect password");
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
        🚚 Delivery Orders
      </h1>

      {/* 🔁 Auto-refresh control */}
      <div className="flex justify-center items-center gap-2 mb-4">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
            className="w-4 h-4 accent-teal-600 cursor-pointer"
          />
          🔁 Auto-refresh
        </label>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            (Last updated {lastUpdated})
          </span>
        )}
      </div>

      {/* ⚠️ Banner si está pausado */}
      {!autoRefresh && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 text-center mb-4 shadow-sm">
          ⚠️ Auto-refresh is currently paused — new orders won’t appear automatically.
        </div>
      )}

      {/* 🚚 Contador principal */}
      {(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayDeliveries = orders.filter((o) => o.schedule_date === today);
        const futureDeliveries = orders.filter((o) => o.schedule_date > today);
        const todayCount = todayDeliveries.length;
        const futureCount = futureDeliveries.length;

        if (todayCount === 0 && futureCount === 0) return null;

        const formatToday = new Date(today).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div className="text-center mb-5">
            <p className="text-2xl font-bold text-green-700 flex justify-center items-center gap-2">
              🚚 {todayCount > 0 ? todayCount : "No"}{" "}
              {todayCount === 1 ? "Delivery" : "Deliveries"} Today
            </p>
            <p className="text-gray-600 text-sm mb-1">{formatToday}</p>
            {futureCount > 0 && (
              <p className="text-sm text-teal-700 font-medium flex justify-center items-center gap-1">
                📅 {futureCount} Scheduled{" "}
                {futureCount === 1 ? "Delivery" : "Deliveries"}
              </p>
            )}
          </div>
        );
      })()}

      {/* 📋 Lista */}
      <div className="space-y-5">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-sm"
          >
            <p className="font-semibold text-lg text-gray-800 flex items-center justify-between">
              👤 {order.name}
              {order.schedule_date === new Date().toISOString().split("T")[0] && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  ⭐ Today
                </span>
              )}
            </p>

            <p className="text-gray-600">📞 {order.phone}</p>
            {order.address && (
              <p className="text-gray-700 mt-1">📍 {order.address}</p>
            )}

            <div
              className={`mt-3 mb-2 rounded-lg p-3 text-center shadow-sm border ${
                order.schedule_date === new Date().toISOString().split("T")[0]
                  ? "bg-green-50 border-green-300"
                  : "bg-teal-50 border-teal-200"
              }`}
            >
              <p className="text-gray-800 font-semibold mb-1">🕓 Schedule</p>
              <p className="text-gray-800 font-medium">
                {formatDate(order.schedule_date)}
              </p>
              <p className="text-gray-800 font-medium">
                {order.schedule_time || "Not specified"}
              </p>
            </div>

            <div className="border-t pt-2 text-gray-700">
              {order.items?.map((item: any, i: number) => (
                <p key={i} className="text-gray-800">
                  ☕ {item.ProductName}
                  {item.Option && (
                    <span className="text-gray-500"> ({item.Option})</span>
                  )}
                  {item.AddOns && (
                    <span className="block text-sm text-gray-500 ml-4">
                      ➕ {item.AddOns}
                    </span>
                  )}
                </p>
              ))}
            </div>

            <p className="font-bold text-lg text-green-700 mt-2">
              💵 Total: ${order.total.toFixed(2)}
            </p>

            <button
              onClick={() => updateStatus(order.id, "Completed")}
              className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold"
            >
              ✅ Mark as Completed
            </button>
          </div>
        ))}

        {sortedOrders.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No deliveries available.
          </p>
        )}
      </div>
    </div>
  );
}
