// client/src/pages/ThankYou.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  option?: string;
  quantity: number;
  addOns?: string[];
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

export default function ThankYou() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem("orders");
      if (saved) {
        const orders: Order[] = JSON.parse(saved);
        const found = orders.find((o) => o.id === id);
        if (found) setOrder(found);
      }
    }
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🎉 Thank You for Your Order!
      </h1>

      {order ? (
        <>
          <p className="text-lg text-gray-700 mb-6">
            Your order has been placed successfully.
          </p>

          <p className="text-md mb-4">
            <span className="font-semibold">Order Number:</span> {order.id}
          </p>

          <div className="border rounded-lg p-4 text-left mb-6 bg-gray-50">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <ul className="text-sm mb-2">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name}
                  {item.option ? ` (${item.option})` : ""} × {item.quantity}
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
        </>
      ) : (
        <p className="text-red-600 mb-6">
          Order not found. Please check your order number.
        </p>
      )}

      <p className="text-gray-600 mb-6">
        We’ll send you updates when your order is being prepared and ready.  
        In the meantime, you can review your order status below.
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
