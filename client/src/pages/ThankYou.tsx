import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ThankYou() {
  const { orderId } = useParams();

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
      <p className="mb-2">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="mb-2">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <p className="text-gray-600 mb-6">
        We’ll notify you once your order is ready.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Back to Menu
      </Link>
    </div>
  );
}
