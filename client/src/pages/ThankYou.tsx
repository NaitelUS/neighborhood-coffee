import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("id");

  // 🧠 Formatear fecha completa y legible (para cliente)
  const formatFullDate = (dateString?: string) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long", // Sunday
      month: "long", // October
      day: "numeric", // 5
      year: "numeric", // 2025
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/.netlify/functions/orders-get");
        const data = await res.json();
        const found = data.find((o: any) => o.id === orderId);
        setOrder(found);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="text-center mt-20 text-red-600">
        No order ID found in URL.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-600">
        Order not found. Please check your link.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl text-center">
      {/* 🎉 Encabezado */}
      <h1 className="text-2xl font-bold text-teal-700 mb-3">
        🎉 Your order has been received!
      </h1>

      {/* 🧾 ID */}
      <p className="text-gray-700 mb-4 font-mono">Order ID: {order.id}</p>

      {/* 🕓 Bloque de fecha/hora destacado */}
      <div className="mt-5 mb-6 bg-teal-50 rounded-xl border border-teal-200 shadow-sm p-4 text-left">
        <p className="text-teal-700 font-semibold mb-2 flex items-center gap-2">
          🕓 {order.order_type === "Delivery" ? "Delivery Schedule" : "Pickup Schedule"}
        </p>

        <p className="text-gray-800 font-medium">
          <strong>Date:</strong> {formatFullDate(order.schedule_date)}
        </p>

        <p className="text-gray-800 font-medium">
          <strong>Time:</strong> {order.schedule_time || "Not specified"}
        </p>
      </div>

      {/* ☕ Productos */}
      {order.items && order.items.length > 0 && (
        <div className="text-left border-t pt-3 space-y-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Items Ordered:
          </h2>
          <ul className="space-y-1">
            {order.items.map((item: any, i: number) => (
              <li key={i} className="text-gray-700">
                • {item.ProductName}
                {item.Option && (
                  <span className="text-gray-500"> ({item.Option})</span>
                )}
                {item.AddOns && (
                  <div className="text-sm text-gray-500 ml-5">
                    ➕ {item.AddOns}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 💵 Total */}
      <div className="text-gray-700 text-left border-t pt-3 mb-4">
        <p>
          <strong>Total:</strong> 💲{Number(order.total).toFixed(2)}
        </p>
      </div>

      {/* 👤 Cliente */}
      <div className="border-t pt-3 text-left">
        <p>
          <strong>Name:</strong> {order.name}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        {order.order_type === "Delivery" && order.address && (
          <p>
            <strong>Address:</strong> {order.address}
          </p>
        )}
      </div>

      {/* 🔍 Ver estatus */}
      <Link
        to={`/status?id=${order.id}`}
        className="inline-block mt-6 text-teal-700 font-semibold underline"
      >
        🔍 Check your order status
      </Link>

      {/* 🔙 Volver */}
      <Link
        to="/"
        className="block mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
      >
        Back to Menu
      </Link>
    </div>
  );
}
