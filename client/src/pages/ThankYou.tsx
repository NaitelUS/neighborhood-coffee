import { useEffect, useState } from "react";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const orderNo = searchParams.get("orderNo");

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = orders.find((o: any) => o.orderNo.toString() === orderNo);
    setOrder(found);
  }, [orderNo]);

  if (!order) {
    return <p className="p-6 text-center">Order not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank you! Your order has been received 🎉</h1>
      <p className="mb-6">Order No: <span className="font-mono">{order.orderNo}</span></p>
      
      <h2 className="text-xl font-semibold mb-2">Your Order:</h2>
      <ul className="mb-4">
        {order.items.map((item: any, idx: number) => (
          <li key={idx}>
            {item.quantity}x {item.temperature} {item.drinkName} – ${item.totalPrice.toFixed(2)}
          </li>
        ))}
      </ul>
      
      <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>

      <p className="mt-6">
        You can check your order status here:{" "}
        <a href={`/order-status/${order.orderNo}`} className="text-blue-600 underline">
          Track Order
        </a>
      </p>
    </div>
  );
}
