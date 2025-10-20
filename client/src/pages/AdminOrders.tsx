import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

interface Order {
  id: string;
  orderID: string;
  name: string;
  total: number;
  status: string;
  order_type: string;
  schedule_date?: string;
  schedule_time?: string;
  coupon?: string;
}

const statusColors: Record<string, string> = {
  Received: "bg-green-600",
  "In Process": "bg-yellow-500",
  Ready: "bg-blue-600",
  "Out for Delivery": "bg-purple-600",
  Completed: "bg-gray-700",
  Cancelled: "bg-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/.netlify/functions/orders-get");
      const data = await response.json();

      // Normaliza estructura según el nuevo backend
      const normalized = data.map((o: any) => ({
        id: o.id,
        orderID: o.orderID || "",
        name: o.name || "Unknown",
        total: o.total || 0,
        status: o.status || "Received",
        order_type: o.order_type || "Pickup",
        schedule_date: o.schedule_date || "",
        schedule_time: o.schedule_time || "",
        coupon: o.coupon || "",
      }));

      // Detecta nuevas órdenes (Received)
      if (orders.length > 0) {
        const newOnes = normalized.filter(
          (n: Order) =>
            n.status === "Received" &&
            !orders.some((o) => o.id === n.id)
        );
        if (newOnes.length > 0 && soundRef.current) {
          soundRef.current.play().catch(() => {});
        }
      }

      setOrders(normalized);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // auto-refresh cada 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (order: Order) => {
    try {
      const next =
        order.status === "Received"
          ? "In Process"
          : order.status === "In Process"
          ? order.order_type === "Pickup"
            ? "Ready"
            : "Out for Delivery"
          : order.status === "Ready" || order.status === "Out for Delivery"
          ? "Completed"
          : "Completed";

      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        body: JSON.stringify({ id: order.id, status: next }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter((o) => o.status === selectedStatus)
    : orders;

  const sortedOrders = filteredOrders.sort((a, b) => {
    const order = [
      "Received",
      "In Process",
      "Ready",
      "Out for Delivery",
      "Completed",
      "Cancelled",
    ];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  const now = dayjs().format("dddd, MMMM D, YYYY [at] hh:mm A");

  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <audio ref={soundRef} src="/sounds/new-order.mp3" preload="auto" />
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={fetchOrders}
          className="text-teal-700 text-xl hover:text-teal-900"
          title="Refresh"
        >
          🔄
        </button>
        <p className="text-gray-600 font-medium">
          Today is:{" "}
          <span className="font-semibold text-teal-700">{now}</span>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          "Received",
          "In Process",
          "Ready",
          "Out for Delivery",
          "Completed",
          "Cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() =>
              setSelectedStatus(selectedStatus === status ? null : status)
            }
            className={`px-4 py-2 rounded-full text-white font-semibold text-sm ${
              selectedStatus === status
                ? statusColors[status]
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : sortedOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          No orders match selected filters.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono bg-teal-800 text-white px-3 py-1 rounded-full">
                  {order.orderID}
                </span>
                <span
                  className={`text-xs text-white px-3 py-1 rounded-full ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {order.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                {order.order_type === "Pickup" ? "🏠 Pickup" : "🚚 Delivery"}{" "}
                • {order.schedule_time || "ASAP"}
              </p>

              <div className="text-sm text-gray-700 font-medium">
                <p>Total: ${order.total.toFixed(2)}</p>
                {order.coupon && (
                  <p className="text-xs text-gray-500">
                    Coupon: {order.coupon}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleUpdateStatus(order)}
                className="mt-4 w-full py-2 text-white font-semibold rounded-lg"
                style={{ backgroundColor: "#00454E" }}
              >
                {order.status === "Received"
                  ? "Set In Process"
                  : order.status === "In Process"
                  ? order.order_type === "Pickup"
                    ? "Mark as Ready"
                    : "Out for Delivery"
                  : order.status === "Ready" ||
                    order.status === "Out for Delivery"
                  ? "Mark Completed"
                  : "Completed"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
