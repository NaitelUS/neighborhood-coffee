import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`order-${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrder(parsed);
        setStatus(parsed.status || "☕ Received");
      }
    }
  }, [id]);

  if (!order) {
    return <p className="p-6">Order not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <p className="mb-2">
        Order <strong>#{id}</strong>
      </p>
      <p className="mb-4">Current status: <strong>{status}</strong></p>

      {/* Mostrar resumen de la orden */}
      <div className="border rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <ul className="space-y-3">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="border-b pb-2 last:border-none last:pb-0">
              <div className="flex justify-between">
                <span>
                  {item.quantity}× {item.name}
                  {item.temperature && ` (${item.temperature})`}
                  {item.option && ` - ${item.option}`}
                </span>
                <span>
                  $
                  {(
                    (item.basePrice +
                      (item.addOns || []).reduce(
                        (sum: number, a: any) => sum + (a.price || 0),
                        0
                      )) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>

              {/* Add-ons */}
              {item.addOns && item.addOns.length > 0 && (
                <ul className="ml-4 list-disc text-sm text-gray-700">
                  {item.addOns.map((a: any) => (
                    <li key={a.id}>
                      {a.name} (+${a.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Totales */}
        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>- ${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
