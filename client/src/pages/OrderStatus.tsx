// src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useRoute } from "wouter";

interface OrderItem {
  drinkName: string;
  temperature: string;
  quantity: number;
  totalPrice: number;
  addOns: string[];
}

interface Order {
  orderNumber: number;
  customer: any;
  items: OrderItem[];
  total: number;
  status: string;
}

const STATUSES = [
  "Received",
  "In Process",
  "Ready for Pickup",
  "On the Way",
  "Completed",
  "Canceled",
];

export default function OrderStatus() {
  const [match, params] = useRoute("/order-status/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const allOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = allOrders.find((o) => o.orderNumber === Number(params.id));
      if (found) {
        setOrder(found);
      }
    }
  }, [params]);

  const updateStatus = (newStatus: string) => {
    if (!order) return;
    const allOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const updated = allOrders.map((o) =>
      o.orderNumber === order.orderNumber ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrder({ ...order, status: newStatus });
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p>Please check your order number.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-4 text-[#1D9099]">
        Order Status
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg">
          <strong>Order No:</strong> #{order.orderNumber}
        </p>
        <p className="text-lg mb-4">
          <strong>Status:</strong>{" "}
          <span className="text-[#00454E] font-semibold">{order.status}</span>
        </p>

        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        <ul className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <li key={idx} className="border-b pb-2">
              {item.quantity}x {item.temperature} {item.drinkName}
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
        <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
      </div>

      {/* Admin login */}
      {!isAdmin ? (
        <div className="mt-8 text-center">
          <p className="mb-2">Admin access:</p>
          <input
            type="password"
            placeholder="Enter password"
            className="border px-3 py-2 rounded mr-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value === "coffee123") {
                setIsAdmin(true);
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            (Press Enter after typing password)
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`px-4 py-2 rounded ${
                  order.status === status
                    ? "bg-[#1D9099] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
