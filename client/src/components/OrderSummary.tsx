import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { coupons } from "../data/coupons";

const OrderSummary: React.FC = () => {
  const { cartItems = [], discount = 0, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");

  // Calcular subtotal
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
    0
  );

  const total = (subtotal - discount).toFixed(2);

  const handleApplyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();
    if (coupons[normalized]) {
      applyCoupon(normalized);
      setError("");
    } else {
      setError("⚠️ Invalid coupon code");
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Your Order</h2>

      {cartItems && cartItems.length > 0 ? (
        <ul className="divide-y divide-gray-200 mb-3">
          {cartItems.map((item, idx) => (
            <li key={idx} className="py-2">
              <div className="flex justify-between">
                <span>
                  {item.quantity}× {item.name}
                  {item.addOns?.length ? (
                    <ul className="ml-4 text-xs text-gray-600 list-disc">
                      {item.addOns.map((add, i) => (
                        <li key={i}>{add.name} (+${add.price.toFixed(2)})</li>
                      ))}
                    </ul>
                  ) : null}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No items in cart</p>
      )}

      <div className="flex justify-between text-sm mb-1">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600 mb-1">
          <span>Discount (Coupon)</span>
          <span>- ${discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between font-semibold text-base border-t pt-2 mb-3">
        <span>Total</span>
        <span>${total}</span>
      </div>

      {/* Coupon Input debajo del total */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Enter coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-brown-600 hover:bg-brown-700 text-white px-3 py-1 rounded"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default OrderSummary;
