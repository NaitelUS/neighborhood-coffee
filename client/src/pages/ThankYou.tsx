import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  Option?: string;
  AddOns?: string[];
}

interface OrderData {
  id?: string;
  CustomerName?: string;
  Total?: number;
  Subtotal?: number;
  Discount?: number;
  CouponCode?: string;
  Status?: string;
  Items?: OrderItem[];
}

export default function ThankYou() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
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
      <div className="text-center p-6">
        <p className="text-gray-500">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Order not found</h1>
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center mb-4 text-green-700">
        ✅ Thank you, {order.CustomerName || "Guest"}!
      </h1>

      <p className="text-center text-gray-700 mb-2">
        Your order has been received.
      </p>

      {/* 🔸 Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 my-4">
        <p className="text-sm text-gray-600 mb-1">
          <strong>Order ID:</strong> {orderId}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Status:</strong> {order.Status || "Pending"}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Subtotal:</strong> ${order.Subtotal?.toFixed(2)}
        </p>

        {order.Discount && order.Discount > 0 && (
          <>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Discount:</strong> -${order.Discount.toFixed(2)}
            </p>
            {order.CouponCode && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>Coupon:</strong> {order.CouponCode}
              </p>
            )}
          </>
        )}

        <p className="text-lg font-semibold text-gray-800 mt-2">
          Total: ${order.Total?.toFixed(2)}
        </p>
      </div>

      {/* 🧾 Order Items */}
      {order.Items && order.Items.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Your Order Items
          </h2>
          <ul className="divide-y divide-gray-200">
            {order.Items.map((item) => (
              <li key={item.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {item.ProductName}
                  </span>
                  <span className="text-gray-600">
                    x{item.Quantity} – ${item.Price.toFixed(2)}
                  </span>
                </div>

                {item.Option && (
                  <p className="text-sm text-gray-500 ml-2">
                    Option: {item.Option}
                  </p>
                )}

                {item.AddOns && item.AddOns.length > 0 && (
                  <p className="text-sm text-gray-500 ml-2">
                    Add-ons: {item.AddOns.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-gray-600 text-sm mt-6">
        You’ll receive updates when your order is ready.
      </p>

      <div className="flex justify-center gap-3 mt-4">
        <Link
          to={`/order-status/${orderId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Status
        </Link>
        <Link
          to={`/feedback?order=${orderId}`}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
        >
          Leave Feedback
        </Link>
      </div>
    </div>
  );
}
