import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `/.netlify/functions/orders-get?id=${encodeURIComponent(id!)}`
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

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  // 🎨 Badge color y estilo
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-green-600";
      case "in process":
        return "bg-yellow-500";
      case "ready":
        return "bg-blue-600";
      case "completed":
        return "bg-gray-600";
      default:
        return "bg-gray-400";
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

  // 🚀 Íconos dinámicos
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "✅";
      case "in process":
        return "☕";
      case "ready":
        return "🚀";
      case "completed":
        return "🏁";
      default:
        return "ℹ️";
    }
  };

  const orderIcon =
    orderType.toLowerCase() === "delivery" ? "📦" : "🚶‍♂️";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-8 text-sm font-mono">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-4">
        Order Status
      </h1>

      {/* 🟢 Badge con íconos y color */}
      <div className="flex justify-center mb-4">
        <div
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-lg shadow-md text-white ${getStatusStyle(
            orderStatus
          )}`}
        >
          <span>{getStatusIcon(orderStatus)}</span>
          <span>{orderStatus.toUpperCase()}</span>
          <span>{orderIcon}</span>
        </div>
      </div>

      {/* Mensaje contextual */}
      <p className="text-center text-gray-700 mb-4">
        {getStatusMessage(orderType, orderStatus)}
      </p>

      <p className="text-center text-gray-600 mb-4">
        Order <strong>{order.orderID || order.orderId}</strong>
      </p>

      <hr className="my-3" />

      {/* 🧾 Lista de ítems */}
      {order.items && order.items.length > 0 ? (
        order.items.map((item: any, index: number) => (
          <div key={index} className="mb-3">
            <div className="font-semibold">{item.name}</div>
            {item.option && !item.name.toLowerCase().includes(item.option.toLowerCase()) && (
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

      <div className="flex justify-between text-lg font-bold text-green-700">
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
