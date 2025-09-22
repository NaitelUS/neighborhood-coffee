// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);
  const orderNo = new URLSearchParams(window.location.search).get("orderNo");

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = orders.find((o: any) => String(o.orderNo) === String(orderNo));
    setOrder(found || null);
  }, [orderNo]);

  if (!order) {
    return <div className="container mx-auto px-4 py-10 text-center">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-3">Thank you! Your order has been received 🎉</h1>
      <p className="mb-4">Order No: <span className="font-mono">#{order.orderNo}</span></p>

      <div className="max-w-xl mx-auto text-left bg-card p-4 rounded border">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <ul className="space-y-2 mb-3">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="border-b pb-1 text-sm">
              {item.quantity}x {item.temperature} {item.drinkName}
              {item.addOns?.length > 0 && (
                <span className="text-muted-foreground"> (with {item.addOns.join(", ")})</span>
              )}
              <span className="float-right font-medium">${item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${(order.subtotal ?? order.total)?.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Promotional discount</span>
              <span>- ${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold mt-1">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={`/order-status/${order.orderNo}`}
          className="inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-5 py-2 rounded"
        >
          Track your order
        </a>
      </div>
    </div>
  );
}
