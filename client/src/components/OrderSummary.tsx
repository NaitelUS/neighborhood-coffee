interface OrderSummaryProps {
  items: any[];
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
}: OrderSummaryProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-2">Your Order</h2>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>
              {item.quantity}x {item.name} ({item.temperature})
            </span>
            <button
              onClick={() => removeItem(idx)}
              className="text-red-600 text-sm"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-sm">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
      </div>

      {!couponApplied && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Coupon code"
            id="coupon-input"
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={() => {
              const code = (
                document.getElementById("coupon-input") as HTMLInputElement
              ).value;
              applyCoupon(code);
            }}
            className="bg-[#1D9099] hover:bg-[#00454E] text-white px-3 rounded"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
