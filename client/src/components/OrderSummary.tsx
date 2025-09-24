import React from "react";
import { useCart } from "@/hooks/useCart";

export default function OrderSummary() {
  const { cartItems, subtotal, discount, total, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Your Order</h2>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">No items in cart</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-3">
          {cartItems.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-start py-2 text-sm"
            >
              <div>
                {item.quantity ?? 1}× {item.name}
                {item.variant ? ` — ${item.variant}` : ""}
                {item.addOns && item.addOns.length > 0 && (
                  <ul className="ml-4 text-xs text-gray-600 list-disc">
                    {item.addOns.map((add, i) => (
                      <li key={i}>
                        {add.name} (+${(add.price ?? 0).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-right">
                ${(((item.price ?? 0) * (item.quantity ?? 1))).toFixed(2)}
                <button
                  onClick={() => removeFromCart(idx)}
                  className="ml-2 text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${(subtotal ?? 0).toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>- ${(discount ?? 0).toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
        <span>Total</span>
        <span>${(total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
