import React, { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function CouponField() {
  const { applyDiscount, appliedCoupon } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (!couponCode.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(
        `/.netlify/functions/coupons-check?code=${encodeURIComponent(couponCode.trim())}`
      );

      if (!res.ok) throw new Error("Invalid response from server");

      const data = await res.json();

      if (data.valid && data.discount > 0) {
        applyDiscount(couponCode.trim().toUpperCase(), data.discount);
        setStatus("success");
        setMessage(`✅ Coupon applied! You saved ${(data.discount * 100).toFixed(0)}%.`);
      } else {
        setStatus("error");
        setMessage("❌ Invalid or expired coupon.");
      }
    } catch (err) {
      console.error("Error checking coupon:", err);
      setStatus("error");
      setMessage("⚠️ Unable to verify coupon right now.");
    }
  };

  const disabled = status === "loading" || appliedCoupon !== undefined;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold text-gray-800 mb-2">Have a coupon?</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          disabled={disabled}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter your code"
          className="border rounded-md p-2 w-full text-gray-700 focus:ring-2 focus:ring-amber-400"
        />

        <button
          onClick={handleApply}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-semibold ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {status === "loading" ? "..." : appliedCoupon ? "Applied" : "Apply"}
        </button>
      </div>

      {message && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          {status === "success" && <CheckCircle className="text-green-600 w-4 h-4" />}
          {status === "error" && <XCircle className="text-red-500 w-4 h-4" />}
          <span
            className={`${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </span>
        </div>
      )}
    </div>
  );
}
