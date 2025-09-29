import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const loadOrder = async () => {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        fetch(`/.netlify/functions/orders?id=${id}`).then((r) => r.json()),
        fetch(`/.netlify/functions/orderitems?id=${id}`).then((r) => r.json()),
      ]);
      setOrder(orderRes);
      setItems(itemsRes);
    } catch (err) {
      console.error("Error loading order:", err);
    }
  };

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 5000);
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

        <ul className="list-disc list-inside text-sm">
          {items.map((it, idx) => (
            <li key={idx}>
              {it.productName}
              {it.option ? ` (${it.option})` : ""} × {it.quantity}
              {it.addOns && ` – ${it.addOns}`}
            </li>
          ))}
        </ul>

        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-blue-600 font-semibold">{order.status}</span>
        </p>

        {order.status === "Completed" && (
          <div className="mt-3">
            <a
              href={`/feedback?order=${order.id}`}
              className="text-green-600 underline font-semibold"
            >
              Leave Feedback
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
