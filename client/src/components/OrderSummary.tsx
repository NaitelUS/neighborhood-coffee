import { CartItem, useCart } from "@/hooks/useCart";

interface Props {
  couponApplied: boolean;
  applyCoupon: (code: string) => void;
  discount: number;
  total: number;
}

export default function OrderSummary({
  couponApplied,
  applyCoupon,
  discount,
  total,
}: Props) {
  const { cartItems, removeItem, subtotal } = useCart();

  const handleApply = () => {
    const code = (document.getElementById("coupon-input") as HTMLInputElement)
      ?.value;
    if (code) applyCoupon(code);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-3">Your Order</h2>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-600">No items added yet.</p>
      ) : (
        <ul className="space-y-3">
          {cartItems.map((item: CartItem, idx) => (
            <li
              key={idx}
              className="flex flex-col border-b pb-2 last:border-none last:pb-0"
            >
              <div className="flex justify-between items-center">
                <span>
                  {item.quantity}× {item.name}{" "}
                  {item.temperature && `(${item.temperature})`}
                  {item.option && ` - ${item.option}`}
                </span>
                <span className="font-semibold">
                  $
                  {(
                    (item.basePrice +
                      item.addOns.reduce((sum, a) => sum + a.price, 0)) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>

              {/* Mostrar add-ons con Display name */}
              {item.addOns.length > 0 && (
                <ul className="ml-4 list-disc text-sm text-gray-700">
                  {item.addOns.map((a) => (
                    <li key={a.id}>
                      {a.name} (+${a.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              )}

              {/* Botón para eliminar item */}
              <button
                onClick={() => removeItem(idx)}
                className="text-xs text-red-500 hover:underline mt-1 self-start"
              >
                Remove
              </button>
            </li>
          ))}
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
