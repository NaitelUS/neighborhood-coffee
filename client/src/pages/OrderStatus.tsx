import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

interface Order {
  id: string;
  orderId: string; // <- OrderID tipo TNC-001
  name: string;
  phone: string;
  order_type: string;
  total: number;
  status: string;
  schedule_date?: string;
  schedule_time?: string;
}

export default function OrderStatus() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) return;

    fetch(`/.netlify/functions/orders-get?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setOrder(data);
        }
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Checking your order...
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order not found
        </h1>
        <Link to="/" className="text-teal-600 underline font-medium">
          Return to Menu
        </Link>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h1 className="text-2xl font-bold text-center text-teal-700 mb-4">
        Order Status
      </h1>

      <div className="text-center mb-6">
        <p className="text-gray-700 font-mono text-lg mb-1">
          Order #: {order.orderId}
        </p>
        <p className="text-gray-500 text-sm">
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      <div className="text-sm text-gray-700 mb-4 space-y-1">
        <p><strong>👤 Name:</strong> {order.name}</p>
        <p><strong>📞 Phone:</strong> {order.phone}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg text-sm mb-4 space-y-1">
        <p className="text-xl font-bold text-teal-800">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
