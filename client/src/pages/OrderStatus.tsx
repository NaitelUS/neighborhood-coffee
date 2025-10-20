import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState<string>("");

  // 🕐 Fecha y hora actual
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const t = setInterval(updateTime, 60000);
    return () => clearInterval(t);
  }, []);

  // 🔄 Cargar la orden cada 10 s
  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/.netlify/functions/orders-get?id=${orderId}`);
      const data = await res.json();
      if (data && !data.error) {
        setOrder(data);
        setError("");
      } else {
        setError(data.error || "Order not found");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  // ⚙️ Flujo de pasos
  const stepsPickup = ["Received", "In Process", "Ready", "Completed"];
  const stepsDelivery = [
    "Received",
    "In Process",
    "Out for Delivery",
    "Completed",
  ];

  const getStepColor = (step: string, current: string) => {
    const idxStep = stepsPickup.indexOf(step);
    const idxCurrent = stepsPickup.indexOf(current);
    if (idxStep < idxCurrent) return "bg-[#00454E]";
    if (idxStep === idxCurrent) return "bg-[#007b87]";
    return "bg-gray-300";
  };

  const flow = order?.OrderType === "Delivery" ? stepsDelivery : stepsPickup;

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">⚠️ {error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-2 text-[#00454E]">
        ☕ Order Status
      </h1>
      <p className="text-sm text-gray-500 mb-6">Today is {time}</p>

      <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">
          <b>Order #:</b> {order.orderID}
        </p>
        <p className="text-lg font-semibold mb-1 text-[#00454E]">
          {order.name}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          {order.OrderType || "Pickup"}
        </p>

        {/* 🔘 Badge del estado actual */}
        <div className="flex justify-center items-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.Status === "Ready"
                ? "bg-blue-600 text-white"
                : order.Status === "Completed"
                ? "bg-gray-600 text-white"
                : order.Status === "In Process"
                ? "bg-yellow-500 text-white"
                : order.Status === "Out for Delivery"
                ? "bg-indigo-500 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {order.Status || "Received"}
          </span>
        </div>

        {/* 🧾 Orden completa */}
        {order.items && order.items.length > 0 && (
          <div className="text-left text-gray-700 text-sm mb-3">
            <ul className="space-y-1">
              {order.items.map((item: any, i: number) => (
                <li key={i} className="font-medium">
                  {item.qty && item.qty > 1
                    ? `${item.qty} × ${item.name}`
                    : item.name}
                  {item.addons && item.addons.length > 0 && (
                    <ul className="ml-6 text-xs list-disc text-gray-500">
                      {item.addons.map((a: string, j: number) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔄 Barra de progreso */}
        <div className="mt-6">
          <div className="flex justify-between mb-2 text-xs font-semibold text-gray-600">
            {flow.map((step, i) => (
              <span key={i}>{step}</span>
            ))}
          </div>
          <div className="flex justify-between items-center relative">
            {flow.map((step, i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-4 h-4 rounded-full ${
                    step === order.Status
                      ? "bg-[#007b87] ring-4 ring-[#9ed1d4]"
                      : getStepColor(step, order.Status)
                  }`}
                ></div>
                {i < flow.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      stepsPickup.indexOf(step) <
                      stepsPickup.indexOf(order.Status)
                        ? "bg-[#00454E]"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <hr className="my-4" />
        <p className="font-bold text-lg text-[#00454E]">
          {order.Status === "Completed"
            ? "✅ Your order is ready!"
            : order.Status === "Out for Delivery"
            ? "🚚 On its way to you!"
            : order.Status === "Ready"
            ? "☕ Ready for pickup!"
            : order.Status === "In Process"
            ? "🧑‍🍳 Barista is preparing your order..."
            : "🕒 Order received"}
        </p>
      </div>
    </div>
  );
}
