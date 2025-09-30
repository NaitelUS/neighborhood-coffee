import React, { useState } from "react";

export default function CouponField() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
  setError("");

  try {
    const res = await fetch("/.netlify/functions/coupons-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon }),
    });

    const data = await res.json();

    if (!data.valid) {
      setError("❌ Invalid or expired coupon.");
      return;
    }

    setDiscount(data.discount);
    setApplied(true);
  } catch (err) {
    console.error("Error verifying coupon:", err);
    setError("⚠️ Unable to verify coupon right now.");
  }
};

  return (
    <div className="mt-6">
      <label className="block text-sm mb-1 font-medium">Coupon Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon"
          className="flex-1 border border-border rounded-md px-3 py-2 bg-background text-foreground"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={applied}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={applied || !coupon.trim()}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            applied
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {applied ? "✅ Applied" : "Apply"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {applied && (
        <p className="text-green-600 text-sm mt-2">
          Coupon applied: <strong>- ${discount.toFixed(2)}</strong>
        </p>
      )}
    </div>
  );
}
