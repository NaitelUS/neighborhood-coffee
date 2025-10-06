import React, { useEffect, useState } from "react";

interface OrderItem {
  ProductName: string;
  Option?: string;
  Price: number;
  AddOns?: string;
}

interface Order {
  id: string;
  name: string;
  phone: string;
  order_type: string;
  total: number;
  status: string;
  schedule_time: string;
  created_at: string;
  items?: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // 🔁 Obtener órdenes (con items)
  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();

      // Agrupamos items por ID si vienen mezclados
      const grouped = data.map((o: any) => ({
        id: o.id,
        name: o.name,
        phone: o.phone,
        order_type: o.order_type,
        total: o.total,
        status: o.status,
        schedule_time: o.schedule_time,
        created_at: o.created_at,
        items: o.items || [], // ← asegúrate de que orders-get devuelva items[]
      }));

      setOrders(grouped);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Actualizar estatus
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/.netlify/functions/orders-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, fields: { status: newStatus } }),
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🕒 Auto-refresh cada 30 segundos
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">☕ Active Orders</h1>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            🔄 Last updated at {lastUpdated}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No active orders</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white shadow-sm rounded-lg border border-gray-200"
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-1">
                {order.name}
              </h2>
              <p className="text-sm text-gray-600">
                📞 {order.phone || "N/A"} — {order.order_type}
              </p>
              <p className="text-sm text-gray-600">
                ⏰ {order.schedule_time || "Not Scheduled"}
              </p>
              <p className="text-sm text-gray-600">
                💲 Total: ${order.total.toFixed(2)}
              </p>

              {/* 🧾 Productos */}
              {order.items && order.items.length > 0 && (
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Items:
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        • {item.ProductName}
                        {item.Option && (
                          <span className="text-gray-500">
                            {" "}
                            ({item.Option})
                          </span>
                        )}
                        {item.AddOns && (
                          <div className="ml-4 text-xs text-gray-500">
                            ➕ {item.AddOns}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🏷️ Estado */}
              <p className="text-sm mt-3">
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

              {/* 🔘 Botones de estado */}
              <div className="flex flex-wrap gap-2 mt-3">
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
      )}
    </div>
  );
}
