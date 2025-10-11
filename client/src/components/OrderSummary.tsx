import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const { cartItems, subtotal, discount, total } = useContext(CartContext);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center text-gray-600 py-12">
        Your cart is empty ☕
        <br />
        <a href="/" className="text-emerald-700 hover:underline mt-2 inline-block">
          ← Go back to menu
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-amber-900 mb-6 text-center">
        Review Your Order
      </h2>

      {/* Items */}
      <ul className="divide-y divide-gray-200 mb-6">
        {cartItems.map((item, i) => (
          <li key={i} className="py-3 flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-800">
                {item.name} {item.option ? `(${item.option})` : ""}
              </p>
              {item.addons && item.addons.length > 0 && (
                <p className="text-sm text-gray-500">
                  Add-ons:{" "}
                  {item.addons.map((a: any) => `${a.name} (+$${a.price})`).join(", ")}
                </p>
              )}
            </div>
            <p className="font-semibold text-gray-800">${item.total?.toFixed(2) || item.price?.toFixed(2)}</p>
          </li>
        ))}
      </ul>

      {/* Coupon */}
      <div className="mb-6">
        <CouponField />
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold text-amber-900 mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Main Button */}
      <div className="mt-8 text-center">
        <button
          type="submit"
          form="customer-info-form"
          className="w-full bg-[#00454E] hover:bg-[#00353D] text-white py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
        >
          Place Order <span className="text-lg">☕</span>
        </button>
        <p className="text-sm text-gray-500 mt-2">
          One last step to great coffee.
        </p>
      </div>
    </div>
  );
}
