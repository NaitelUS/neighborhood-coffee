import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const {
    cartItems,
    updateQty,
    removeFromCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Your cart is empty ☕
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h2 className="text-xl font-bold text-[#00454E] border-b pb-2">
        Your Order
      </h2>

      {/* 🧾 Lista de productos */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id + (item.option || "")}
            className="flex items-center justify-between border-b pb-2"
          >
            {/* 👉 Selector de cantidad a la izquierda */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* 🧾 Detalle del producto */}
            <div className="flex-1 px-3">
              <p className="font-semibold">
                {item.name}
                {!item.name.includes(`(${item.option})`) && item.option && (
                  <span className="text-gray-500"> ({item.option})</span>
                )}
              </p>
              {item.addons && item.addons.length > 0 && (
                <p className="text-xs text-gray-400">
                  Add-ons: {item.addons.map((a) => a.name).join(", ")}
                </p>
              )}
            </div>

            {/* 💰 Precio */}
            <div className="text-right">
              <p className="font-semibold">
                ${(item.price * item.qty).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 Totales */}
      <div className="border-t pt-3 text-right space-y-1">
        <p>
          Subtotal:{" "}
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </p>
        {appliedCoupon && (
          <p className="text-sm text-green-600">
            Discount ({appliedCoupon}): -{(discount * 100).toFixed(0)}%
          </p>
        )}
        <p className="text-lg font-bold text-[#00454E]">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      {/* 🏷️ Campo de cupón */}
      <CouponField />

      {/* ☕ Want more items? → vuelve al menú sin limpiar el carrito */}
      <Link
        to="/"
        className="block w-full text-center mt-2 bg-[#00454E] text-white py-2 rounded hover:bg-[#1D9099] transition"
      >
        Want more items?
      </Link>
    </div>
  );
}
