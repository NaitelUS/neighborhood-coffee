import React, { useState } from "react";
import { getCoupons } from "@/api/api";

interface CouponFieldProps {
  onDiscountApply: (discount: number) => void;
}

export default function CouponField({ onDiscountApply }: CouponFieldProps) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setError("");

    try {
      const coupons = await getCoupons();
      console.log("Coupons fetched:", coupons);

      // Buscar cupón activo
      const found = coupons.find(
        (c: any) =>
          c.Code?.toUpperCase() === coupon.trim().toUpperCase() && c.Active
      );

      if (!found) {
        setError("❌ Invalid or expired coupon.");
        onDiscountApply(0);
        return;
      }

      const discountValue = Number(found.Discount || 0);
      setDiscount(discountValue);
      setApplied(true);
      onDiscountApply(discountValue);
    } catch (err) {
      console.error("Error verifying coupon:", err);
      setError("⚠️ Unable to verify coupon right now.");
      onDiscountApply(0);
    }
  };

  return (
    <div className="mt-6">
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

      {/* Mostrar mensajes */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {applied && discount > 0 && (
        <p className="text-green-600 text-sm mt-2">
          Coupon applied: <strong>{(discount * 100).toFixed(0)}% OFF</strong>
        </p>
      )}
    </div>
  );
}
