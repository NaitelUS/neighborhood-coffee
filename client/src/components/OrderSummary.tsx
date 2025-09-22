// src/components/OrderSummary.tsx
import { addOnOptions, COUPON_CODE, COUPON_DISCOUNT } from "@/data/menuData";
import type { OrderItem } from "@shared/schema";

type Props = {
  items: OrderItem[];
  couponApplied: boolean;
};

export default function OrderSummary({ items, couponApplied }: Props) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const total = subtotal - discount;

  return (
    <div className="border rounded-xl p-4 bg-card">
      <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-3">
            {items.map((item, idx) => (
              <li key={idx} className="text-sm border-b pb-1">
                {item.quantity}x {item.temperature} {item.drinkName}
                {item.addOns.length > 0 && (
                  <span className="text-muted-foreground"> (with {item.addOns.join(", ")})</span>
                )}
                <span className="float-right font-medium">${item.totalPrice.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-green-700">
                <span>Promotional discount ({COUPON_CODE})</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold mt-1">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
