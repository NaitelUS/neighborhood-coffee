import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const { cartItems, subtotal, discount, appliedCoupon, total } =
    useContext(CartContext);

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Your Order
      </h2>

      {/* 🧾 Lista de productos */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-4">
          {cartItems.map((item, index) => (
            <li key={index} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>

                  {/* ✅ Add-ons debajo del nombre */}
                  {item.addons && item.addons.length > 0 && (
                    <ul className="ml-4 mt-1 text-sm text-gray-600 list-disc">
                      {item.addons.map((addon, idx) => (
                        <li key={idx}>
                          {addon.name} (+${addon.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 💰 Precio total del item */}
                <span className="text-gray-700 font-semibold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
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
          <span>- ${(subtotal * discount).toFixed(2)}</span>
        </div>
      )}

      {/* 🧾 Total */}
      <div className="flex justify-between border-t mt-3 pt-3 text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* 🏷️ Campo de cupón */}
      <div className="mt-4">
        <CouponField />
      </div>

      {/* 🚀 Botón de confirmación */}
      {cartItems.length > 0 && (
        <button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mt-4 rounded-lg font-semibold"
          onClick={() => alert("Proceeding to checkout...")}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
