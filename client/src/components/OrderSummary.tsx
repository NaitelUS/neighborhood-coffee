import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const OrderSummary: React.FC = () => {
  const {
    cartItems,
    subtotal,
    total,
    discount,
    appliedCoupon,
    setAppliedCoupon,
    setDiscount,
    updateQty,
    removeFromCart,
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error" | "loading">("idle");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponStatus("loading");

    try {
      const res = await fetch("/.netlify/functions/coupons?code=" + couponCode.trim());
      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      if (data?.valid && typeof data.percent_off === "number") {
        setDiscount(data.percent_off); // Ejemplo: 0.10 para 10%
        setAppliedCoupon(couponCode.trim());
        setCouponStatus("success");
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponStatus("error");
      }
    } catch (error) {
      console.error(error);
      setCouponStatus("error");
    }
  };

  const formatCurrency = (num: number) => `$${num.toFixed(2)}`;

  if (!cartItems.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/" className="text-emerald-700 font-semibold underline">
          ← Go back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-center text-emerald-700 mb-4">
        Order Summary
      </h2>

      {/* 🧾 Items del carrito */}
      {cartItems.map((item, idx) => (
        <div key={idx} className="border-b pb-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {item.name}
              </h3>
              {item.addons?.length > 0 && (
                <p className="text-sm text-gray-500">
                  Add-ons:{" "}
                  {item.addons
                    .map((a: any) => `${a.name} (+$${a.price.toFixed(2)})`)
                    .join(", ")}
                </p>
              )}
            </div>
            <p className="font-semibold text-gray-700">
              {formatCurrency(item.basePrice + (item.addons?.reduce((sum: number, a: any) => sum + a.price, 0) || 0))}
            </p>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center mt-2 space-x-2">
            <button
              onClick={() =>
                updateQty(item, Math.max(1, (item.qty || 1) - 1))
              }
              className="px-2 py-1 border rounded-md text-gray-600"
            >
              -
            </button>
            <span className="text-gray-800">{item.qty || 1}</span>
            <button
              onClick={() => updateQty(item, (item.qty || 1) + 1)}
              className="px-2 py-1 border rounded-md text-gray-600"
            >
              +
            </button>

            <button
              onClick={() => removeFromCart(item)}
              className="ml-4 text-red-500 text-sm font-medium hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* 🧮 Subtotal y total */}
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between text-gray-700 mb-1">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-700 mb-1">
            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
            <span>- {formatCurrency(subtotal * discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-lg text-emerald-700 mt-2">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* 🏷️ Campo de cupón */}
      <div className="mt-5 border-t pt-4">
        <label className="block text-gray-700 font-medium mb-2">
          Have a coupon?
        </label>

        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={couponStatus === "success"}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={couponStatus === "success" || couponStatus === "loading"}
            className={`px-4 py-2 rounded-md text-white font-semibold ${
              couponStatus === "success"
                ? "bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {couponStatus === "loading"
              ? "Applying..."
              : couponStatus === "success"
              ? "Applied"
              : "Apply"}
          </button>
        </div>

        {couponStatus === "success" && (
          <p className="text-emerald-600 text-sm mt-2">
            Coupon applied! ({(discount * 100).toFixed(0)}% OFF)
          </p>
        )}
        {couponStatus === "error" && (
          <p className="text-red-500 text-sm mt-2">
            Invalid or expired coupon.
          </p>
        )}
      </div>

      {/* 🔙 Volver a menú */}
      <div className="text-center mt-6">
        <Link
          to="/"
          className="inline-block text-emerald-700 font-semibold underline"
        >
          ← Want more items?
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
