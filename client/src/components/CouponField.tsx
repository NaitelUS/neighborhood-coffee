import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CouponField() {
  // Si tu contexto no expone applyDiscount, usa setAppliedCoupon y setDiscount
  const { applyDiscount, setAppliedCoupon, setDiscount, appliedCoupon } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setMessage("Please enter a coupon code.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ✅ Llamamos al backend con el código
      const res = await fetch(`/.netlify/functions/coupons?code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (!res.ok) {
        // Errores claros desde el backend
        setMessage(
          data?.error
            ? `❌ ${data.error}`
            : "❌ Invalid or expired coupon."
        );
        return;
      }

      // Soporta ambas formas: objeto {success, percent_off} o, si tuvieras un listado, lo normaliza
      let percent: number | null = null;

      if (data && typeof data === "object" && "percent_off" in data) {
        percent = Number(data.percent_off);
      } else if (Array.isArray(data)) {
        const found = data.find(
          (c: any) => String(c.code).trim().toUpperCase() === code && c.active === true
        );
        percent = found ? Number(found.percent_off) : null;
      }

      if (!percent || Number.isNaN(percent) || percent <= 0) {
        setMessage("❌ Invalid or expired coupon.");
        return;
      }

      // ✅ Aplica el descuento decimal (0.10 = 10%)
      if (typeof applyDiscount === "function") {
        applyDiscount(code, percent);
      } else {
        // fallback por si tu contexto no tiene applyDiscount
        setAppliedCoupon?.(code);
        setDiscount?.(percent);
      }

      setMessage(`✅ Coupon "${code}" applied! You got ${(percent * 100).toFixed(0)}% OFF.`);
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
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
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
