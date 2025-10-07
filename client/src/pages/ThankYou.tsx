import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  // Obtener el parámetro ?id=TNC-001 o ?id=recXXXX
  const queryParams = new URLSearchParams(location.search);
  const orderParam = queryParams.get("id");

  useEffect(() => {
    if (!orderParam) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch("/.netlify/functions/orders-get");
        const data = await res.json();

        // Buscar la orden por OrderNumber o por ID de Airtable
        const found = data.find(
          (o: any) =>
            o.order_number?.trim() === orderParam.trim() ||
            o.id?.trim() === orderParam.trim()
        );

        if (!found) {
          setError("Order not found. Please check your link.");
        } else {
          setOrder(found);
        }
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        setError("Error loading your order. Please try again later.");
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
    <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded-xl shadow-lg text-center">
      <h1 className="text-2xl font-bold text-teal-700 mb-2">
        ☕ Thank You for Your Order!
      </h1>
      <p className="text-gray-700 mb-4">Your order has been received.</p>

      <h2 className="text-xl font-bold mb-1">
        Order No: {order.order_number || order.id}
      </h2>

      <div className="text-gray-700 mb-3">
        <p className="font-semibold">{order.name}</p>
        <p>
          {order.order_type} — {order.schedule_date} {order.schedule_time}
        </p>
      </div>

      {order.items && order.items.length > 0 ? (
        <div className="text-left border-t border-b border-gray-300 py-3 mb-4">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-lg">
                {item.product_name}{" "}
                {item.option && (
                  <span className="text-sm text-gray-600">
                    ({item.option})
                  </span>
                )}
              </p>
              {item.addons && (
                <p className="text-sm text-gray-600 ml-3">+ {item.addons}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-500 mb-3">(No items found)</p>
      )}

      {order.notes && (
        <p className="text-gray-700 italic mb-3">📝 {order.notes}</p>
      )}

      <p className="text-lg font-semibold text-gray-800 mb-1">
        Total: ${Number(order.total || 0).toFixed(2)}
      </p>

      <div className="mt-6">
        <Link
          to="/"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    </div>
  );
}
