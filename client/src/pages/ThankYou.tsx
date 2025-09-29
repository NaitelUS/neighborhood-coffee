import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

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

    loadOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-gray-500">Please verify your order number.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🎉 Thank You for Your Order!
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Your order <strong>#{order.id}</strong> has been placed successfully.
      </p>

      <div className="border rounded-lg p-4 text-left mb-6 bg-gray-50">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <ul className="text-sm mb-2">
          {items.map((it, idx) => (
            <li key={idx}>
              {it.productName}
              {it.option ? ` (${it.option})` : ""} × {it.quantity}
              {it.addOns && ` – ${it.addOns}`}
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount:</span>
            <span>- ${order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        We’ll notify you when your order is being prepared and ready.  
        You can check your order status below 👇
      </p>

      {id && (
        <Link
          to={`/order-status/${id}`}
          className="inline-block bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
        >
          View Order Status
        </Link>
      )}

      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
