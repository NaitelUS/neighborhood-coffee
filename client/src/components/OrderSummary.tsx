import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

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
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              {item.option && (
                <p className="text-sm text-gray-500">{item.option}</p>
              )}
              {item.addons && item.addons.length > 0 && (
                <p className="text-xs text-gray-400">
                  Add-ons: {item.addons.map((a) => a.name).join(", ")}
                </p>
              )}
            </div>

            {/* Selector de cantidad */}
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

            <div className="flex flex-col items-end">
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
          <span className="font-semibold">
            ${subtotal.toFixed(2)}
          </span>
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
    </div>
  );
}
