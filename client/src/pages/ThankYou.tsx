import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface OrderItem {
  ProductName: string;
  Option?: string;
  Qty?: number;
  AddOns?: string;
  Price?: number;
}

interface Order {
  OrderID: string;
  Name: string;
  Phone?: string;
  OrderType: string;
  Address?: string;
  ScheduleDate?: string;
  ScheduleTime?: string;
  Subtotal?: number;
  DiscountRate?: number;
  Total?: number;
  Coupon?: string;
  items?: OrderItem[];
}

export default function ThankYou() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("id");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/.netlify/functions/orders-get?id=${orderId}`);
        const data = await res.json();

        if (!res.ok || !data || data.length === 0) {
          setNotFound(true);
        } else {
          // ✅ Airtable devuelve array, tomamos el primero
          setOrder(data[0]);
        }
      } catch (err) {
        console.error("❌ Error loading order:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return <div className="text-center mt-32 text-gray-500">Loading receipt...</div>;

  if (notFound || !order)
    return (
      <div className="text-center mt-32 text-red-600">
        ❌ Order not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-24 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#00454E] mb-4 text-center">
        ☕ Thank you for your order!
      </h2>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">Order No.</p>
        <p className="text-lg font-bold text-[#1D9099]">{order.OrderID}</p>
      </div>

      {/* 👤 Customer Info */}
      <div className="text-sm text-gray-700 mb-4 border-b pb-3">
        <p>
          <strong>Name:</strong> {order.Name}
        </p>
        {order.Phone && (
          <p>
            <strong>Phone:</strong> {order.Phone}
          </p>
        )}
        <p>
          <strong>Type:</strong> {order.OrderType}
        </p>
        {order.Address && (
          <p>
            <strong>Address:</strong> {order.Address}
          </p>
        )}
        {(order.ScheduleDate || order.ScheduleTime) && (
          <p>
            <strong>Pickup Time:</strong>{" "}
            {order.ScheduleDate} {order.ScheduleTime}
          </p>
        )}
      </div>

      {/* 🧾 Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-2 mb-4 border-b pb-3">
          {order.items.map((item, i) => {
            const hasOptionInName =
              item.Option && item.ProductName?.includes(`(${item.Option})`);

            return (
              <div
                key={i}
                className="flex justify-between text-sm text-gray-800 border-b border-dashed last:border-none pb-1"
              >
                <div>
                  <p>
                    {item.Qty && item.Qty > 1 ? `${item.Qty} × ` : ""}
                    <strong>{item.ProductName}</strong>{" "}
                    {!hasOptionInName && item.Option && (
                      <span className="text-gray-500">({item.Option})</span>
                    )}
                  </p>
                  {item.AddOns && (
                    <p className="text-xs text-gray-500">+ {item.AddOns}</p>
                  )}
                </div>
                <p className="font-medium">
                  $
                  {(
                    ((item.Price || 0) * (item.Qty || 1)).toFixed(2)
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 💰 Totals */}
      <div className="text-right text-sm space-y-1">
        {order.Subtotal !== undefined && (
          <p>Subtotal: ${Number(order.Subtotal).toFixed(2)}</p>
        )}
        {order.DiscountRate && order.DiscountRate > 0 && (
          <p className="text-green-700">
            Discount ({(order.DiscountRate * 100).toFixed(0)}% -{" "}
            {order.Coupon || ""})
          </p>
        )}
        <p className="text-lg font-bold text-[#00454E]">
          Total: ${Number(order.Total).toFixed(2)}
        </p>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/"
          className="bg-[#00454E] text-white px-4 py-2 rounded hover:bg-[#1D9099] transition"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
