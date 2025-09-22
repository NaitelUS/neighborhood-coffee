import { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = orders.find((o: any) => o.orderNo.toString() === id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return <p className="p-6 text-center">Order not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <p className="mb-2">Order No: <span className="font-mono">{order.orderNo}</span></p>
      <p className="mb-6">Current Status: <strong>{order.status}</strong></p>

      <h2 className="text-xl font-semibold mb-2">Order Details:</h2>
      <ul className="mb-4">
        {order.items.map((item: any, idx: number) => (
          <li key={idx}>
            {item.quantity}x {item.temperature} {item.drinkName} – ${item.totalPrice.toFixed(2)}
          </li>
        ))}
      </ul>

      <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
    </div>
  );
}
