// src/components/OrderSummary.tsx
import type { OrderItem } from "@shared/schema";

interface Props {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => void;
  couponApplied: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  total,
  applyCoupon,
  couponApplied,
}: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items added yet.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.quantity}x {item.temperature ? `${item.temperature} ` : ""}
              {item.name}
              {item.addOns.length > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  (+{item.addOns.join(", ")})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Totals */}
      <div className="text-sm border-t pt-3 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promotional Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon input */}
      {!couponApplied && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon"
            className="flex-1 border rounded px-2 py-1 text-sm"
            id="couponInput"
          />
          <button
            onClick={() => {
              const input = document.getElementById(
                "couponInput"
              ) as HTMLInputElement;
              if (input && input.value) {
                applyCoupon(input.value.trim());
              }
            }}
            className="bg-[#1D9099] hover:bg-[#00454E] text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
