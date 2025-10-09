import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const cart = useContext(CartContext);
  if (!cart) return null;

  const { cartItems, removeItem, subtotal, discountRate, discount, total, appliedCoupon, updateQuantity } = cart;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <div className="text-center text-gray-500 mt-6">Your cart is empty ☕</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold text-[#00454E] mb-3">Your Order</h2>

      <ul className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-start py-2">
            <div>
              <p className="font-medium">
                {item.name}{item.option ? ` (${item.option})` : ""}
              </p>
              {Array.isArray(item.addons) && item.addons.length > 0 && (
                <p className="text-xs text-gray-500">
                  Add-ons: {item.addons.map(a => `${a.name} ($${a.price.toFixed(2)})`).join(", ")}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-0.5 border rounded"
                >
                  −
                </button>
                <span className="text-sm">Qty: {item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-0.5 border rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${(item.price * item.quantity + (item.addons?.reduce((a,b)=>a+b.price,0)||0) * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">
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

        {discountRate > 0 && (
          <div className="flex justify-between text-green-700">
            <span>
              Discount {appliedCoupon ? `(${appliedCoupon} – ${(discountRate*100).toFixed(0)}%)` : ""}
            </span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-[#00454E] text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
