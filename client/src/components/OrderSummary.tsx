import { useCart } from "@/hooks/useCart";

export default function OrderSummary() {
  const { cartItems, subtotal, discount, total, removeFromCart } = useCart();

  return (
    <div className="border rounded p-4 shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Your Order</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-sm">Your cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map((item, index) => (
            <li
              key={index}
              className="border-b pb-2 flex justify-between items-start"
            >
              <div>
                <p className="font-medium">
                  {item.name} {item.variant && `(${item.variant})`}
                </p>
                {item.addOns && item.addOns.length > 0 && (
                  <ul className="ml-4 list-disc text-sm text-gray-600">
                    {item.addOns.map((a, i) => (
                      <li key={i}>
                        {a.name} (+${(a.price ?? 0).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × ${(item.price ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(((item.price ?? 0) * item.quantity) +
                    (item.addOns?.reduce((sum, a) => sum + (a.price ?? 0), 0) ??
                      0)
                  ).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.name, item.variant)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Totales */}
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${(subtotal ?? 0).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ${(discount ?? 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total</span>
          <span>${(total ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
