import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  name: string;
  phone: string;
  OrderType: string; // Pickup / Delivery
  Status: string;
  total: number;
  subtotal?: number;
  discount?: number;
  coupon?: string;
  Date?: string;
  items?: any[];
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(true);
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

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      if (!Array.isArray(data)) return;

      // 🔔 sonido para nuevas órdenes recibidas
      const newReceived = data.filter(
        (o) =>
          o.Status === "Received" &&
          !lastOrderIds.current.includes(o.id)
      );
      if (newReceived.length > 0) {
        const sound = new Audio("/sounds/new-order.mp3");
        sound.play().catch(() => {});
      }

      lastOrderIds.current = data.map((o) => o.id);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
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
    const type = order.OrderType;
    const status = order.Status;

    const pickupFlow = ["Received", "In Process", "Ready", "Completed"];
    const deliveryFlow = ["Received", "In Process", "Out for Delivery", "Completed"];

    const flow = type === "Delivery" ? deliveryFlow : pickupFlow;
    const currentIndex = flow.indexOf(status);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-600 text-white";
      case "In Process":
        return "bg-yellow-500 text-white";
      case "Ready":
      case "Out for Delivery":
        return "bg-blue-600 text-white";
      case "Completed":
        return "bg-gray-600 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const grouped = orders.reduce((acc: Record<string, Order[]>, order) => {
    if (hideCompleted && ["Completed", "Cancelled"].includes(order.Status)) return acc;
    const status = order.Status || "Unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {});

  const orderStatusOrder = [
    "Received",
    "In Process",
    "Ready",
    "Out for Delivery",
    "Completed",
    "Cancelled",
  ];

  const sortedGroups = orderStatusOrder
    .map((status) => ({ status, orders: grouped[status] || [] }))
    .filter((g) => g.orders.length > 0);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
        ☕ Orders Dashboard
      </h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setHideCompleted((prev) => !prev)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          {hideCompleted ? "Show Completed / Cancelled" : "Hide Completed / Cancelled"}
        </button>
      </div>

      {sortedGroups.map(({ status, orders }) => (
        <div key={status} className="mb-6">
          <h2
            className={`text-xl font-bold mb-3 px-3 py-1 rounded ${getBadgeColor(
              status
            )}`}
          >
            {status.toUpperCase()}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((o) => {
              const icon =
                o.OrderType === "Pickup" ? "🚶‍♂️" : "📦";
              const next = nextStatus(o);

              return (
                <div
                  key={o.id}
                  className="p-4 bg-white rounded-lg shadow border border-gray-200"
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

                  <p className="font-semibold text-lg text-green-700">
                    {o.name}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">📞 {o.phone}</p>

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
        </div>
      ))}
    </div>
  );
}
