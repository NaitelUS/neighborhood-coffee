import { useEffect, useState } from "react";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get("orderNo");
    if (orderNo) {
      const stored = localStorage.getItem(`order-${orderNo}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, []);

  if (!order) {
    return <p className="p-6">Order not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
      <p>Your order has been received.</p>
      <p className="mt-2">Order #: {order.orderNo}</p>
      <h2 className="mt-4 font-bold">Summary</h2>
      <ul>
        {order.items.map((item: any, idx: number) => (
          <li key={idx}>
            {item.quantity}x {item.name} ({item.temperature})
          </li>
        ))}
      </ul>
      <p className="mt-2">Total: ${order.total.toFixed(2)}</p>
    </div>
  );
}
