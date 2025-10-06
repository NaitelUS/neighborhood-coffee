import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);

  const orderId = searchParams.get("id");

  useEffect(() => {
    if (orderId) {
      fetch("/.netlify/functions/orders-get")
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((o: any) => o.id === orderId);
          setOrder(found);
        })
        .catch((err) => console.error(err));
    }
  }, [orderId]);

  if (!orderId)
    return <p className="text-center mt-20 text-red-600">No order ID found.</p>;

  if (!order)
    return <p className="text-center mt-20 text-gray-600">Loading order...</p>;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl text-center">
      <h1 className="text-2xl font-bold text-teal-700 mb-2">
        🎉 Your order has been received!
      </h1>

      <p className="text-gray-700 mb-4">Order ID: {order.id}</p>

      <div className="text-left border-t pt-4 space-y-1">
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Type:</strong> {order.order_type}</p>
        {order.address && <p><strong>Address:</strong> {order.address}</p>}
        <p><strong>Schedule:</strong> {order.schedule_time}</p>
        <p><strong>Total:</strong> 💲{Number(order.total).toFixed(2)}</p>
      </div>

      <Link
        to={`/status?id=${order.id}`}
        className="inline-block mt-6 text-teal-700 font-semibold underline"
      >
        🔍 Check order status
      </Link>

      <Link
        to="/"
        className="block mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
      >
        Back to Menu
      </Link>
    </div>
  );
}
