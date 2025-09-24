import React from "react";
import { useCart } from "../hooks/useCart";
import { Link, useParams } from "react-router-dom";

const ThankYou: React.FC = () => {
  const { cartItems, discount } = useCart();
  const { id } = useParams<{ id: string }>();

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
    0
  );

  const total = (subtotal - discount).toFixed(2);

  return (
    <div className="bg-white rounded-md shadow-md p-6 max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">🎉 Thank You!</h1>
      <p className="text-center mb-6">
        Your order has been placed successfully.
      </p>

      <div className="bg-gray-50 border rounded-md p-4 mb-6">
        <p className="font-semibold mb-2">
          Order Number: <span className="text-emerald-700">#{id}</span>
        </p>

        {cartItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item, idx) => (
              <li key={idx} className="py-2">
                <div className="flex justify-between">
                  <span>
                    {item.quantity}× {item.name}
                    {item.variant ? ` — ${item.variant}` : ""}
                    {item.addOns?.length ? (
                      <ul className="ml-4 text-xs text-gray-600 list-disc">
                        {item.addOns.map((add, i) => (
                          <li key={i}>
                            {add.name} (+${add.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No items in order</p>
        )}

        <div className="flex justify-between text-sm mt-3">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to={`/orders-status/${id}`}
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          View Order Status
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
