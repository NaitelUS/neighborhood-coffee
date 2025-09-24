import { useParams, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export default function ThankYou() {
  const { id } = useParams<{ id: string }>();
  const { cartItems, subtotal, discount, total } = useCart();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="mb-4">
        Your order number is <span className="font-semibold">#{id}</span>.
      </p>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart was empty.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {cartItems.map((item, index) => (
            <li key={index} className="border-b pb-2">
              <div className="flex justify-between">
                <p>
                  {item.name} {item.variant && `(${item.variant})`}
                  <span className="ml-2 text-sm text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </p>
                <span>
                  ${(((item.price ?? 0) * item.quantity) +
                    (item.addOns?.reduce((sum, a) => sum + (a.price ?? 0), 0) ??
                      0)
                  ).toFixed(2)}
                </span>
              </div>
              {item.addOns && item.addOns.length > 0 && (
                <ul className="ml-4 list-disc text-sm text-gray-600">
                  {item.addOns.map((a, i) => (
                    <li key={i}>
                      {a.name} (+${(a.price ?? 0).toFixed(2)})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Totales */}
      <div className="space-y-1 text-sm">
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

      <Link
        to="/"
        className="inline-block mt-6 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
