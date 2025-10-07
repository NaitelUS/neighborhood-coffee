import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

interface Order {
  id: string;
  name: string;
  phone: string;
  order_type: string;
  total: number;
  status: string;
  schedule_date?: string;
  schedule_time?: string;
  address?: string;
  notes?: string;
}

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    fetch(`/.netlify/functions/orders-get?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setOrder(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Checking your order status...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order not found.
        </h1>
        <p className="text-gray-600 mb-6">
          Please verify your order number or contact support.
        </p>
        <Link
          to="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // 🎨 Colores por estado
  const statusColor: Record<string, string> = {
    Received: "bg-gray-100 text-gray-800 border-gray-300",
    "In Process": "bg-blue-50 text-blue-700 border-blue-300",
    Ready: "bg-green-50 text-green-700 border-green-300",
    "Out for Delivery": "bg-amber-50 text-amber-700 border-amber-300",
    Completed: "bg-teal-50 text-teal-700 border-teal-300",
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h1 className="text-2xl font-bold text-center text-teal-700 mb-4">
        🔍 Order Status
      </h1>

      <div className="text-center mb-4">
        <p className="text-gray-700 font-mono text-lg mb-1">
          Order #: {order.id}
        </p>
        <p className="text-gray-500 text-sm">
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      <div
        className={`p-4 rounded-lg text-center font-semibold border ${
          statusColor[order.status] || "bg-gray-50 border-gray-200"
        }`}
      >
        {order.status === "Received" && "📦 Your order has been received!"}
        {order.status === "In Process" && "☕ Barista is preparing your drink..."}
        {order.status === "Ready" && "✅ Your order is ready for pickup!"}
        {order.status === "Out for Delivery" &&
          "🚚 Your order is out for delivery!"}
        {order.status === "Completed" &&
          "🎉 Your order has been completed. Enjoy!"}
      </div>

      <div className="mt-4 border-t pt-3 text-gray-700 text-sm">
        <p>
          <strong>Name:</strong> {order.name}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        {order.address && (
          <p>
            <strong>Address:</strong> {order.address}
          </p>
        )}
        {order.notes && (
          <p>
            <strong>Notes:</strong> {order.notes}
          </p>
        )}
      </div>

      <div className="bg-teal-50 p-4 rounded-lg mt-4 text-center">
        <p className="text-lg font-semibold text-teal-800">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
