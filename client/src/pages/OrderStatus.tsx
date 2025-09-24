// client/src/pages/OrderStatus.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: string;
  address?: string;
}

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  // Cargar orden por ID
  const loadOrder = () => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      const orders: Order[] = JSON.parse(saved);
      const found = orders.find((o) => o.id === id);
      setOrder(found || null);
    }
  };

  useEffect(() => {
    loadOrder();

    // Refrescar cada 3s en caso de cambios desde Admin
    const interval = setInterval(() => {
      loadOrder();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-gray-500 mt-2">
          We couldn't find an order with ID: {id}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>

      <div className="border rounded-lg p-4 space-y-2">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Customer:</strong> {order.customerName}
        </p>
        <p>
          <strong>Items:</strong> {order.items.join(", ")}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-blue-600 font-semibold">{order.status}</span>
        </p>
        {order.address && (
          <p>
            <strong>Delivery Address:</strong> {order.address}
          </p>
        )}
      </div>
    </div>
  );
}
