import React from "react";
import { useCart } from "../context/CartContext";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const {
    items,
    removeItem,
    getSubtotal,
    getTotal,
    discountRate,
    couponCode,
  } = useCart();

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Your cart is empty ☕
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = getTotal();
  const discountAmount = subtotal * (discountRate || 0);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold text-[#00454E] mb-3">
        Your Order
      </h2>

      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li
            key={`${item.id}-${item.option}`}
            className="flex justify-between items-center py-2"
          >
            <div>
              <p className="font-medium">
                {item.name}
                {item.option ? ` (${item.option})` : ""}
              </p>
              {Array.isArray(item.addons) && item.addons.length > 0 && (
                <p className="text-xs text-gray-500">
                  Add-ons:{" "}
                  {item.addons
                    .map((a) => `${a.name} ($${a.price.toFixed(2)})`)
                    .join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <CouponField />

      <div className="border-t pt-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountRate ? (
          <div className="flex justify-between text-green-700">
            <span>
              Discount {couponCode ? `(${couponCode.toUpperCase()})` : ""}
            </span>
            <span>- ${discountAmount.toFixed(2)}</span>
          </div>
        ) : null}

        <div className="flex justify-between font-semibold text-[#00454E] text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
