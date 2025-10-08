import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import CouponField from "./CouponField";

export default function OrderSummary() {
  const {
    cartItems,
    subtotal,
    discount,
    total,
    removeFromCart,
    updateQty,
    appliedCoupon,
  } = useContext(CartContext);

  const [safeSubtotal, setSafeSubtotal] = useState(0);
  const [safeTotal, setSafeTotal] = useState(0);

  // ✅ Recalcular totales seguros
  useEffect(() => {
    const computedSubtotal = cartItems.reduce((sum, item) => {
      const base = Number(item.price) || 0;
      const addonsTotal = (item.addons || []).reduce(
        (a, b) => a + (Number(b.price) || 0),
        0
      );
      const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
      return sum + (base + addonsTotal) * qty;
    }, 0);

    const computedTotal = computedSubtotal - (discount || 0);

    setSafeSubtotal(Number.isFinite(computedSubtotal) ? computedSubtotal : 0);
    setSafeTotal(Number.isFinite(computedTotal) ? computedTotal : 0);
  }, [cartItems, discount]);

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h3 className="text-xl font-bold text-[#00454E] border-b pb-2">
        Your Order
      </h3>

      {/* 🧾 Lista de productos */}
      <div className="space-y-3">
        {cartItems.map((item, idx) => {
          const hasOptionInName =
            item.option && item.name.includes(`(${item.option})`);
          return (
            <div
              key={`${item.id}-${item.option}-${idx}`}
              className="flex justify-between items-start border-b pb-2"
            >
              {/* Selector de cantidad */}
              <div className="flex items-start space-x-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQty(item.id, -1, item.option)}
                    className="px-2 text-lg font-bold text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-2 w-6 text-center">
                    {Number(item.qty) > 0 ? item.qty : 1}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, +1, item.option)}
                    className="px-2 text-lg font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    {item.name}
                    {!hasOptionInName && item.option && (
                      <span className="text-gray-500"> ({item.option})</span>
                    )}
                  </p>
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Add-ons:{" "}
                      {item.addons
                        .map((a) => `${a.name} ($${Number(a.price).toFixed(2)})`)
                        .join(", ")}
                    </p>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id, item.option)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Precio individual */}
              <div className="text-right font-semibold">
                ${((Number(item.price) || 0) * (Number(item.qty) || 1)).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🏷️ Campo de cupón */}
      <div className="pt-2 border-t">
        <CouponField />
        {appliedCoupon && (
          <p className="text-sm text-green-700 mt-1">
            Applied coupon: <strong>{appliedCoupon}</strong>
          </p>
        )}
      </div>

      {/* Totales */}
      <div className="mt-4 border-t pt-3 text-right">
        <p className="text-sm text-gray-700">
          Subtotal: ${safeSubtotal.toFixed(2)}
        </p>
        {appliedCoupon && discount > 0 && (
          <p className="text-sm text-green-700">
            Discount: -${discount.toFixed(2)}
          </p>
        )}
        <p className="text-lg font-bold text-[#00454E]">
          Total: ${safeTotal.toFixed(2)}
        </p>
      </div>

      {/* ☕ Botón Want more items */}
      <Link
        to="/"
        className="block w-full text-center mt-2 bg-[#00454E] text-white py-2 rounded hover:bg-[#1D9099] transition"
      >
        Want more items?
      </Link>
    </div>
  );
}
