import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`order-${id}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, [id]);

  if (!order) {
    return <p className="p-6">Order not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <p>Order #: <b>{order.orderNo}</b></p>
      <p className="mt-2 font-semibold">Customer: {order.info?.name}</p>

      <h2 className="mt-4 font-bold">Items</h2>
      <ul>
        {order.items.map((item: any, idx: number) => (
          <li key={idx} className="mb-1">
            {item.quantity}x {item.name} ({item.temperature})
            {item.addOns?.length > 0 && (
              <ul className="ml-6 text-sm text-gray-700 list-disc">
                {item.addOns.map((addOn: string, i: number) => (
                  <li key={i}>{addOn}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        {order.discount > 0 && (
          <p>Discount: -${order.discount.toFixed(2)}</p>
        )}
        <p className="mt-2 font-bold text-xl">Total: ${order.total.toFixed(2)}</p>
      </div>

      <p className="mt-3 text-green-600 font-bold">
        Status: Received ✅ (waiting to be processed)
      </p>
    </div>
  );
}
