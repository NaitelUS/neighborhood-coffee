import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const { cartItems, discount } = useCart();
  const [status, setStatus] = useState("Received");

  useEffect(() => {
    // Aquí podrías llamar a tu backend para obtener el estado real
    // Por ahora lo simulamos
    setTimeout(() => setStatus("In Process"), 2000);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity +
      ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
    0
  );

  const total = (subtotal - discount).toFixed(2);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-md shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <p className="mb-4">
        Order Number: <span className="text-emerald-700 font-semibold">#{id}</span>
      </p>
      <p className="mb-6">
        Current Status: <span className="font-semibold">{status}</span>
      </p>

      <ul className="divide-y divide-gray-200 mb-4">
        {cartItems.map((item, idx) => (
          <li key={idx} className="py-2">
            <div className="flex justify-between">
              <span>
                {item.quantity}× {item.name}
                {item.variant ? ` — ${item.variant}` : ""}
                {item.addOns?.length ? (
                  <ul className="ml-4 text-xs text-gray-600 list-disc">
                    {item.addOns.map((add, i) => (
                      <li key={i}>{add.name} (+${add.price.toFixed(2)})</li>
                    ))}
                  </ul>
                ) : null}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm">
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
  );
}
