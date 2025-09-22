// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface OrderItem {
  drinkId: string;
  drinkName: string;
  temperature: "hot" | "iced";
  quantity: number;
  basePrice: number;
  addOns: string[];
  totalPrice: number;
}

interface Order {
  orderNumber: number;
  customer: any;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function ThankYou() {
  const [order, setOrder] = useState<Order | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    // Extraer orderNo de la query string
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get("orderNo");

    if (orderNo) {
      const allOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = allOrders.find((o) => o.orderNumber === Number(orderNo));
      if (found) {
        setOrder(found);
      }
    }
  }, [location]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p>Please check your order number and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1D9099] mb-4">
          Thank you! Your order has been received 🎉
        </h1>
        <p className="text-lg mb-2">
          Your order number is:{" "}
          <span className="font-bold text-[#00454E]">#{order.orderNumber}</span>
        </p>
        <p className="mb-6">
          We’ll start preparing your order soon. You can check its status at any
          time.
        </p>

        {/* Order summary */}
        <div className="text-left max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <ul className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <li key={idx} className="border-b pb-2">
                <span className="font-medium">{item.quantity}x</span>{" "}
                {item.temperature} {item.drinkName}
                {item.addOns.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {" "}
                    (with {item.addOns.join(", ")})
                  </span>
                )}
                <span className="float-right font-semibold">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-lg font-bold">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>

        {/* Link to order status */}
        <div className="mt-8">
          <a
            href={`/order-status/${order.orderNumber}`}
            className="inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-6 py-3 rounded-lg text-lg"
          >
            Track Your Order
          </a>
        </div>
      </div>
    </div>
  );
}
