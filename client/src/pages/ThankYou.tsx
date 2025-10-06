// client/src/pages/ThankYou.tsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface Order {
  id: string;
  name: string;
  phone: string;
  order_type: string;
  address?: string;
  total: number;
  schedule_date?: string;
  schedule_time?: string;
  notes?: string;
}

export default function ThankYou() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/.netlify/functions/orders-get?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setOrder(data);
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order not found. Please check your link.
        </h1>
        <Link to="/" className="text-teal-600 underline font-medium">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-4">
        🎉 Your order has been received!
      </h1>

      <div className="text-center mb-6">
        <p className="text-gray-700 font-mono text-lg mb-1">
          Order #: {order.id}
        </p>
        <p className="text-gray-500 text-sm">
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      <div className="border-t pt-4 mb-4 text-sm text-gray-700">
        <p><strong>👤 Name:</strong> {order.name}</p>
        <p><strong>📞 Phone:</strong> {order.phone}</p>
        {order.address && <p><strong>🏠 Address:</strong> {order.address}</p>}
        {order.notes && <p><strong>📝 Notes:</strong> {order.notes}</p>}
      </div>

      <div className="bg-teal-50 p-4 rounded-lg text-center">
        <p className="text-xl font-semibold text-teal-800">
          Total: ${Number(order.total).toFixed(2)}
        </p>
      </div>

      <div className="mt-6 text-center space-y-3">
        <Link
          to={`/status?id=${order.id}`}
          className="block w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700"
        >
          Check Order Status
        </Link>
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
