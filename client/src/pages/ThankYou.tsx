// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface Order {
  orderNo: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: string[];
  total: number;
  status: string;
}

export default function ThankYou() {
  const [order, setOrder] = useState<Order | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get("orderNo");

    if (orderNo) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = orders.find((o: Order) => o.orderNo === parseInt(orderNo));
      if (found) setOrder(found);
    }
  }, [location]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn’t find your order. Please check again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        Thank you! Your order has been received 🎉
      </h1>
      <p className="mb-6 text-lg">
        <strong>Order No:</strong> {order.orderNo}
      </p>

      <div className="bg-card shadow rounded-lg p-6 max-w-xl mx-auto text-left">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p>
          <strong>Name:</strong> {order.customer.name}
        </p>
        <p>
          <strong>Email:</strong> {order.customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.customer.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.customer.address}
        </p>
        <p className="mt-4">
          <strong>Items:</strong>
        </p>
        <ul className="list-disc ml-6">
          {order.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 font-bold">
          Total: ${order.total.toFixed(2)}
        </p>
        <p className="mt-2">
          <strong>Status:</strong> {order.status}
        </p>
      </div>

      <div className="mt-6">
        <a
          href={`/order-status/${order.orderNo}`}
          className="text-primary underline hover:text-primary/80"
        >
          Check your order status here
        </a>
      </div>
    </div>
  );
}
