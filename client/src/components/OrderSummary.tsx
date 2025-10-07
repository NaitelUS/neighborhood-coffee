import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const {
    cartItems,
    discount,
    appliedCoupon,
    removeFromCart,
    subtotal,
    total,
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Order</h2>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Order</h2>

      {/* 🧾 Lista de productos */}
      <ul className="divide-y divide-gray-200 mb-4">
        {cartItems.map((item, index) => (
          <li key={index} className="py-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
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

              {/* 💵 Precio */}
              <div className="flex flex-col items-end">
                <span className="text-gray-700 font-semibold">
                  ${item.price.toFixed(2)}
                </span>

                {/* ❌ Botón de eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 💵 Subtotal */}
      <div className="flex justify-between py-1 text-gray-700">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* 💸 Descuento */}
      {discount > 0 && (
        <div className="flex justify-between py-1 text-[#1D9099] font-medium">
          <span>Discount ({appliedCoupon})</span>
          <span>- ${(subtotal * discount).toFixed(2)}</span>
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

      {/* 🚀 Botón opcional */}
      {cartItems.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Review your items before checkout.
          </p>
        </div>
      )}
    </div>
  );
}
