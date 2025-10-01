import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const orderId = params.get("order_id");
  const total = params.get("total");
  const name = params.get("name");
  const coupon = params.get("coupon");
  const discount = params.get("discount");

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 text-center mt-10">
      <h2 className="text-3xl font-bold text-green-600 mb-3">
        ✅ Thank You, {name || "Customer"}!
      </h2>

      <p className="text-gray-700 mb-2">
        Your order has been received and is being prepared.
      </p>

      {orderId && (
        <p className="text-gray-600 text-sm mb-4">
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      {/* 🧾 Resumen del pedido */}
      <div className="bg-gray-50 border rounded-lg p-4 text-left mb-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Order Summary</h3>

        {/* Aquí se mostrará la lista de productos del carrito */}
        <p className="text-sm text-gray-600">
          Items ordered and add-ons have been recorded with your order.
        </p>

        {/* 💵 Subtotal */}
        <div className="flex justify-between mt-3 text-gray-800">
          <span>Subtotal</span>
          <span>${(parseFloat(total || "0") / (1 - (parseFloat(discount || "0") || 0))).toFixed(2)}</span>
        </div>

        {/* 💸 Descuento */}
        {discount && parseFloat(discount) > 0 && (
          <div className="flex justify-between text-green-700 font-medium mt-1">
            <span>Discount {coupon && `(${coupon})`}</span>
            <span>-{(parseFloat(discount) * 100).toFixed(0)}%</span>
          </div>
        )}

        {/* ✅ Total */}
        <div className="flex justify-between border-t mt-3 pt-3 text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${parseFloat(total || "0").toFixed(2)}</span>
        </div>
      </div>

      {/* ⭐ Botón Feedback */}
      <button
        onClick={() => navigate(`/feedback?order_id=${orderId || ""}`)}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
      >
        Leave Feedback ⭐
      </button>

      <p className="text-gray-500 text-sm mt-4">
        We’ll notify you once your order is ready.
      </p>
    </div>
  );
}
