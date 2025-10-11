import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface OrderItem {
  product_name: string;
  option?: string;
  addons?: string;
  price?: number;
  qty?: number;
}

interface Order {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  order_type: string;
  address?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  coupon?: string;
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
        if (data && (data.id || data.orderId)) setOrder(data);
      })
      .catch((err) => console.error("❌ Error fetching order:", err))
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
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 mb-10">
      <h1 className="text-3xl font-bold text-center text-[#00454E] mb-4">
        🎉 Thank you for your order!
      </h1>

      <div className="text-center mb-6">
        <p className="text-gray-700 font-mono text-lg mb-1">
          Order #: {order.orderId || order.id}
        </p>
        <p className="text-gray-500 text-sm">
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      {/* 🧾 Lista de productos */}
      {order.items && order.items.length > 0 && (
        <div className="border-t border-b py-4 mb-4 text-sm text-gray-800 space-y-2">
          {order.items.map((item, idx) => {
            const addons =
              item.addons && typeof item.addons === "string"
                ? item.addons.split(",")
                : [];
            const addonsFormatted =
              addons.length > 0
                ? addons.map((a) => `+ ${a.trim()}`).join(", ")
                : "";

            const itemTotal = (item.price || 0) * (item.qty || 1);

            return (
              <div key={idx} className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {item.product_name}{" "}
                    {item.option && (
                      <span className="text-gray-500 text-sm">
                        ({item.option})
                      </span>
                    )}
                  </p>
                  {addonsFormatted && (
                    <p className="text-gray-500 text-xs">{addonsFormatted}</p>
                  )}
                  {item.qty && (
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  )}
                </div>
                <p className="font-semibold">${itemTotal.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 💰 Totales */}
      <div className="bg-teal-50 p-4 rounded-lg text-sm mb-4">
        {order.subtotal && (
          <p>
            Subtotal:{" "}
            <span className="font-semibold">
              ${Number(order.subtotal).toFixed(2)}
            </span>
          </p>
        )}
        {order.coupon && order.discount ? (
          <p className="text-green-700">
            Discount ({order.coupon}): -{(order.discount * 100).toFixed(0)}%
          </p>
        ) : null}
        <p className="text-lg font-bold text-[#00454E] mt-2">
          Total: ${Number(order.total).toFixed(2)}
        </p>
      </div>

      {/* 👤 Información del cliente */}
      <div className="text-sm text-gray-700 mb-4">
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

      {/* 🔘 Botones */}
      <div className="text-center space-y-3">
        <Link
          to={`/status?id=${order.orderId || order.id}`}
          className="block w-full bg-[#00454E] text-white py-2 rounded-lg font-semibold hover:bg-[#046A71]"
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
