import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const { cartItems, discount, appliedCoupon, subtotal, total, removeFromCart } =
    useContext(CartContext);

  // 🔹 Descuento aplicado
  const discountAmount = subtotal * discount;

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
        Your Order
      </h2>

      {/* 🧾 Lista de productos */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-4 space-y-3">
          {cartItems.map((item, index) => {
            const addonsTotal =
              item.addons?.reduce((sum, a) => sum + a.price, 0) || 0;
            const itemTotal = item.price + addonsTotal;

            return (
              <li
                key={index}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  {/* ✅ Add-ons debajo del nombre */}
                  {item.addons && item.addons.length > 0 && (
                    <ul className="ml-4 mt-1 text-sm text-gray-600 list-disc space-y-1">
                      {item.addons.map((addon, idx) => (
                        <li key={idx}>
                          {addon.name} (+${addon.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold">
                    ${itemTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕ Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 💵 Subtotal */}
      <div className="flex justify-between py-1 text-gray-700">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* 💸 Discount */}
      {discount > 0 && (
        <div className="flex justify-between py-1 text-green-700 font-medium">
          <span>Discount ({appliedCoupon})</span>
          <span>- ${discountAmount.toFixed(2)}</span>
        </div>
      )}

      {/* 🧾 Total */}
      <div className="flex justify-between border-t mt-3 pt-3 text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* 🏷️ Campo de cupón (debajo del total) */}
      <div className="mt-4">
        <CouponField />
      </div>

      {/* 🚀 Botón de confirmación (opcional) */}
      {cartItems.length > 0 && (
        <button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mt-4 rounded-lg font-semibold transition"
          onClick={() => alert("Proceeding to checkout...")}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
