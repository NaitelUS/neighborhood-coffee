// src/pages/OrderStatus.tsx
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

const statusSteps = [
  { key: "received", label: "☕ Order Received" },
  { key: "preparing", label: "👩‍🍳 Preparing" },
  { key: "ready", label: "📦 Ready for Pickup" },
  { key: "delivering", label: "🚗 On the Way" },
  { key: "completed", label: "✅ Completed" },
  { key: "canceled", label: "❌ Canceled" },
];

export default function OrderStatus() {
  const [order, setOrder] = useState<Order | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const id = location.split("/").pop(); // last segment is order number
    if (id) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = orders.find((o: Order) => o.orderNo === parseInt(id));
      if (found) setOrder(found);
    }
  }, [location]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground">
          Please check your order number again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        Order Status - #{order.orderNo}
      </h1>

      <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow">
        <p className="mb-4">
          <strong>Customer:</strong> {order.customer.name}
        </p>
        <p className="mb-4">
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>

        <div className="space-y-3">
          {statusSteps.map((step) => (
            <div
              key={step.key}
              className={`p-3 rounded border ${
                order.status === step.label.split(" ")[1].toLowerCase() ||
                order.status.toLowerCase().includes(step.key)
                  ? "bg-primary/10 border-primary"
                  : "bg-muted"
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
