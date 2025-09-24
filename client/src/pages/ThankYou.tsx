import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const ThankYou: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cartItems = [], discount = 0, appliedCoupon } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
    0
  );

  const total = (subtotal - discount).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Thank you for your order!</h1>
      <p className="mb-6 text-gray-600">
        Your order <span className="font-semibold">#{id}</span> has been received.
      </p>

      <h2 className="text-lg font-semibold mb-2">Order Details</h2>
      <ul className="divide-y divide-gray-200 mb-4">
        {cartItems.map((item, idx) => (
          <li key={idx} className="py-2">
            <div className="flex justify-between">
              <span>
                {item.quantity}× {item.name}
                {item.addOns?.length ? (
                  <ul className="ml-4 text-xs text-gray-600 list-disc">
                    {item.addOns.map((add, i) => (
                      <li key={i}>{add.name} (+${add.price.toFixed(2)})</li>
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

      <div className="flex justify-between text-sm mb-1">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <>
          <div className="flex justify-between text-sm text-green-600 mb-1">
            <span>Discount ({appliedCoupon})</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        </>
      )}

      <div className="flex justify-between font-semibold text-base border-t pt-2 mb-6">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <p className="mb-6">
        You can check the status of your order anytime at{" "}
        <Link
          to={`/orders-status/${id}`}
          className="text-brown-600 underline hover:text-brown-700"
        >
          this link
        </Link>.
      </p>

      <Link
        to="/"
        className="bg-brown-600 hover:bg-brown-700 text-white px-4 py-2 rounded"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ThankYou;
