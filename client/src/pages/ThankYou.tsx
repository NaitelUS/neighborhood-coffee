import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const orderParam = queryParams.get("id");

  useEffect(() => {
    if (!orderParam) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch("/.netlify/functions/orders-get");
        const data = await res.json();

        const found = data.find(
          (o: any) =>
            o.order_number === orderParam || o.id === orderParam
        );

        if (!found) setError("Order not found. Please check your link.");
        else setOrder(found);
      } catch (err) {
        setError("Error loading order.");
      }
    };

    fetchOrder();
  }, [orderParam]);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-3">{error}</h2>
        <Link to="/" className="text-teal-700 underline">
          Return to Menu
        </Link>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your order...</p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto text-center bg-white p-6 mt-10 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-teal-700 mb-2">
        ☕ Thank You for Your Order!
      </h1>
      <p className="text-gray-700 mb-4">
        Your order has been received and is being prepared.
      </p>

      <h2 className="text-xl font-bold mb-2">
        Order No: {order.order_number || order.id}
      </h2>
      <p className="text-gray-700 mb-1">{order.name}</p>
      <p className="text-gray-700 mb-2">
        {order.order_type} – {order.schedule_date} {order.schedule_time}
      </p>

      {order.items && order.items.length > 0 ? (
        <div className="text-left border-t border-b border-gray-300 py-3 mb-4">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">
                {item.product_name}{" "}
                {item.option && (
                  <span className="text-sm text-gray-600">
                    ({item.option})
                  </span>
                )}
              </p>
              {item.addons && (
                <p className="text-sm text-gray-600 ml-2">+ {item.addons}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-500">(No items found)</p>
      )}

      <p className="mt-3 font-semibold text-gray-700">
        Total: ${order.total?.toFixed(2)}
      </p>
      {order.notes && <p className="italic text-gray-600">📝 {order.notes}</p>}

      <Link
        to="/"
        className="mt-5 inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold"
      >
        Return to Menu
      </Link>
    </div>
  );
}
