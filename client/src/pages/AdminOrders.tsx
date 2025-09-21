// client/src/pages/AdminOrders.tsx
import { useState, useEffect } from "react";

type Order = {
  orderNo: number;
  customer: string;
  status: string;
};

const statusOptions = [
  { id: "received", label: "☕ Received" },
  { id: "inProcess", label: "👨‍🍳 In Process" },
  { id: "pickup", label: "🛍️ Ready for Pickup" },
  { id: "delivering", label: "🚗 On the Way" },
  { id: "completed", label: "✅ Completed" },
  { id: "canceled", label: "❌ Canceled" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Cargar del LocalStorage al iniciar
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // mock inicial
      setOrders([
        { orderNo: 1, customer: "Julio", status: "received" },
        { orderNo: 2, customer: "Ana", status: "inProcess" },
      ]);
    }
  }, []);

  // Guardar en LocalStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const updateStatus = (orderNo: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === orderNo ? { ...o, status: newStatus } : o
      )
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin - Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderNo}
            className="border p-4 rounded-lg bg-white shadow"
          >
            <h2 className="font-semibold">
              Order #{order.orderNo} - {order.customer}
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => updateStatus(order.orderNo, status.id)}
                  className={`px-3 py-2 rounded ${
                    order.status === status.id
                      ? "bg-[#1D9099] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
