import { useCart } from "@/hooks/useCart";

interface Props {
  couponApplied: boolean;
  applyCoupon: (code: string) => void;
  discount: number;
  total: number;
  onRemoveItem: (index: number) => void;
}

export default function OrderSummary({
  couponApplied,
  applyCoupon,
  discount,
  total,
  onRemoveItem,
}: Props) {
  const { items, subtotal } = useCart();

  const handleApply = () => {
    const el = document.getElementById("coupon-input") as HTMLInputElement | null;
    if (el?.value) applyCoupon(el.value);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-3">Your Order</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No items added yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const addOnTotal = (item.addOns || []).reduce((s, a) => s + Number(a.price || 0), 0);
            const lineTotal = (Number(item.basePrice || 0) + addOnTotal) * Number(item.quantity || 0);

            return (
              <li key={idx} className="flex flex-col border-b pb-2 last:border-none last:pb-0">
                <div className="flex justify-between items-center">
                  <span>
                    {item.quantity}× {item.name}
                    {item.temperature && ` (${item.temperature})`}
                    {item.option && ` - ${item.option}`}
                  </span>
                  <span className="font-semibold">${lineTotal.toFixed(2)}</span>
                </div>

                {(item.addOns && item.addOns.length > 0) && (
                  <ul className="ml-4 list-disc text-sm text-gray-700">
                    {item.addOns.map((a) => (
                      <li key={a.id}>
                        {a.name} (+${Number(a.price || 0).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => onRemoveItem(idx)}
                  className="text-xs text-red-500 hover:underline mt-1 self-start"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Totales */}
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Cupón */}
      {!couponApplied && (
        <div className="mt-3 flex gap-2">
          <input
            id="coupon-input"
            type="text"
            placeholder="Coupon code"
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleApply}
            className="bg-[#1D9099] text-white px-3 rounded hover:bg-[#00454E]"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
