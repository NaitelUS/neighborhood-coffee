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
  const items = order.items || [];
  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const total = order.total || 0;
  const coupon = order.coupon || "";
  const orderType = order.order_type || "";
  const scheduleDate = order.schedule_date || "";
  const scheduleTime = order.schedule_time || "";

  return (
    <div className="text-center mt-16 px-4">
      <h1 className="text-3xl font-bold text-amber-700 mb-4">
        Thank You, {customerName}!
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been received and is being processed.
      </p>

      {/* Recibo */}
      <div className="inline-block bg-white shadow rounded-lg p-6 text-left w-full max-w-md mx-auto">
        <p>
          <strong>Order #:</strong> {orderNumber}
        </p>
        <p>
          <strong>Type:</strong> {orderType}
        </p>
        <p>
          <strong>Date:</strong> {scheduleDate} {scheduleTime && `at ${scheduleTime}`}
        </p>

        <hr className="my-4" />

        {/* Detalle de productos */}
        <div>
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.option && (
                      <p className="text-gray-500 text-xs">{item.option}</p>
                    )}
                    {item.addons && (
                      <p className="text-gray-500 text-xs">
                        Addons: {item.addons}
                      </p>
                    )}
                    <p className="text-gray-600 text-xs">Qty: {item.qty}</p>
                  </div>
                  <p className="text-gray-800 font-medium">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No items found for this order.</p>
          )}
        </div>

        <hr className="my-4" />

        {/* Totales */}
        <div className="text-sm space-y-1">
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
          <p className="font-semibold mt-2 text-lg">
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
        </div>
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
