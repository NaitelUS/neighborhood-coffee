import React, { useState, useEffect } from "react";

// 🗓️ Formatear fecha corta (incluye año si es diferente)
const formatDate = (dateString?: string) => {
  if (!dateString) return "No Date";
  const date = new Date(dateString);
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  if (date.getFullYear() !== today.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString("en-US", options);
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      setOrders(data);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(fetchOrders, 30000);
    }
    return () => interval && clearInterval(interval);
  }, [autoRefresh]);

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

  // 🧠 Ordenar primero los pedidos de hoy
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        ☕ Admin Orders
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
          ⚠️ Auto-refresh is currently paused — new orders won’t appear
          automatically.
        </div>
      )}

      {/* ☕ Resumen del día */}
      {(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = orders.filter((o) => o.schedule_date === today);
        const futureOrders = orders.filter((o) => o.schedule_date > today);
        const todayCount = todayOrders.length;
        const futureCount = futureOrders.length;

        if (todayCount === 0 && futureCount === 0) return null;

        const formatToday = new Date(today).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-green-700 flex justify-center items-center gap-2">
              ☕ {todayCount > 0 ? todayCount : "No"}{" "}
              {todayCount === 1 ? "Order" : "Orders"} Today
            </p>
            <p className="text-gray-600 text-sm mb-1">{formatToday}</p>
            {futureCount > 0 && (
              <p className="text-sm text-teal-700 font-medium flex justify-center items-center gap-1">
                📅 {futureCount} Scheduled{" "}
                {futureCount === 1 ? "Order" : "Orders"}
              </p>
            )}
          </div>
        );
      })()}

      {/* 📋 Lista de órdenes */}
      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="p-5 bg-white shadow-md rounded-xl border border-gray-200"
          >
            {/* 🔢 ID */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              #{order.id}
            </h2>

            {/* 🕓 Fecha / hora */}
            <div
              className={`mt-3 mb-3 rounded-lg p-3 text-center shadow-sm border ${
                order.schedule_date === new Date().toISOString().split("T")[0]
                  ? "bg-green-50 border-green-300"
                  : "bg-teal-50 border-teal-200"
              }`}
            >
              <p className="font-semibold mb-1 flex items-center justify-center gap-1 text-gray-800">
                {order.schedule_date === new Date().toISOString().split("T")[0]
                  ? "⭐ Today’s Order"
                  : `🕓 ${
                      order.order_type === "Delivery"
                        ? "Delivery"
                        : "Pickup"
                    } Schedule`}
              </p>

              <p className="text-gray-800 font-medium">
                {formatDate(order.schedule_date)}
              </p>
              <p className="text-gray-800 font-medium">
                {order.schedule_time || "Not Scheduled"}
              </p>
            </div>

            {/* ☕ Items */}
            {order.items && order.items.length > 0 && (
              <div className="mt-2">
                <ul className="space-y-2 text-gray-900">
                  {order.items.map((item: any, i: number) => (
                    <li key={i}>
                      <p className="text-lg font-semibold">
                        ☕ {item.ProductName}
                        {item.Option && (
                          <span className="text-gray-500">
                            {" "}
                            ({item.Option})
                          </span>
                        )}
                      </p>
                      {item.AddOns && (
                        <p className="text-sm text-gray-600 ml-4">
                          ➕ {item.AddOns}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 👤 Cliente + badge */}
            <p className="text-lg font-bold text-gray-700 mt-4 text-center flex items-center justify-center gap-2">
              👤 {order.name}
              {order.schedule_date ===
                new Date().toISOString().split("T")[0] && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  ⭐ Today
                </span>
              )}
            </p>

            {/* 💵 Total */}
            <div className="text-center mt-2 text-gray-600">
              <p>⏰ {order.schedule_time || "N/A"}</p>
              <p className="font-semibold text-green-700">
                💲{Number(order.total).toFixed(2)}
              </p>
            </div>

            {/* 🏷️ Estado */}
            <p className="text-center mt-2">
              <span
                className={`font-bold ${
                  order.status === "Ready"
                    ? "text-green-600"
                    : order.status === "In Process"
                    ? "text-blue-600"
                    : "text-amber-600"
                }`}
              >
                {order.status}
              </span>
            </p>

            {/* 🔘 Botones */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {["Received", "In Process", "Ready", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  className={`px-2 py-1 rounded text-xs font-semibold border ${
                    order.status === s
                      ? "bg-amber-600 text-white"
                      : "hover:bg-amber-100 border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
