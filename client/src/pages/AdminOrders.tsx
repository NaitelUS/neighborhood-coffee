import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  name: string;
  phone: string;
  order_type: string;
  total: number;
  status: string;
  schedule_date: string;
  schedule_time: string;
  notes?: string;
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Autenticación mínima
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") navigate("/admin");
  }, [navigate]);

  // Cargar órdenes
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/.netlify/functions/orders-get");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
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
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">
        ☕ Orders Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <div key={o.id} className="p-4 bg-white rounded shadow border">
            <h2 className="font-bold text-lg mb-1">
              #{o.id} – {o.name}
            </h2>
            <p className="text-sm text-gray-700">
              {o.order_type} | {o.schedule_date} {o.schedule_time}
            </p>
            <p className="text-sm text-gray-600">📞 {o.phone}</p>
            <p className="mt-2 font-semibold">${o.total.toFixed(2)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Received", "In Process", "Ready", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o.id, s)}
                  className={`px-2 py-1 rounded text-xs border ${
                    o.status === s
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
