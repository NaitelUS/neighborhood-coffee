import { useCart } from "@/hooks/useCart";
import { addOnOptions, COUPON_CODE, COUPON_DISCOUNT } from "@/data/menuData";
import { useState } from "react";

export default function OrderSummary() {
  const { cart, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState<number>(0);

  const subtotal = (cart ?? []).reduce((sum, item) => {
    const addOnsTotal =
      item.addOns?.reduce((aSum, addOnId) => {
        const addOn = addOnOptions.find((o) => o.id === addOnId);
        return aSum + (addOn ? addOn.price : 0);
      }, 0) ?? 0;

    return sum + (item.price + addOnsTotal) * item.quantity;
  }, 0);

  const total = subtotal - discountApplied;

  const applyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();
    if (normalized === COUPON_CODE) {
      setDiscountApplied(subtotal * COUPON_DISCOUNT);
    } else {
      alert("Invalid coupon code");
      setDiscountApplied(0);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Your Order</h3>

      {(cart ?? []).length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="divide-y">
          {(cart ?? []).map((item, idx) => (
            <li key={idx} className="py-2">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">
                    {item.name} {item.option ? `(${item.option})` : ""}
                  </span>
                  <div className="text-xs text-gray-600">
                    Qty: {item.quantity}
                  </div>
                  {item.addOns?.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Add-ons:{" "}
                      {item.addOns
                        .map(
                          (id) =>
                            addOnOptions.find((a) => a.id === id)?.name || id
                        )
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                  <button
                    className="ml-2 text-red-500 text-xs"
                    onClick={() => removeFromCart(idx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discountApplied > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Coupon applied</span>
          <span>- ${discountApplied.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Coupon field */}
      <div className="flex mt-3 gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon"
          className="flex-1 border px-2 py-1 rounded"
        />
        <button
          type="button"
          onClick={applyCoupon}
          disabled={discountApplied > 0}
          className={`px-3 rounded text-white ${
            discountApplied > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
