import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const { cartItems, discount, appliedCoupon } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => {
    const addonsTotal =
      item.addons?.reduce((aSum, a) => aSum + a.price, 0) || 0;
    return sum + item.price + addonsTotal;
  }, 0);

  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">
        Your Order
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item, index) => (
            <li key={index} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
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
                <span className="text-gray-700 font-semibold whitespace-nowrap ml-3">
                  ${(item.price || 0).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t pt-3 text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#1D9099] font-medium">
            <span>Discount ({appliedCoupon})</span>
            <span>- ${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <CouponField />
    </div>
  );
}
