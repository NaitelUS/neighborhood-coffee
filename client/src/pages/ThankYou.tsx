import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface OrderItem {
  name: string;
  option?: string;
  price: number;
  qty: number;
  addons?: string;
}

interface Order {
  id: string;
  OrderID?: string; // <-- corregido
  name: string;
  phone: string;
  order_type: string;
  address?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  schedule_date?: string;
  schedule_time?: string;
  notes?: string;
  items?: OrderItem[];
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

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Loading your order...
      </div>
    );

  if (!order)
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

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-4">
        🎉 Your order has been received!
      </h1>

      <div className="text-center mb-6">
        <p className="text-gray-700 font-mono text-lg mb-1">
          Order #: {order.OrderID}
        </p>
        <p className="text-gray-500 text-sm">
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="border-t border-b py-3 mb-4 text-sm text-gray-800 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <span>
                  <strong>{item.name}</strong>
                  {item.option && ` (${item.option})`} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
              {item.addons && (
                <p className="text-gray-600 text-xs ml-2">+ {item.addons}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-700 mb-4 space-y-1">
        <p>
          <strong>👤 Name:</strong> {order.name}
        </p>
        <p>
          <strong>📞 Phone:</strong> {order.phone}
        </p>
        {order.address && (
          <p>
            <strong>🏠 Address:</strong> {order.address}
          </p>
        )}
        {order.notes && (
          <p>
            <strong>📝 Notes:</strong> {order.notes}
          </p>
        )}
      </div>

      <div className="bg-teal-50 p-4 rounded-lg text-sm mb-4 space-y-1">
        <p>
          <strong>Subtotal:</strong> ${order.subtotal?.toFixed(2)}
        </p>
        {order.discount && order.discount > 0 && (
          <p>
            <strong>Discount:</strong> -${order.discount.toFixed(2)}
          </p>
        )}
        <p className="text-xl font-bold text-teal-800">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="text-center space-y-3">
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
