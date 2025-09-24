import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";

const OrderSummary: React.FC = () => {
  const { cartItems, subtotal, discount, total, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = () => {
    if (coupon.trim()) applyCoupon(coupon.trim());
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Your Order</h2>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">No items in cart</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-3">
          {cartItems.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span>
                {item.quantity}× {item.name}
                {item.variant ? ` — ${item.variant}` : ""}
                {item.addOns?.length ? (
                  <ul className="ml-4 text-xs text-gray-600 list-disc">
                    {item.addOns.map((add, i) => (
                      <li key={i}>{add.name} (+${add.price.toFixed(2)})</li>
                    ))}
                  </ul>
                ) : null}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>- ${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="flex mt-3 gap-2">
        <input
          type="text"
          placeholder="Enter coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
