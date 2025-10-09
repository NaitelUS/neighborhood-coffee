import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CouponField from "./CouponField";

const OrderSummary: React.FC = () => {
  const { cart, subtotal, discount, total } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-md text-center">
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-[#00454E] mb-3">Your Order</h2>

      {/* 🧾 Lista de productos */}
      <ul className="divide-y divide-gray-200 mb-4">
        {cart.map((item, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <div className="flex flex-col text-sm">
              <span className="font-medium">
                {item.name} {item.option ? `(${item.option})` : ""}
              </span>
              {item.addons && item.addons.length > 0 && (
                <span className="text-gray-500 text-xs">
                  {item.addons.map((a) => a.name).join(", ")}
                </span>
              )}
              <span className="text-xs text-gray-400">
                Qty: {item.quantity}
              </span>
            </div>
            <span className="font-medium text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* 💲Resumen de totales */}
      <div className="border-t border-gray-200 pt-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Discount</span>
          <span>− ${(subtotal * discount).toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-[#00454E] mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* 🏷️ Campo de cupón */}
      <div className="mt-4">
        <CouponField />
      </div>
    </div>
  );
};

export default OrderSummary;
