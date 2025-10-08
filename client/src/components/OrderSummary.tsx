import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const {
    cartItems,
    subtotal,
    discountRate,
    total,
    appliedCoupon,
    updateQty,
    removeFromCart,
  } = useContext(CartContext);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold text-[#00454E] mb-4">
        Your Order
      </h3>

      {/* 🧾 Lista de productos */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cartItems.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-start border-b border-gray-100 pb-2"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {item.name}{" "}
                  {item.option && (
                    <span className="text-gray-500 text-sm">({item.option})</span>
                  )}
                </p>
                {item.addons?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    +{" "}
                    {item.addons
                      .map(
                        (a: any) =>
                          `${a.name || "Unnamed"} ($${(a.price || 0).toFixed(2)})`
                      )
                      .join(", ")}
                  </p>
                )}
                <div className="flex items-center mt-1 space-x-2">
                  <button
                    onClick={() => updateQty(item.id, -1, item.option)}
                    className="border rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    –
                  </button>
                  <span className="text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, +1, item.option)}
                    className="border rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id, item.option)}
                    className="text-xs text-red-600 ml-3 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 💵 Totales */}
      <div className="mt-4 border-t pt-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountRate > 0 && (
          <div className="flex justify-between text-green-700">
            <span>
              Discount{" "}
              {appliedCoupon ? (
                <>
                  ({appliedCoupon} – {(discountRate * 100).toFixed(0)}%)
                </>
              ) : null}
              :
            </span>
            <span>– ${(subtotal * discountRate).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-[#00454E] text-base mt-1">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* 🎟️ Campo de cupón */}
      <div className="mt-4">
        <CouponField />
      </div>
    </div>
  );
}
