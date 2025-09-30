import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

export default function OrderSummary() {
  const { cart, clearCart } = useCart();
  const { showToast, Toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  const applyCoupon = async () => {
    if (!couponCode) {
      showToast("⚠️ Enter a coupon code first", "info");
      return;
    }
    if (appliedCoupon) {
      showToast("⚠️ Coupon already applied", "info");
      return;
    }

    try {
      setIsApplying(true);
      const res = await fetch("/.netlify/functions/coupons");
      const coupons = await res.json();

      const found = coupons.find(
        (c: any) =>
          c.code?.toLowerCase() === couponCode.trim().toLowerCase() &&
          c.active !== false
      );

      if (!found) {
        showToast("❌ Invalid or expired coupon", "error");
        return;
      }

      // 🔹 Valid coupon: calculate discount
      let discountValue = 0;
      if (found.type === "percent") {
        discountValue = subtotal * (found.value / 100);
      } else if (found.type === "amount") {
        discountValue = found.value;
      }

      setDiscount(discountValue);
      setAppliedCoupon(found.code);
      showToast(`✅ Coupon ${found.code} applied!`, "success");
    } catch (err) {
      console.error(err);
      showToast("❌ Error applying coupon", "error");
    } finally {
      setIsApplying(false);
    }
  };

  const clearCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
    showToast("Coupon cleared", "info");
  };

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {cart.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between text-gray-700 text-sm"
              >
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-gray-700 text-sm mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 text-sm mb-2">
                <span>Discount ({appliedCoupon})</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-gray-900 text-base mb-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon"
                className="flex-1 border rounded px-3 py-2 text-sm"
                disabled={!!appliedCoupon}
              />
              <button
                onClick={applyCoupon}
                disabled={isApplying || !!appliedCoupon}
                className={`px-4 py-2 text-sm font-semibold rounded transition ${
                  appliedCoupon
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {appliedCoupon ? "Applied" : isApplying ? "..." : "Apply"}
              </button>
            </div>

            {appliedCoupon && (
              <button
                onClick={clearCoupon}
                className="text-xs text-red-500 underline"
              >
                Remove coupon
              </button>
            )}
          </div>
        </>
      )}

      <Toast />
    </div>
  );
}
