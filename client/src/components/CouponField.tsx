import React, { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function CouponField() {
  const cart = useContext(CartContext);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "error">("idle");
  const [busy, setBusy] = useState(false);

  const message = useMemo(() => {
    switch (status) {
      case "valid": return "✅ Coupon applied!";
      case "invalid": return "❌ Invalid or expired coupon.";
      case "error": return "⚠️ Unable to verify coupon right now.";
      default: return "";
    }
  }, [status]);

  const apply = async () => {
    if (!code.trim() || !cart) return;
    setBusy(true);
    try {
      const res = await fetch(`/.netlify/functions/coupons?code=${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();
      // Se espera { success: true, percent_off: number, code: string, active: 1|0 }
      if (data && data.success && data.percent_off > 0 && data.active) {
        cart.setDiscountRate(data.percent_off / 100);
        cart.setAppliedCoupon(code.trim().toUpperCase());
        setStatus("valid");
      } else {
        cart.setDiscountRate(0);
        cart.setAppliedCoupon(null);
        setStatus("invalid");
      }
    } catch (e) {
      console.error("Coupon error:", e);
      setStatus("error");
    } finally {
      setBusy(false);
    }
  };

  const applied = cart?.appliedCoupon && cart.discountRate > 0;

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={applied ? cart?.appliedCoupon || "" : code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          disabled={busy || applied}
        />
        <button
          type="button"
          onClick={apply}
          disabled={busy || applied}
          className={`px-4 py-2 rounded-lg font-medium text-white ${
            applied ? "bg-green-500 cursor-not-allowed" : "bg-[#00454E] hover:bg-[#1D9099]"
          }`}
        >
          {applied ? "Applied" : busy ? "Applying..." : "Apply"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "valid" ? "text-green-600" : status === "invalid" ? "text-red-500" : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}
      {applied && (
        <p className="text-xs text-gray-500 mt-1">
          Coupon: <strong>{cart?.appliedCoupon}</strong> – {(cart?.discountRate * 100).toFixed(0)}%
        </p>
      )}
    </div>
  );
}
