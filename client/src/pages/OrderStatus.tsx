import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const statusMap: Record<string, string> = {
  received: "☕ Order Received – we got it!",
  preparing: "👨‍🍳 In Process – barista is preparing your drink.",
  ready: "📦 Ready for Pickup – come grab it!",
  delivering: "🚗 On the Way – your coffee is being delivered.",
  completed: "✅ Completed – enjoy your drink!",
  canceled: "❌ Canceled – this order is no longer active.",
};

export default function OrderStatus() {
  const [location] = useLocation();
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("orderNo");
    if (no) {
      setOrderNo(no);
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = orders.find((o: any) => String(o.orderNo) === no);
      if (found) setOrder(found);
    }
  }, [location]);

  if (!orderNo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order number provided.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order found with number {orderNo}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full bg-card shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-serif font-bold text-primary mb-4">
          Order Status
        </h1>
        <p className="text-lg font-semibold mb-2">Order No: {orderNo}</p>

        <p className="mb-4">
          {statusMap[order.status] || "⏳ Status not available"}
        </p>

        <h2 className="font-bold mb-2">Order Summary</h2>
        <ul className="list-disc list-inside text-sm text-left space-y-1">
          {order.items.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <p className="font-semibold mt-2">Total: ${order.total.toFixed(2)}</p>
      </div>
    </div>
  );
}
