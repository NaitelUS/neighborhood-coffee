import { useEffect, useState } from "react";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No recent order found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full bg-card shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          Thank you! Your order has been received 🎉
        </h1>
        <p className="text-center text-muted-foreground">
          Order No: <b>{order.orderNo}</b>
        </p>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <ul className="list-disc pl-5 space-y-1">
            {order.items.map((item: any, idx: number) => (
              <li key={idx}>
                {item.quantity}x {item.temperature} {item.drinkName} - $
                {item.totalPrice.toFixed(2)}
              </li>
            ))}
          </ul>
          {order.customer.couponApplied && (
            <p className="text-green-600 mt-2">
              Promotional discount applied ✔
            </p>
          )}
          <p className="font-bold mt-3">TOTAL: ${order.total}</p>
        </div>

        <div className="mt-6 text-center">
          <a
            href={`/status/${order.orderNo}`}
            className="text-primary underline"
          >
            Check your order status
          </a>
        </div>
      </div>
    </div>
  );
}
