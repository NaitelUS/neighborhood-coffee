import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";

type Order = {
  id: string;
  customer: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  status: "Received" | "In Process" | "Ready" | "Delivered";
  items: {
    name: string;
    variant?: "Hot" | "Iced";
    quantity: number;
    price: number;
    addOns?: { name: string; price: number }[];
  }[];
  subtotal: number;
  discount: number;
  total: number;
};

const AdminOrders: React.FC = () => {
  // Simulación local (en real vendría de la API/backend)
  const { cartItems, discount } = useCart();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1001",
      customer: "John Doe",
      address: "123 Coffee St",
      deliveryDate: "2025-09-23",
      deliveryTime: "09:30",
      status: "Received",
      items: cartItems,
      subtotal: cartItems.reduce(
        (acc, item) =>
          acc +
          item.price * item.quantity +
          ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
        0
      ),
      discount,
      total: cartItems.reduce(
        (acc, item) =>
          acc +
          item.price * item.quantity +
          ((item.addOns?.reduce((a, add) => a + add.price, 0) || 0) * item.quantity),
        0
      ) - discount,
    },
  ]);

  const updateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-md shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-md p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold">
                  Order #{order.id} — {order.customer}
                </p>
                <div className="flex gap-2">
                  {["Received", "In Process", "Ready", "Delivered"].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        updateStatus(order.id, s as Order["status"])
                      }
                      className={`px-3 py-1 text-sm rounded ${
                        order.status === s
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm mb-1">
                Address: <span className="font-medium">{order.address}</span>
              </p>
              <p className="text-sm mb-3">
                Delivery: {order.deliveryDate} at {order.deliveryTime}
              </p>

              <ul className="divide-y divide-gray-200 mb-3">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>
                      {item.quantity}× {item.name}
                      {item.variant ? ` — ${item.variant}` : ""}
                      {item.addOns?.length ? (
                        <ul className="ml-4 text-xs text-gray-600 list-disc">
                          {item.addOns.map((add, i) => (
                            <li key={i}>
                              {add.name} (+${add.price.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- ${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
