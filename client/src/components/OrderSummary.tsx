import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export default function OrderSummary() {
  const { cartItems, subtotal, discount, total, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = () => {
    if (coupon.trim() !== "") {
      applyCoupon(coupon);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col space-y-2">
      <h3 className="font-semibold text-lg">Your Order</h3>

      {cartItems.length > 0 ? (
        cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm border-b pb-1">
            <div>
              <span>{item.name}</span>
              {item.variant && (
                <span className="ml-1 text-xs text-gray-500">
                  ({item.variant})
                </span>
              )}
              {item.addOns && item.addOns.length > 0 && (
                <em className="block text-xs text-gray-500">
                  + {item.addOns.map((a) => a.name).join(", ")}
                </em>
              )}
            </div>
            <span>
              ${(((item.price ?? 0) * (item.quantity ?? 1))).toFixed(2)}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No items in cart</p>
      )}

      <div className="flex justify-between text-sm pt-2">
        <span>Subtotal</span>
        <span>${(subtotal ?? 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Discount</span>
        <span>-${(discount ?? 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
        <span>Total</span>
        <span>${(total ?? 0).toFixed(2)}</span>
      </div>

      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          placeholder="Enter coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="flex-1 border rounded p-2 text-sm"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-teal-700 text-white px-3 rounded hover:bg-teal-800 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
