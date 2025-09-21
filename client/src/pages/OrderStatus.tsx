import { useParams } from "wouter";
import { useEffect, useState } from "react";

interface Order {
  orderNo: number;
  details: string;
  status: string;
}

export default function OrderStatus() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = savedOrders.find((o: Order) => o.orderNo === Number(orderNo));
    setOrder(found || null);
  }, [orderNo]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold">Order Not Found ❌</h1>
        <p className="mt-2 text-muted-foreground">
          Please check your order number and try again.
        </p>
      </div>
    );
  }

  const statusMessages: Record<string, string> = {
    received: "We got your order 📩",
    preparing: "Your coffee is being made ☕",
    ready: "Your drink is ready for pickup 🏠",
    delivering: "Your order is on the way 🚗",
    completed: "Enjoy your coffee! ✅",
    canceled: "This order was canceled ❌",
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif font-bold mb-4">
        Order Status for #{order.orderNo}
      </h1>
      <p className="mb-4 whitespace-pre-line">{order.details}</p>
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold">Current Status:</h2>
        <p className="mt-2 text-lg">{statusMessages[order.status]}</p>
      </div>
    </div>
  );
}
