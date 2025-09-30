import React, { useState } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(
  import.meta.env.AIRTABLE_BASE_ID
);

const TABLE_COUPONS = import.meta.env.AIRTABLE_TABLE_COUPONS || "Coupons";

interface CouponFieldProps {
  onApply?: (discount: number) => void;
}

export default function CouponField({ onApply }: CouponFieldProps) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setError("");

    try {
      const records = await base(TABLE_COUPONS)
        .select({
          filterByFormula: `AND({Code}='${coupon}', {Active}=TRUE())`,
        })
        .all();

      if (records.length === 0) {
        setError("❌ Invalid or expired coupon.");
        return;
      }

      const record = records[0];
      const discountValue = record.get("Discount") || 0;
      setDiscount(Number(discountValue));
      setApplied(true);
      if (onApply) onApply(Number(discountValue));
    } catch (err) {
      console.error("Error checking coupon:", err);
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
