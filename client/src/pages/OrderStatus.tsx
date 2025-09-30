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
  Discount?: number;
  CouponCode?: string;
  Status?: string;
  Items?: OrderItem[];
}

export default function OrderStatus() {
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
        <p className="text-gray-500">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Order not found
        </h1>
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // 🟢 Etiqueta visual de estado
  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Process": "bg-blue-100 text-blue-800",
    "Ready for Pickup": "bg-green-100 text-green-800",
    Completed: "bg-gray-100 text-gray-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusClass = statusColor[order.Status || "Pending"] || "bg-gray-100";

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">
        ☕ Order Status
      </h1>

      <div className="text-center mb-4">
        <p className="text-gray-600 text-sm mb-1">
          <strong>Order ID:</strong> {orderId}
        </p>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
        >
          {order.Status || "Pending"}
        </span>
      </div>

      {/* 🧾 Order Items */}
      {order.Items && order.Items.length > 0 && (
        <div className="border-t pt-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Your Order
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

      {/* 💰 Totales */}
      <div className="bg-gray-50 rounded-lg p-4">
        {order.Discount && order.Discount > 0 && order.CouponCode && (
          <p className="text-sm text-green-700 mb-1">
            🎉 You saved ${order.Discount.toFixed(2)} with{" "}
            <strong>{order.CouponCode}</strong>
          </p>
        )}
        <p className="text-lg font-semibold text-gray-800">
          Total: ${order.Total?.toFixed(2)}
        </p>
      </div>

      {/* 📝 Feedback Link */}
      {order.Status === "Completed" && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            We’d love to hear your thoughts!
          </p>
          <Link
            to={`/feedback?order=${orderId}`}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Leave Feedback
          </Link>
        </div>
      )}

      <div className="text-center mt-6">
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
