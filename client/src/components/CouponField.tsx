import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CouponField() {
  const { applyDiscount, appliedCoupon } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setMessage("Please enter a coupon code.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/.netlify/functions/coupons");
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const coupons = await response.json();

      const normalizedCode = coupon.trim().toUpperCase();
      const found = coupons.find(
        (c: any) =>
          c.code?.trim().toUpperCase() === normalizedCode &&
          c.active === true
      );

      if (!found) {
        setMessage("❌ Invalid or expired coupon.");
        return;
      }

      // ✅ Verificación adicional por fechas
      const now = new Date();
      const from = found.valid_from ? new Date(found.valid_from) : null;
      const until = found.valid_until ? new Date(found.valid_until) : null;
      const isValidDate =
        (!from || now >= from) && (!until || now <= until);

      if (!isValidDate) {
        setMessage("❌ This coupon is not valid today.");
        return;
      }

      // ✅ Aplica el descuento al carrito
      applyDiscount(found.code, found.percent_off);

      setMessage(
        `✅ Coupon "${found.code}" applied! You got a ${(found.percent_off * 100).toFixed(0)}% discount.`
      );
    } catch (err) {
      console.error("Error verifying coupon:", err);
      setMessage("⚠️ Unable to verify coupon right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Have a coupon?
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={!!appliedCoupon}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={loading || !!appliedCoupon}
          className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${
              appliedCoupon
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#1D9099] hover:bg-[#00454E] text-white"
            }`}
        >
          {appliedCoupon ? "Applied" : loading ? "Checking..." : "Apply"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
