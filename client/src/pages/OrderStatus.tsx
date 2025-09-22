import { useParams } from "wouter";
import { useEffect, useState } from "react";

export default function OrderStatus() {
  const params = useParams(); // obtiene { orderNo }
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      const parsed = JSON.parse(lastOrder);
      if (parsed.orderNo.toString() === params.orderNo) {
        setOrder(parsed);
      }
    }
  }, [params.orderNo]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order found with this number.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full bg-card shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          Order Status for #{order.orderNo}
        </h1>

        <div className="border-t pt-4 space-y-2">
          <p><b>Name:</b> {order.customer.name}</p>
          <p><b>Email:</b> {order.customer.email}</p>
          <p><b>Phone:</b> {order.customer.phone}</p>

          <h2 className="text-lg font-semibold mt-4">Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            {order.items.map((item: any, idx: number) => (
              <li key={idx}>
                {item.quantity}x {item.temperature} {item.drinkName} - $
                {item.totalPrice.toFixed(2)}
              </li>
            ))}
          </ul>

          <p className="font-bold mt-4">TOTAL: ${order.total}</p>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
            <p className="text-blue-700 font-semibold">
              Current Status: Order Received ✅
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Your order is being processed, please stay tuned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
