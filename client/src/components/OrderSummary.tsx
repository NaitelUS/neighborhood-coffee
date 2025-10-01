import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";
import { Trash2 } from "lucide-react";

export default function OrderSummary() {
  const {
    cartItems,
    discount,
    appliedCoupon,
    removeFromCart,
    subtotal,
    total,
  } = useContext(CartContext);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Your Order
      </h2>

      {/* 🧾 Lista de productos */}
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-6 space-y-3">
          {cartItems.map((item, index) => {
            const addonsTotal =
              item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
            const itemTotal = item.price + addonsTotal;

            return (
              <li key={index} className="pt-3 first:pt-0">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
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
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-semibold">
                      ${itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 💰 Subtotal */}
      <div className="flex justify-between py-2 text-gray-700 text-base">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* 💸 Descuento */}
      {discount > 0 && (
        <div className="flex justify-between py-2 text-green-700 font-medium text-base">
          <span>Discount ({appliedCoupon})</span>
          <span>- ${(subtotal * discount).toFixed(2)}</span>
        </div>
      )}

      {/* 💵 Total final */}
      <div className="flex justify-between border-t border-gray-200 mt-3 pt-3 text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* 🏷️ Campo de cupón */}
      <div className="mt-6">
        <CouponField />
      </div>

      {/* 🚀 Checkout */}
      {cartItems.length > 0 && (
        <button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mt-6 rounded-lg font-semibold shadow-sm transition"
          onClick={() => alert("Proceeding to checkout...")}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
