import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface OrderItem {
  product_name: string;
  option?: string;
  addons?: string;
  price: number;
}

interface OrderData {
  orderId: string;
  name: string;
  phone: string;
  order_type: string;
  address?: string;
  schedule_date?: string;
  schedule_time?: string;
  subtotal: number;
  discount: number;
  total: number;
  coupon_code?: string;
  items: OrderItem[];
}

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);

  // 🔹 Obtener datos de la orden desde state
  useEffect(() => {
    const stateOrder = location.state?.order;
    if (stateOrder) setOrder(stateOrder);
  }, [location.state]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          No order found.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-[#00454E] text-white px-4 py-2 rounded-lg hover:bg-[#1D9099]"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-lg mx-auto mt-28 bg-white shadow-md rounded-lg p-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ✅ Encabezado de confirmación */}
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="text-green-500 w-12 h-12 mb-2" />
        <h2 className="text-2xl font-bold text-[#00454E] mb-1">
          Thank you for your order!
        </h2>
        <p className="text-gray-600">
          Your order <strong>{order.orderId}</strong> has been received.
        </p>
      </div>

      {/* 🧾 Resumen del recibo */}
      <div className="mt-6 border-t pt-4 space-y-3">
        <h3 className="text-lg font-semibold text-[#00454E] border-b pb-2">
          Order Summary
        </h3>

        {/* 🧩 Lista de productos */}
        {order.items.map((item, idx) => {
          const hasOptionInName =
            item.option && item.product_name?.includes(`(${item.option})`);
          return (
            <div key={idx} className="flex justify-between text-gray-800">
              <div>
                <strong>{item.product_name}</strong>{" "}
                {!hasOptionInName && item.option && (
                  <span className="text-gray-500">({item.option})</span>
                )}
                {item.addons && item.addons.trim() !== "" && (
                  <p className="text-xs text-gray-500">+ {item.addons}</p>
                )}
              </div>
              <div className="font-medium">
                ${Number(item.price).toFixed(2)}
              </div>
            </div>
          );
        })}

        {/* 💰 Totales */}
        <div className="border-t pt-3 space-y-1 text-right">
          <p className="text-sm text-gray-600">
            Subtotal: ${order.subtotal.toFixed(2)}
          </p>
          {order.coupon_code && order.discount > 0 && (
            <p className="text-sm text-green-600">
              Discount ({order.coupon_code}): -${order.discount.toFixed(2)}
            </p>
          )}
          <p className="text-lg font-bold text-[#00454E]">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 👤 Datos del cliente */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-[#00454E] border-b pb-2">
          Customer Details
        </h3>
        <div className="text-gray-700 mt-2 text-sm space-y-1">
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Type:</strong> {order.order_type}
          </p>
          {order.address && (
            <p>
              <strong>Address:</strong> {order.address}
            </p>
          )}
          {order.schedule_date && (
            <p>
              <strong>Pickup/Delivery Date:</strong> {order.schedule_date}
            </p>
          )}
          {order.schedule_time && (
            <p>
              <strong>Time:</strong> {order.schedule_time}
            </p>
          )}
        </div>
      </div>

      {/* 🔘 Botones finales */}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => navigate("/status", { state: { orderId: order.orderId } })}
          className="w-full bg-[#00454E] text-white py-2 rounded hover:bg-[#1D9099] transition"
        >
          Check Order Status
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full border border-[#00454E] text-[#00454E] py-2 rounded hover:bg-gray-100 transition"
        >
          Back to Menu
        </button>
      </div>
    </motion.div>
  );
}
