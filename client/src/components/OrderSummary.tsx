import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CouponField from "./CouponField";
import { formatProductName } from "../utils/formatProductName";

export default function OrderSummary() {
  const {
    cartItems,
    updateQty,
    removeFromCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Your cart is empty ☕
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h2 className="text-xl font-bold text-[#00454E] border-b pb-2">
        Your Order
      </h2>

      <div className="space-y-3">
        {cartItems.map((item) => {
          // ✅ Calcular AddOns solo una vez por item
          const addonsTotal = item.addons
            ? item.addons.reduce(
                (sum: number, addon: any) => sum + (addon.price || 0),
                0
              )
            : 0;

          const itemTotal = (item.price + addonsTotal) * item.qty;

          return (
            <div
              key={`${item.id}-${item.option || ""}`}
              className="flex items-center justify-between border-b pb-2"
            >
              {/* Controles de cantidad */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQty(item.id, item.option, -1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.option, 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Descripción del producto */}
              <div className="flex-1 px-3">
                <p className="font-semibold">
                  {formatProductName(item.name, item.option)}
                </p>
                {item.addons && item.addons.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Add-ons:{" "}
                    {item.addons
                      .map(
                        (a: any) =>
                          `${a.name} (+$${(a.price || 0).toFixed(2)})`
                      )
                      .join(", ")}
                  </p>
                )}
              </div>

              {/* Precio final */}
              <div className="text-right">
                <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id, item.option)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totales */}
      <div className="border-t pt-3 text-right space-y-1">
        <p>
          Subtotal:{" "}
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </p>
        {appliedCoupon && (
          <p className="text-sm text-green-600">
            Discount ({appliedCoupon}): -{(discount * 100).toFixed(0)}%
          </p>
        )}
        <p className="text-lg font-bold text-[#00454E]">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <CouponField />
    </div>
  );
}
