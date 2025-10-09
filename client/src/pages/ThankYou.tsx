import React, { useEffect, useState } from "react";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/.netlify/functions/orders-get?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data && data.success) {
          setOrder(data.order);
          setItems(data.items || []);
        }
      } catch (e) {
        console.error("ThankYou fetch error:", e);
      }
    }
    if (id) load();
  }, [id]);

  if (!id) return <div className="mt-10 text-center text-gray-500">Order not found</div>;
  if (!order) return <div className="mt-10 text-center text-gray-400">Loading order...</div>;

  const hasDiscount = Number(order.Discount) > 0;
  const coupon = order.Coupon || "";
  const discountRate = order.DiscountRate ? Number(order.DiscountRate) : null; // si lo guardas

  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
      <h1 className="text-2xl font-semibold text-[#00454E]">Thank you!</h1>
      <p className="text-sm text-gray-600">Order ID: <strong>{order.OrderID}</strong></p>

      <h2 className="text-lg font-semibold mt-3">Your Order</h2>
      <ul className="divide-y divide-gray-200">
        {items.map((it, idx) => (
          <li key={idx} className="flex justify-between py-2">
            <div>
              <p className="font-medium">
                {it.ProductName}
                {it.Option ? ` (${it.Option})` : ""}
              </p>
              {it.AddOns && <p className="text-xs text-gray-500">Add-ons: {it.AddOns}</p>}
            </div>
            <div className="font-semibold">${Number(it.Price || 0).toFixed(2)}</div>
          </li>
        ))}
      </ul>

      <div className="border-t pt-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${Number(order.Subtotal || 0).toFixed(2)}</span>
        </div>

        {hasDiscount && (
          <div className="flex justify-between text-green-700">
            <span>Discount {coupon ? `(${coupon}${discountRate ? ` – ${(discountRate*100).toFixed(0)}%` : ""})` : ""}</span>
            <span>- ${Number(order.Discount || 0).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-[#00454E] text-base">
          <span>Total</span>
          <span>${Number(order.Total || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <a href="/" className="underline text-[#00454E]">Back to Menu</a>
      </div>
    </div>
  );
}
