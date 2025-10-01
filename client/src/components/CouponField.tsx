import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CouponField() {
  const { applyDiscount, appliedCoupon } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");

      const data = await res.json();
      const found = data.find(
        (c: any) =>
          c.code.toUpperCase() === coupon.trim().toUpperCase() && c.active
      );

      if (!found) {
        setError("Coupon not found or inactive.");
        return;
      }

      const now = new Date();
      const validFrom = found.valid_from ? new Date(found.valid_from) : null;
      const validUntil = found.valid_until ? new Date(found.valid_until) : null;

      if (validFrom && now < validFrom) {
        setError("Coupon not valid yet.");
        return;
      }
      if (validUntil && now > validUntil) {
        setError("Coupon has expired.");
        return;
      }

      // ✅ Si llega aquí, aplica el descuento
      const discountValue =
        found.percent_off > 1 ? found.percent_off / 100 : found.percent_off;

      applyDiscount(found.code, discountValue);
      setError(null);
      alert(`Coupon ${found.code} applied!`);
    } catch (err) {
      console.error("Error verifying coupon:", err);
      setError("Unable to verify coupon right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Have a coupon?
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={!!appliedCoupon}
          placeholder="Enter your coupon code"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1D9099] focus:outline-none"
        />

        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={loading || !!appliedCoupon}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            appliedCoupon
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1D9099] hover:bg-[#00454E]"
          }`}
        >
          {appliedCoupon ? "Applied" : loading ? "Checking..." : "Apply"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
