import { useState } from "react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  id: string;
  name: string;
  temperature?: "hot" | "iced";
  quantity: number;
  basePrice: number;
  addOns: string[];
};

interface Props {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => void;
  couponApplied: boolean;
  removeItem: (index: number) => void;
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  total,
  applyCoupon,
  couponApplied,
  removeItem,
}: Props) {
  const [coupon, setCoupon] = useState("");

  const handleApply = () => {
    if (!couponApplied && coupon.trim() !== "") {
      applyCoupon(coupon);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-3">Your Order</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items added yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => {
            const addOnPrice = item.addOns.length * 0.5; // ajuste según tu `menuData`
            const itemTotal =
              (item.basePrice + addOnPrice) * item.quantity;

            return (
              <li
                key={i}
                className="flex justify-between items-start border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {item.quantity}x {item.name}{" "}
                    {item.temperature && `(${item.temperature})`}
                  </p>
                  {item.addOns.length > 0 && (
                    <ul className="ml-4 text-xs text-gray-600 list-disc">
                      {item.addOns.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold">
                    ${itemTotal.toFixed(2)}
                  </span>
                  <button
                    className="text-xs text-red-500 mt-1"
                    onClick={() => removeItem(i)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Totals */}
      <div className="mt-4 border-t pt-3 text-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </p>
        {discount > 0 && (
          <p className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </p>
        )}
        <p className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </p>
      </div>

      {/* Coupon */}
      {!couponApplied && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 border rounded p-2 text-sm"
          />
          <Button
            className="bg-[#1D9099] hover:bg-[#00454E] text-white"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
