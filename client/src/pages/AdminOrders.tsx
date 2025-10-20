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
  items?: any[];
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightedOrders, setHighlightedOrders] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const lastOrderIds = useRef<string[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") navigate("/admin");
  }, [navigate]);

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

      // 🔔 Sonido y animación para nuevas órdenes
      const newReceived = normalized.filter(
        (o) =>
          o.Status === "Received" &&
          !lastOrderIds.current.includes(o.id)
      );

      if (newReceived.length > 0) {
        const sound = new Audio("/sounds/new-order.mp3");
        sound.play().catch(() => {});
        setHighlightedOrders(newReceived.map((o) => o.id));

        // 🪄 Mostrar toast
        const firstNew = newReceived[0];
        showToast(
          `🆕 New order received! ${firstNew.orderID || ""} — ${firstNew.name} (${firstNew.OrderType})`
        );

        setTimeout(() => setHighlightedOrders([]), 4000);
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

  const filterOrders = (order: Order) => {
    if (hideCompleted && ["Completed", "Cancelled"].includes(order.Status))
      return false;
    if (activeStatuses.length > 0 && !activeStatuses.includes(order.Status))
      return false;
    return true;
  };

  const orderStatusOrder = [
    "Received",
    "In Process",
    "Ready",
    "Out for Delivery",
    "Completed",
    "Cancelled",
  ];

  const filteredOrders = orders.filter(filterOrders);

  const timeSince = (order: Order) => {
    const dateStr = order.Date || order.schedule_date;
    const timeStr = order.schedule_time || "";
    if (!dateStr) return "";
    const orderDate = new Date(`${dateStr} ${timeStr}`);
    const diffMs = Date.now() - orderDate.getTime();
    const mins = Math.floor(diffMs / 60000);
    return mins < 1 ? "just now" : `${mins} min ago`;
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="relative p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
        ☕ Orders Dashboard
      </h1>

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

      {/* 🔄 Botones de control */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={fetchOrders}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            isRefreshing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isRefreshing ? "Refreshing..." : "🔄 Refresh now"}
        </button>

        <button
          onClick={() => setHideCompleted((prev) => !prev)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          {hideCompleted
            ? "Show Completed / Cancelled"
            : "Hide Completed / Cancelled"}
        </button>
      </div>

      {/* 🧾 Órdenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No orders match selected filters.
          </p>
        )}

        {filteredOrders.map((o) => {
          const icon = o.OrderType === "Pickup" ? "🚶‍♂️" : "📦";
          const next = nextStatus(o);
          const isHighlighted = highlightedOrders.includes(o.id);

          return (
            <div
              key={o.id}
              className={`p-4 bg-white rounded-lg shadow border border-gray-200 transition-all duration-500 ${
                isHighlighted ? "animate-pulse ring-2 ring-green-400" : ""
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">
                  {icon} {o.OrderType}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeColor(
                    o.Status
                  )}`}
                >
                  {o.Status}
                </span>
              </div>

              <p className="font-semibold text-lg text-green-700">{o.name}</p>
              {o.phone && (
                <p className="text-gray-500 text-sm mb-2">📞 {o.phone}</p>
              )}

              <p className="text-xs text-gray-400 italic mb-2">
                🕒 Placed {timeSince(o)}
              </p>

              {o.items && o.items.length > 0 && (
                <div className="text-sm mb-2">
                  {o.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name}
                      {item.addons && item.addons.length > 0 && (
                        <ul className="ml-4 text-xs list-disc text-gray-500">
                          {item.addons.map((a: string, i: number) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <hr className="my-2" />
              <div className="text-gray-700 text-sm">
                <p>Subtotal: ${o.subtotal?.toFixed(2) || "0.00"}</p>
                {o.discount && o.discount > 0 && (
                  <p>Discount: {(o.discount * 100).toFixed(0)}%</p>
                )}
                <p className="font-bold">
                  Total: ${o.total?.toFixed(2) || "0.00"}
                </p>
              </div>

              {next && (
                <button
                  onClick={() => updateStatus(o.id, next)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-semibold"
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

      {/* 🍞 Toast notification */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out">
          {toast.message}
        </div>
      )}

      <style>
        {`
          @keyframes fade-in-out {
            0% { opacity: 0; transform: translateY(10px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
          }
          .animate-fade-in-out {
            animation: fade-in-out 4s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
