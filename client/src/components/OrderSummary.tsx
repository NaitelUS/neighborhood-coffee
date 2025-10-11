import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";

export default function OrderSummary() {
  const { cartItems, removeFromCart, subtotal, discount, total } =
    useContext(CartContext);

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {cartItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Your cart is empty.
          </div>
        ) : (
          cartItems.map((item, i) => {
            const qty = Number(item.qty || 1);
            const base = Number(item.basePrice ?? item.price ?? 0);
            const addonsTotal = Array.isArray(item.addons)
              ? item.addons.reduce((sum, a) => sum + Number(a.price || 0), 0)
              : 0;
            const line = (base + addonsTotal) * qty;

            return (
              <div
                key={i}
                className="p-4 flex items-start justify-between hover:bg-amber-50/40 transition"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {item.name} {item.option && `(${item.option})`}
                  </div>
                  {item.addons?.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Add-ons: {item.addons.map((a) => a.name).join(", ")}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">Qty: {qty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">${line.toFixed(2)}</div>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Coupon */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[#5a3825] mb-2">Coupon</h3>
        <CouponField />
      </div>

      {/* Totales */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal?.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>Discount</span>
            <span>- ${discount?.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-[#5a3825] text-base mt-1">
          <span>Total</span>
          <span>${total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Botón final */}
      <button
        id="place-order-button"
        type="submit"
        form="customer-info-form"
        className="w-full bg-[#00454E] hover:bg-[#00373E] text-white py-3 rounded-xl font-semibold transition"
      >
        Place Order
      </button>
    </div>
  );
}
