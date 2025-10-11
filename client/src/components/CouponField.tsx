import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CouponField() {
  const { applyCoupon, appliedCoupon } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "applied" | "error">("idle");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setStatus("verifying");
    try {
      const result = await applyCoupon(couponCode.trim());
      if (result?.success) {
        setStatus("applied");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleApplyCoupon}
        disabled={status === "verifying"}
        className="w-full sm:w-auto bg-[#00454E] hover:bg-[#00373E] text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
      >
        {status === "verifying"
          ? "Verifying..."
          : status === "applied"
          ? "Applied"
          : "Apply"}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-600 mt-1">
          ⚠️ Invalid coupon or server unavailable.
        </p>
      )}
      {status === "applied" && appliedCoupon && (
        <p className="text-xs text-green-600 mt-1">
          Coupon <strong>{appliedCoupon}</strong> applied successfully!
        </p>
      )}
    </div>
  );
}
