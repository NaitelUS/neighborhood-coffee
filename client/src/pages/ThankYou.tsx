// client/src/pages/ThankYou.tsx
import { useParams, Link } from "react-router-dom";

export default function ThankYou() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🎉 Thank You for Your Order!
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Your order has been placed successfully.
      </p>

      {id && (
        <p className="text-md mb-6">
          <span className="font-semibold">Order Number:</span> {id}
        </p>
      )}

      <p className="text-gray-600 mb-6">
        We’ll send you updates when your order is being prepared and ready.  
        In the meantime, you can review your order status below.
      </p>

      <Link
        to={`/order-status/${id}`}
        className="inline-block bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
      >
        View Order Status
      </Link>

      <div className="mt-8">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
