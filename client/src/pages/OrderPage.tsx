import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import CouponField from "@/components/CouponField";
import { CheckCircle } from "lucide-react";

export default function OrderPage() {
  const { cart, clearCart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Calcular subtotal
  useEffect(() => {
    const sub = cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setSubtotal(sub);
  }, [cart]);

  // Calcular total con descuento
  useEffect(() => {
    const discountedTotal = subtotal * (1 - discount);
    setTotal(discountedTotal);
  }, [subtotal, discount]);

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Summary</h1>

      {/* Lista de productos */}
      <div className="space-y-3 border-b border-border pb-4">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center">
            Your cart is empty ☕
          </p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span>
                {item.name}{" "}
                {item.quantity && item.quantity > 1
                  ? `x${item.quantity}`
                  : ""}
              </span>
              <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      {/* Totales */}
      <div className="border-t border-border mt-4 pt-4 space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({(discount * 100).toFixed(0)}%)</span>
            <span>- ${(subtotal * discount).toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Coupon field debajo del total */}
        <div className="mt-4 pt-2 border-t border-border">
          <p
            className={`flex items-center gap-2 text-sm font-medium mb-2 transition-all duration-500 ${
              discount > 0
                ? "text-green-600 animate-pulseOnce"
                : "text-muted-foreground opacity-90"
            }`}
          >
            {discount > 0 ? (
              <>
                <CheckCircle
                  size={16}
                  strokeWidth={2}
                  className="text-green-600 transition-transform duration-500 scale-110"
                />
                Coupon applied 🎉
              </>
            ) : (
              "Have a coupon?"
            )}
          </p>

          <CouponField onDiscountApply={(val) => setDiscount(val)} />
        </div>
      </div>

      {/* Botón para limpiar carrito */}
      {cart.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
