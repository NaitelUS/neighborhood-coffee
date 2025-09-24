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
    variant?: string;
    quantity: number;
    price: number;
    addOns?: { name: string; price: number }[];
  }[];
  subtotal: number;
  discount: number;
  total: number;
};

export default function AdminOrders() {
  const { cartItems, discount } = useCart();

  // Simulación de orden inicial con items actuales del carrito
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
          ((item.price ?? 0) * item.quantity) +
          ((item.addOns?.reduce((a, add) => a + (add.price ?? 0), 0) || 0) *
            item.quantity),
        0
      ),
      discount: discount ?? 0,
      total:
        cartItems.reduce(
          (acc, item) =>
            acc +
            ((item.price ?? 0) * item.quantity) +
            ((item.addOns?.reduce((a, add) => a + (add.price ?? 0), 0) || 0) *
              item.quantity),
          0
        ) - (discount ?? 0),
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
                    <div>
                      {item.quantity}× {item.name}
                      {item.variant ? ` — ${item.variant}` : ""}
                      {item.addOns && item.addOns.length > 0 && (
                        <ul className="ml-4 text-xs text-gray-600 list-disc">
                          {item.addOns.map((add, i) => (
                            <li key={i}>
                              {add.name} (+${(add.price ?? 0).toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <span>${((item.price ?? 0) * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${(order.subtotal ?? 0).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- ${(order.discount ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${(order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
