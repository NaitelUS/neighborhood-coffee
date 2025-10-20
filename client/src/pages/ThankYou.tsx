import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYou = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("id");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/.netlify/functions/orders-get?id=${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">Loading order...</div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-600">
        Order not found or could not be loaded.
      </div>
    );
  }

  const orderNumber = order.orderID || order.id || "N/A";
  const customerName = order.name || "Valued Customer";
  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const total = order.total || 0;
  const coupon = order.coupon || "";

  return (
    <div className="text-center mt-16 px-4">
      <h1 className="text-3xl font-bold text-amber-700 mb-4">
        Thank You, {customerName}!
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been received and is being processed.
      </p>

      <div className="inline-block bg-white shadow rounded-lg p-6 text-left">
        <p>
          <strong>Order #:</strong> {orderNumber}
        </p>
        <p>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </p>
        {discount > 0 && (
          <p>
            <strong>Discount:</strong> -${discount.toFixed(2)}
          </p>
        )}
        {coupon && (
          <p>
            <strong>Coupon:</strong> {coupon}
          </p>
        )}
        <p className="font-semibold mt-2">
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate(`/status?id=${orderNumber}`)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
