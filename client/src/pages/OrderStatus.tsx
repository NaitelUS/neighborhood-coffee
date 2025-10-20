import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderStatus() {
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
  const orderStatus = order.Status || "Received";

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

  // 🎨 Badge color según estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-gray-200 text-gray-800";
      case "in process":
        return "bg-yellow-200 text-yellow-800";
      case "ready":
        return "bg-green-200 text-green-800";
      case "completed":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // 🎨 Color del total según estado
  const getTotalColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "text-gray-700";
      case "in process":
        return "text-yellow-700";
      case "ready":
        return "text-green-700";
      case "completed":
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  // 💬 Mensaje dinámico contextual según tipo + estado
  const getStatusMessage = (type: string, status: string) => {
    const t = type.toLowerCase();
    const s = status.toLowerCase();

    if (t === "pickup") {
      switch (s) {
        case "received":
          return "We’ve received your order.";
        case "in process":
          return "We’re preparing your coffee.";
        case "ready":
          return "Your order is ready for pickup.";
        case "completed":
          return "Your order has been picked up. Enjoy!";
        default:
          return "";
      }
    }

    if (t === "delivery") {
      switch (s) {
        case "received":
          return "We’ve received your order.";
        case "in process":
          return "Your order is being prepared for delivery.";
        case "ready":
          return "Your order is on its way.";
        case "completed":
          return "Your order has been delivered. Enjoy!";
        default:
          return "";
      }
    }

    return "";
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8 text-sm font-mono">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-2">
        Order Status
      </h1>

      {/* Badge con color de estado */}
      <div className="text-center mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
            orderStatus
          )}`}
        >
          {orderStatus}
        </span>
      </div>

      {/* Mensaje humano */}
      <p className="text-center text-gray-600 mb-4">
        {getStatusMessage(orderType, orderStatus)}
      </p>

      <p className="text-center text-gray-600 mb-4">
        Order <strong>{order.orderID || order.orderId}</strong>
      </p>

      <hr className="my-3" />

      {/* Lista de ítems */}
      {order.items && order.items.length > 0 ? (
        order.items.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold">{item.name}</div>
            {item.option && (
              <div className="text-gray-500 text-xs">{item.option}</div>
            )}

            {item.addons && item.addons.length > 0 && (
              <ul className="ml-4 mt-1 text-xs text-gray-500 list-disc">
                {Array.isArray(item.addons)
                  ? item.addons.map((a, i) => <li key={i}>{a}</li>)
                  : <li>{item.addons}</li>}
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

      {/* Total dinámico */}
      <div
        className={`flex justify-between text-lg font-bold ${getTotalColor(
          orderStatus
        )}`}
      >
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Fecha y tipo */}
      <div className="text-gray-500 text-xs mt-4 text-center">
        Placed on: {formattedDate} {orderIcon} {orderType.toUpperCase()}
      </div>
    </div>
  );
}
