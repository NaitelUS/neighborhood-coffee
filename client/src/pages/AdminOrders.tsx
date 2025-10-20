import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  orderID?: string;
  name: string;
  phone?: string;
  OrderType: string;
  Status: string;
  total: number;
  subtotal?: number;
  discount?: number;
  coupon?: string;
  Date?: string;
  schedule_date?: string;
  schedule_time?: string;
  items?: { name: string; qty?: number; addons?: string[] }[];
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightedOrders, setHighlightedOrders] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const lastOrderIds = useRef<string[]>([]);

  // 🚪 Protección admin
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") navigate("/admin");
  }, [navigate]);

  // 🔄 Auto-refresh
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 4000);
  };

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const normalized = data.map((o) => ({
        id: o.id,
        orderID: o.orderID,
        name: o.name,
        phone: o.phone,
        OrderType: o.order_type || o.OrderType || "",
        Status: o.status || o.Status || "",
        total: o.total || 0,
        subtotal: o.subtotal || 0,
        discount: o.discount || 0,
        coupon: o.coupon || "",
        Date: o.schedule_date || o.Date || "",
        schedule_time: o.schedule_time || "",
        items: o.items || [],
      }));

      // 🔔 Nuevas órdenes
      const newReceived = normalized.filter(
        (o) => o.Status === "Received" && !lastOrderIds.current.includes(o.id)
      );

      if (newReceived.length > 0) {
        const sound = new Audio("/sounds/new-order.mp3");
        sound.play().catch(() => {});
        const firstNew = newReceived[0];
        showToast(
          `🆕 New order received! ${firstNew.orderID || ""} — ${firstNew.name} (${firstNew.OrderType})`
        );

        // 💚 Animación de parpadeo verde
        setHighlightedOrders(newReceived.map((o) => o.id));
        setTimeout(() => setHighlightedOrders([]), 3000);
      }

      lastOrderIds.current = normalized.map((o) => o.id);
      setOrders(normalized);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, Status: status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const nextStatus = (order: Order) => {
    const flow =
      order.OrderType === "Delivery"
        ? ["Received", "In Process", "Out for Delivery", "Completed"]
        : ["Received", "In Process", "Ready", "Completed"];
    const currentIndex = flow.indexOf(order.Status);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-600 text-white";
      case "In Process":
        return "bg-yellow-500 text-white";
      case "Ready":
        return "bg-blue-600 text-white";
      case "Out for Delivery":
        return "bg-indigo-500 text-white";
      case "Completed":
        return "bg-gray-600 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const toggleStatusFilter = (status: string) => {
    setActiveStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const orderStatusOrder = [
    "Received",
    "In Process",
    "Ready",
    "Out for Delivery",
    "Completed",
    "Cancelled",
  ];

  const filteredOrders = orders.filter(
    (o) =>
      (activeStatuses.length === 0 || activeStatuses.includes(o.Status)) &&
      !["Cancelled"].includes(o.Status)
  );

  const currentDateTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="relative p-4 max-w-6xl mx-auto">
      {/* 🗓️ Header superior */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={fetchOrders}
          disabled={isRefreshing}
          title="Refresh now"
          className={`text-2xl ${
            isRefreshing
              ? "text-gray-400 animate-spin"
              : "text-[#00454E] hover:text-[#02636d]"
          }`}
        >
          ♻️
        </button>
        <h1 className="text-lg font-medium text-gray-700 text-center flex-1">
          Today is:{" "}
          <span className="font-semibold text-[#00454E]">{currentDateTime}</span>
        </h1>
      </div>

      {/* 🔘 Filtros tipo pill */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {orderStatusOrder.map((status) => (
          <button
            key={status}
            onClick={() => toggleStatusFilter(status)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
              activeStatuses.includes(status)
                ? `${getBadgeColor(status)} border-transparent`
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 🧾 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No orders match selected filters.
          </p>
        )}

        {filteredOrders.map((o) => {
          const next = nextStatus(o);
          const isHighlighted = highlightedOrders.includes(o.id);

          return (
            <div
              key={o.id}
              className={`bg-white shadow-md rounded-xl p-5 border border-gray-200 flex flex-col justify-between transition-all duration-500 ${
                isHighlighted ? "animate-flash-green" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#00454E] text-white shadow-sm">
                  {o.orderID}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                    o.Status
                  )}`}
                >
                  {o.Status}
                </span>
              </div>

              <div className="flex items-center mb-2 text-[#00454E]">
                <span className="text-lg mr-2">👤</span>
                <p className="font-semibold text-lg leading-tight">{o.name}</p>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {o.OrderType === "Delivery" ? "🚚 Delivery" : "🏠 Pickup"}
              </p>

              {/* 🧺 Detalle */}
              {o.items && o.items.length > 0 && (
                <div className="text-left mb-3 mt-2">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="font-semibold text-[16px] text-[#00454E] leading-tight">
                        {item.qty && item.qty > 1
                          ? `${item.qty} × ${item.name}`
                          : item.name}
                      </p>
                      {item.addons && item.addons.length > 0 && (
                        <ul className="ml-6 mt-1 text-[14px] text-gray-600 list-disc">
                          {item.addons.map((a: string, i: number) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  <hr className="my-3" />
                  <div className="text-[14px] text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">Subtotal:</span>{" "}
                      ${o.subtotal?.toFixed(2) || "0.00"}
                    </p>
                    {o.discount && o.discount > 0 && (
                      <p>
                        <span className="font-semibold">Discount:</span>{" "}
                        {(o.discount * 100).toFixed(0)}%
                      </p>
                    )}
                    <p className="font-bold text-[15px] text-[#00454E]">
                      Total: ${o.total?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              )}

              {next && (
                <button
                  onClick={() => updateStatus(o.id, next)}
                  className="w-full py-2 mt-2 rounded-lg font-semibold text-white bg-[#00454E] hover:bg-[#00666F] transition-all"
                >
                  {next === "In Process" && "Set In Process"}
                  {next === "Ready" && "Mark Ready"}
                  {next === "Out for Delivery" && "Mark Out for Delivery"}
                  {next === "Completed" && "Mark Completed"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 🍞 Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 px-5 py-3 bg-[#00454E] text-white rounded-lg shadow-lg border border-green-300 text-sm animate-toast-glow">
          {toast.message}
        </div>
      )}

      {/* ✨ Animaciones */}
      <style>
        {`
          @keyframes flash-green {
            0%, 100% { background-color: white; }
            25%, 75% { background-color: #c7f9cc; }
            50% { background-color: #a8e6a1; }
          }
          .animate-flash-green {
            animation: flash-green 3s ease-in-out;
          }

          @keyframes toast-glow {
            0% { opacity: 0; box-shadow: 0 0 0px #6ee7b7; transform: translateY(10px); }
            10%, 90% { opacity: 1; box-shadow: 0 0 20px #6ee7b7; transform: translateY(0); }
            100% { opacity: 0; box-shadow: 0 0 0px #6ee7b7; transform: translateY(10px); }
          }
          .animate-toast-glow {
            animation: toast-glow 4s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
