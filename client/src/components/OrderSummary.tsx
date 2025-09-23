import React from "react";
import { useCart } from "../hooks/useCart";

const OrderSummary: React.FC = () => {
  const { cartItems = [], discount = 0 } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
    0
  );

  const total = (subtotal - discount).toFixed(2);

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Your Order</h2>
      {cartItems?.length === 0 ? (
        <p className="text-sm text-gray-500">No items in cart</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-3">
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
      )}

      <div className="flex justify-between text-sm mb-1">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600 mb-1">
          <span>Discount (Coupon)</span>
          <span>- ${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-base border-t pt-2">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
