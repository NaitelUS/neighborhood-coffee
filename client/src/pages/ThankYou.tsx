import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ThankYou() {
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
        <p>No order found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full bg-card shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-serif font-bold text-primary mb-4">
          Thank you! Your order has been received 🎉
        </h1>

        <p className="text-lg font-semibold mb-2">Order No: {orderNo}</p>

        {order && (
          <div className="text-left mb-4">
            <h2 className="font-bold mb-2">Order Summary</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {order.items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="font-semibold mt-2">
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4">
          You can check your order status anytime here:
        </p>

        <a
          href={`/order-status?orderNo=${orderNo}`}
          className="inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded-lg font-medium"
        >
          View Order Status
        </a>
      </div>
    </div>
  );
}
