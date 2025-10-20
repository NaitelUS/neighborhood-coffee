import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `/.netlify/functions/orders-get?id=${encodeURIComponent(id)}`
        );
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!order) return <p className="p-6 text-center">Order not found.</p>;

  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const coupon = order.coupon || "";
  const total = subtotal - subtotal * discount;
  const createdAt = order.createdAt || order.Date || order.date;
  const orderType = order.order_type || order.OrderType || "";

  // Elegir ícono según tipo de orden
  const orderIcon =
    orderType.toLowerCase() === "delivery" ? "🚗" : "🚶‍♂️";

  // Formatear fecha/hora
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-center text-green-700">
        Thank You!
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Your order <strong>{order.orderID || order.orderId}</strong> has been
        received.
      </p>

      <div className="border-t border-b py-4 text-sm font-mono">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-1">
              <span>
                {item.name}{" "}
                {item.addons && (
                  <span className="text-xs text-gray-500">
                    ({item.addons})
                  </span>
                )}
              </span>
              <span>
                {item.qty} × ${item.price.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </div>

      {/* Totales estilo recibo */}
      <div className="border-t pt-4 mt-4 text-sm font-mono">
        {/* Fecha y tipo de orden con ícono */}
        <div className="flex justify-between text-gray-500 text-xs mb-2">
          <span>
            Placed on: {formattedDate}
            {orderType && (
              <span className="ml-2">
                {orderIcon} {orderType.toUpperCase()}
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
            <span>-${(subtotal * discount).toFixed(2)}</span>
          </div>
        )}

        {coupon && (
          <div className="flex justify-between text-gray-600">
            <span>Coupon</span>
            <span>{coupon}</span>
          </div>
        )}

        <div className="h-px bg-gray-300 my-2"></div>

        <div className="flex justify-between text-green-700 text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        We’ll notify you when your order is ready for pickup.
      </p>
    </div>
  );
}
