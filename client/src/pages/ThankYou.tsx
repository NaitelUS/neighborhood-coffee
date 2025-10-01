import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = new URLSearchParams(location.search).get("order_id");
  const total = new URLSearchParams(location.search).get("total");

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 text-center mt-10">
      <h2 className="text-3xl font-bold text-green-600 mb-3">
        ✅ Thank You!
      </h2>

      <p className="text-gray-700 mb-2">
        Your order has been received successfully.
      </p>

      {orderId && (
        <p className="text-gray-600 text-sm mb-2">
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      {total && (
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Total Paid: ${parseFloat(total).toFixed(2)}
        </p>
      )}

      <button
        onClick={() => navigate(`/feedback?order_id=${orderId || ""}`)}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
      >
        Leave Feedback ⭐
      </button>

      <p className="text-gray-500 text-sm mt-4">
        We’ll notify you once your order is ready.  
        Thank you for supporting The Neighborhood Coffee!
      </p>
    </div>
  );
}
