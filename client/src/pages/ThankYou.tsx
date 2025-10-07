import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const orderParam = queryParams.get("id");

  useEffect(() => {
    if (!orderParam) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch("/.netlify/functions/orders-get");
        const data = await res.json();

        // Busca por OrderNumber o record.id
        const found = data.find(
          (o: any) =>
            o.order_number === orderParam ||
            o.id === orderParam
        );

        if (!found) setError("Order not found. Please check your link.");
        else setOrder(found);
      } catch (err) {
        console.error("❌ Error loading order:", err);
        setError("Error loading order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderParam]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your order...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-3">{error}</h2>
        <Link to="/" className="text-teal-700 underline">
          Return to Menu
        </Link>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto text-center p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-teal-700 mb-2">
        ☕ Thank You for Your Order!
      </h1>
      <p className="text-gray-700 mb-4">
        Your order has been received and is being prepared.
      </p>

      <div className="border-t border-b border-gray-200 py-3 mb-4">
        <h2 className="text-xl font-bold mb-2">
          Order #{order.order_number || order.id}
        </h2>
        <p className="text-gray-600">{order.name}</p>
        <p className="text-gray-600 mb-2">
          {order.order_type} – {order.schedule_date} {order.schedule_time}
        </p>

        {order.items && order.items.length > 0 ? (
          <div className="text-left space-y-1 mt-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx}>
                <p className="font-semibold">
                  {item.product_name}{" "}
                  {item.option && (
                    <span className="text-gray-600 text-sm">
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
          <p className="text-gray-500 italic">(No items found)</p>
        )}
      </div>

      <p className="text-gray-700 font-medium mb-1">
        Total: ${order.total?.toFixed(2)}
      </p>
      {order.notes && <p className="text-gray-600 italic">📝 {order.notes}</p>}

      <Link
        to="/"
        className="mt-5 inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold"
      >
        Return to Menu
      </Link>
    </div>
  );
}
