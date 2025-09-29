import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(
          `/.netlify/functions/orders?id=${encodeURIComponent(orderId)}`
        );
        const data = await res.json();
        setOrder(data[0] || null);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center p-10 text-gray-500">
        Loading your order details...
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="max-w-lg mx-auto text-center p-10">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          We couldn’t find your order information.
        </p>
        <Link
          to="/"
          className="text-blue-600 underline font-medium hover:text-blue-800"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const total = order.Total || order.total || 0;
  const discount = order.Discount || 0;
  const subtotal = order.Subtotal || total;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        🎉 Thank You for Your Order!
      </h1>

      <p className="text-gray-700 mb-4">
        Your order has been successfully submitted.
      </p>

      <div className="bg-gray-50 border rounded-lg p-4 mb-4 text-left">
        <p className="text-sm">
          <span className="font-semibold text-gray-800">Order ID:</span>{" "}
          <span className="text-blue-600">{orderId}</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold text-gray-800">Subtotal:</span>{" "}
          ${subtotal.toFixed(2)}
        </p>
        {discount > 0 && (
          <p className="text-sm text-green-700">
            Discount applied: {discount}%
          </p>
        )}
        <p className="text-sm font-semibold text-gray-800">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Link
          to={`/order-status/${orderId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          📦 Track Your Order
        </Link>

        <Link
          to={`/feedback?order=${orderId}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          ⭐ Leave a Review
        </Link>

        <Link
          to="/"
          className="text-gray-600 underline text-sm hover:text-gray-800 mt-2"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
