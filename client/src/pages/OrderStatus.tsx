// src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useRoute } from "wouter";

export default function OrderStatus() {
  const [match, params] = useRoute("/order-status/:id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrder(orders.find((o: any) => String(o.orderNo) === String(params.id)) || null);
  }, [params]);

  if (!order) {
    return <div className="container mx-auto px-4 py-10 text-center">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Order Status</h1>
      <div className="max-w-xl mx-auto bg-card p-4 rounded border">
        <p className="mb-2"><strong>Order No:</strong> #{order.orderNo}</p>
        <p className="mb-4"><strong>Status:</strong> {order.status}</p>

        <h2 className="text-lg font-semibold mb-2">Order Details</h2>
        <ul className="space-y-1 mb-3 text-sm">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="border-b pb-1">
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
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
