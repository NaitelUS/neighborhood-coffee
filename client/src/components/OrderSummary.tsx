import React from "react";
import { useCart } from "../context/CartContext";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const {
    cart,
    subtotal,
    discountRate,
    total,
    appliedCoupon,
    removeItem,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-600">
        Your order is empty.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        🧾 Your Order
      </h2>

      {/* Lista de productos */}
      <ul className="divide-y divide-gray-200">
        {cart.map((item) => (
          <li
            key={item.id}
            className="py-3 flex justify-between items-start text-sm"
          >
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              {item.addons && item.addons.length > 0 && (
                <ul className="ml-4 list-disc text-gray-500">
                  {item.addons.map((addon, index) => (
                    <li key={index}>
                      {addon.name} (+${addon.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">
                ${item.price.toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Área del cupón */}
      <CouponField />

      {/* Totales */}
      <div className="border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount ({(discountRate * 100).toFixed(0)}% - {appliedCoupon})
            </span>
            <span>- ${(subtotal * discountRate).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
