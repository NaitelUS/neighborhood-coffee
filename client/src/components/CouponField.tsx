import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CouponField() {
  const { applyDiscount } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!coupon.trim()) {
      setMessage("⚠️ Please enter a coupon code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // ✅ Llamada directa al endpoint con query
      const response = await fetch(
        `/.netlify/functions/coupons?code=${encodeURIComponent(
          coupon.trim().toUpperCase()
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "❌ Invalid or expired coupon.");
        setLoading(false);
        return;
      }

      // ✅ Aplica el descuento globalmente
      applyDiscount(data.code, data.discount);
      setMessage(
        `✅ Coupon '${data.code}' applied! You got a ${(data.discount * 100).toFixed(
          0
        )}% discount.`
      );
    } catch (error) {
      console.error("Error applying coupon:", error);
      setMessage("⚠️ Unable to verify coupon right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center space-x-2">
      <input
        type="text"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder="Enter coupon code"
        className="border rounded px-3 py-1 text-sm w-40 focus:ring focus:ring-[#1D9099] outline-none"
        disabled={loading}
      />
      <button
        onClick={handleApply}
        disabled={loading}
        className="bg-[#00454E] text-white px-3 py-1 rounded text-sm hover:bg-[#1D9099] transition"
      >
        {loading ? "Checking..." : "Apply"}
      </button>
      {message && (
        <p
          className={`text-sm ${
            message.includes("✅") ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
