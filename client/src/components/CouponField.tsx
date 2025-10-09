import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";

export default function CouponField() {
  const { setDiscountRate, setAppliedCoupon, appliedCoupon } = useCart();

  const [coupon, setCoupon] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "error">(
    "idle"
  );
  const [isApplying, setIsApplying] = useState(false);

  const message = useMemo(() => {
    switch (status) {
      case "valid":
        return "✅ Coupon applied!";
      case "invalid":
        return "❌ Invalid or expired coupon.";
      case "error":
        return "⚠️ Unable to verify coupon right now. Please try again later.";
      default:
        return "";
    }
  }, [status]);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setIsApplying(true);

    try {
      const response = await fetch(
        `/.netlify/functions/coupons?code=${coupon.trim().toUpperCase()}`
      );
      const data = await response.json();

      if (data.success && data.percent_off > 0) {
        const rate = data.percent_off / 100;
        setDiscountRate(rate);
        setAppliedCoupon(coupon.trim().toUpperCase());
        setStatus("valid");
      } else {
        setDiscountRate(0);
        setAppliedCoupon(null);
        setStatus("invalid");
      }
    } catch (error) {
      console.error("❌ Coupon validation error:", error);
      setStatus("error");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Discount Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          disabled={isApplying || status === "valid"}
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={isApplying || status === "valid"}
          className={`px-4 py-2 rounded-lg font-medium text-white ${
            status === "valid"
              ? "bg-green-500 cursor-not-allowed"
              : "bg-[#00454E] hover:bg-[#1D9099]"
          }`}
        >
          {isApplying
            ? "Applying..."
            : status === "valid"
            ? "Applied"
            : "Apply"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "valid"
              ? "text-green-600"
              : status === "invalid"
              ? "text-red-500"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}

      {appliedCoupon && status === "valid" && (
        <p className="text-xs text-gray-500 mt-1">
          Coupon: <strong>{appliedCoupon}</strong>
        </p>
      )}
    </div>
  );
}
