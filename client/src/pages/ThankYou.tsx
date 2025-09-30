import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/.netlify/functions/orders-get?id=${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Order not found.</p>
        <Link to="/" className="text-blue-600 underline font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  const { CustomerName, Total, Discount, CouponCode } = order;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-3">✅ Thank You!</h1>
      <p className="text-gray-700 mb-4">
        Your order has been successfully submitted.
      </p>

      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>

        <div className="flex justify-between text-gray-700 text-sm mb-1">
          <span>Order ID</span>
          <span>{orderId}</span>
        </div>

        <div className="flex justify-between text-gray-700 text-sm mb-1">
          <span>Name</span>
          <span>{CustomerName}</span>
        </div>

        <div className="flex justify-between text-gray-700 text-sm mb-1">
          <span>Total</span>
          <span>${Number(Total).toFixed(2)}</span>
        </div>

        {CouponCode && Discount > 0 && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
            🎉 You saved{" "}
            <span className="font-semibold">${Discount.toFixed(2)}</span> with
            coupon{" "}
            <span className="font-semibold underline">{CouponCode}</span> — enjoy
            your reward!
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">
        You’ll receive updates once your order is being prepared or ready for
        pickup/delivery.
      </p>

      <Link
        to={`/order-status/${orderId}`}
        className="block bg-blue-600 text-white font-semibold rounded py-2 hover:bg-blue-700 transition mb-3"
      >
        View Order Status
      </Link>

      <Link
        to="/"
        className="block text-blue-600 underline font-medium hover:text-blue-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
