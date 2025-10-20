import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const orderIcon =
    orderType.toLowerCase() === "delivery" ? "🚗" : "🚶‍♂️";

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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8 text-sm font-mono">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-2">
        Thank You!
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Your order <strong>{order.orderID || order.orderId}</strong> has been
        received.
      </p>

      <hr className="my-3" />

      {/* Lista de ítems */}
      {order.items && order.items.length > 0 ? (
        order.items.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between">
              <div>
                <strong>{item.name}</strong>{" "}
                <span className="text-gray-600">({item.option})</span>
              </div>
              <div className="text-right">
                ${(item.price * (item.qty || 1)).toFixed(2)}
              </div>
            </div>

            {item.addons && item.addons.length > 0 && (
              <ul className="ml-4 mt-1 text-xs text-gray-500 list-disc">
                {Array.isArray(item.addons)
                  ? item.addons.map((a, i) => (
                      <li key={i}>
                        {a.name
                          ? `${a.name} (+$${a.price?.toFixed(2) || "0.00"})`
                          : a}
                      </li>
                    ))
                  : (
                    <li>
                      {item.addons.name
                        ? `${item.addons.name} (+$${item.addons.price?.toFixed(2) || "0.00"})`
                        : item.addons}
                    </li>
                  )}
              </ul>
            )}

            <div className="text-xs text-gray-500 mt-1">
              Qty: {item.qty || 1}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No items found.</p>
      )}

      <hr className="my-3" />

      {/* Fecha y tipo */}
      <div className="flex justify-between text-gray-500 text-xs mb-2">
        <span>
          Placed on: {formattedDate} {orderIcon} {orderType.toUpperCase()}
        </span>
      </div>

      {/* Totales */}
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

      <hr className="my-3" />

      <div className="flex justify-between text-green-700 text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate(`/order-status?id=${order.orderID}`)}
          className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700 transition"
        >
          Track My Order
        </button>
      </div>
    </div>
  );
}
