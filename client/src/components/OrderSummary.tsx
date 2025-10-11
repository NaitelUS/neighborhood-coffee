import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

const OrderSummary: React.FC = () => {
  const {
    cartItems,
    subtotal,
    total,
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    removeFromCart,
    updateQty,
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      const res = await fetch(`/.netlify/functions/coupons?code=${encodeURIComponent(couponInput)}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.code || couponInput);
        setDiscount(data.discount || 0);
      } else {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponError(data.reason || "Invalid or expired coupon");
      }
    } catch (e) {
      console.error(e);
      setCouponError("Unable to verify coupon right now. Please try again later.");
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center text-gray-500 py-8">Your cart is empty ☕</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-center mb-4 text-emerald-900">Order Summary</h2>

      {cartItems.map((item, idx) => {
        const addonsTotal = (item.addons || []).reduce((s: number, a: any) => s + (a.price || 0), 0);
        const itemTotal = (item.price + addonsTotal) * (item.qty || 1);

        return (
          <div key={idx} className="border-b border-gray-200 py-3 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">
                {item.name} {item.option ? `(${item.option})` : ""}
              </span>
              <span className="font-semibold text-gray-700">${itemTotal.toFixed(2)}</span>
            </div>

            {item.addons && item.addons.length > 0 && (
              <p className="text-sm text-gray-500">
                Add-ons:{" "}
                {item.addons.map((a: any) => `${a.name} (+$${(a.price || 0).toFixed(2)})`).join(", ")}
              </p>
            )}

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item, Math.max((item.qty || 1) - 1, 1))}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="px-2">{item.qty}</span>
                <button
                  onClick={() => updateQty(item, (item.qty || 1) + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item)} className="text-red-600 text-sm hover:underline">
                Remove
              </button>
            </div>
          </div>
        );
      })}

      <div className="mt-4 border-t pt-3">
        <div className="flex justify-between text-gray-700 text-lg">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-700">
            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
            <span>- ${(subtotal * discount).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-xl mt-2 text-emerald-800">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="mt-5 bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Have a coupon?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Apply
          </button>
        </div>
        {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
      </div>
    </div>
  );
};

export default OrderSummary;
