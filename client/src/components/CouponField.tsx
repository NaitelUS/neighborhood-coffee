import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CouponField() {
  const { applyCoupon } = useCart();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code) return;
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/coupons?code=" + code);
      const data = await res.json();

      if (data.valid && data.percent_off) {
        applyCoupon(code, data.percent_off);
        setStatus("valid");
      } else {
        setStatus("invalid");
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setStatus("invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <label className="text-sm font-medium text-gray-700">Coupon</label>
      <div className="flex mt-1 gap-2">
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleApply}
          disabled={loading}
          className="bg-[#00454E] text-white px-3 py-2 rounded-lg text-sm"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>

      {status === "valid" && (
        <p className="text-green-700 text-xs mt-1">
          ✅ Coupon applied successfully
        </p>
      )}
      {status === "invalid" && (
        <p className="text-red-600 text-xs mt-1">
          ❌ Invalid or expired coupon
        </p>
      )}
    </div>
  );
}
