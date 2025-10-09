// client/src/components/CouponField.tsx
import React, { useState, useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";

export default function CouponField() {
  const { applyDiscount, appliedCoupon } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // si ya hay cupón aplicado, bloquear UI
  const isApplied = useMemo(() => !!appliedCoupon, [appliedCoupon]);

  const handleApply = async () => {
    if (!coupon.trim()) {
      setMessage("⚠️ Please enter a coupon code.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const code = coupon.trim().toUpperCase();
      const res = await fetch(
        `/.netlify/functions/coupons?code=${encodeURIComponent(code)}`
      );
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMessage(data?.message || "❌ Invalid or expired coupon.");
        setLoading(false);
        return;
      }

      // aplicar y fijar el input al código normalizado
      applyDiscount(data.code, Number(data.discount) || 0);
      setCoupon(String(data.code || code));
      setMessage(
        `✅ Coupon '${data.code}' applied! You got a ${(Number(data.discount) * 100).toFixed(0)}% discount.`
      );
    } catch (e) {
      console.error(e);
      setMessage("⚠️ Unable to verify coupon right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      <input
        type="text"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder="Enter coupon code"
        className="border rounded px-3 py-1 text-sm w-44 focus:ring focus:ring-[#1D9099] outline-none disabled:opacity-60"
        disabled={loading || isApplied}
      />
      <button
        onClick={handleApply}
        disabled={loading || isApplied}
        className="bg-[#00454E] text-white px-3 py-1 rounded text-sm hover:bg-[#1D9099] transition disabled:opacity-60"
      >
        {isApplied ? "Applied ✓" : loading ? "Checking..." : "Apply"}
      </button>
      {appliedCoupon && (
        <span className="text-sm text-green-700">Coupon: <strong>{appliedCoupon}</strong></span>
      )}
      {message && (
        <p className={`text-sm ${message.includes("✅") ? "text-green-700" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
