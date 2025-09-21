import { useParams } from "wouter";
import { useEffect, useState } from "react";

type Order = {
  orderNumber: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: { drinkName: string; temperature: string; quantity: number; totalPrice: number }[];
  total: number;
  status: string;
};

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // 🔧 Simulación de fetch (cuando tengamos backend se cambia aquí)
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
    const found = savedOrders.find((o) => o.orderNumber === Number(id));
    setOrder(found || null);
  }, [id]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p>Please check your order number and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <div className="bg-white shadow rounded p-6">
        <p className="mb-2"><strong>Order No:</strong> {order.orderNumber}</p>
        <p className="mb-2"><strong>Name:</strong> {order.customer.name}</p>
        <p className="mb-2"><strong>Email:</strong> {order.customer.email}</p>
        <p className="mb-2"><strong>Phone:</strong> {order.customer.phone}</p>
        <p className="mb-4"><strong>Status:</strong> {order.status}</p>

        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="list-disc ml-6 mb-4">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.temperature} {item.drinkName} - $
              {item.totalPrice.toFixed(2)}
            </li>
          ))}
        </ul>

        <p className="font-bold">TOTAL: ${order.total.toFixed(2)}</p>
      </div>
    </div>
  );
}
