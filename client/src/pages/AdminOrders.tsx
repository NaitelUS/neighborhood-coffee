import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // 🎨 Paleta de estados coherente con TNC
  const statusColors: Record<string, string> = {
    Received: "bg-[#1D9099]",
    "In Process": "bg-yellow-500",
    Ready: "bg-[#00454E]",
    "Out for Delivery": "bg-purple-600",
    Completed: "bg-gray-500",
    Cancelled: "bg-red-600",
  };

  // ⏰ Fecha/hora local
  const [now, setNow] = useState(dayjs().format("MMM D, YYYY h:mm A"));
  useEffect(() => {
    const timer = setInterval(
      () => setNow(dayjs().format("MMM D, YYYY h:mm A")),
      60000
    );
    return () => clearInterval(timer);
  }, []);

  // 🔁 Fetch de órdenes cada 10 s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Función segura y tolerante
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/orders-get");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      const ordersArray = Array.isArray(data)
        ? data
        : Array.isArray(data.records)
        ? data.records
        : [];

      // 🔔 Detectar nuevas órdenes
      if (orders.length && ordersArray.length > orders.length) {
        soundRef.current?.play();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setOrders(ordersArray);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ Cambiar estado de orden
  const updateOrderStatus = async (order: any, next: string) => {
    try {
      const res = await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: next }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, Status: next } : o))
        );
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* 🔈 Sonido para nuevas órdenes */}
      <audio ref={soundRef} src="/sounds/new-order.mp3" preload="auto" />

      <div className="max-w-5xl mx-auto px-4 mt-6 pb-24 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#00454E] mb-2">
          Orders Dashboard
        </h1>
        <p className="text-gray-600 font-medium mb-6">
          {now} •{" "}
          <span className="font-semibold text-[#00454E]">{orders.length}</span>{" "}
          total orders
        </p>

        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No orders found.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className={`p-5 rounded-xl shadow-md bg-white border-l-8 transition-all duration-300 ${statusColors[order.Status] || "border-gray-300"}`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[#00454E]">
                    {order.Customer || order.fields?.Customer || "Unnamed"}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      statusColors[order.Status] || "bg-gray-400"
                    }`}
                  >
                    {order.Status || order.fields?.Status || "Received"}
                  </span>
                </div>

                <p className="text-gray-700 mt-2">
                  {order.Items || order.fields?.Items || "No details"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.Timestamp ||
                    order.fields?.Timestamp ||
                    dayjs(order.createdTime).format("MMM D, h:mm A")}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-bold text-[#00454E]">
                    ${order.Total || order.fields?.Total || "—"}
                  </p>

                  <div className="flex gap-2">
                    {order.Status === "Received" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order, "In Process")
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
                      >
                        Start
                      </button>
                    )}
                    {order.Status === "In Process" && (
                      <button
                        onClick={() => updateOrderStatus(order, "Ready")}
                        className="bg-[#1D9099] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
                      >
                        Ready
                      </button>
                    )}
                    {order.Status === "Ready" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order, "Completed")
                        }
                        className="bg-[#00454E] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
