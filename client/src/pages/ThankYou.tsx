import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderNo = params.get("orderNo");
    if (orderNo) {
      const saved = localStorage.getItem(`order-${orderNo}`);
      if (saved) {
        setOrder({ ...JSON.parse(saved), orderNo });
      }
    }
  }, [location]);

  if (!order) {
    return <p className="p-6">Order not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="mb-6">Your order number is <strong>{order.orderNo}</strong></p>

      {/* Resumen de la orden */}
      <div className="border rounded-lg shadow-md p-4 text-left">
        <h2 className="text-xl font-semibold mb-3">Order Receipt</h2>
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
        <div className="mt-4 space-y-1 text-sm">
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
          <div className="flex justify-between font-bold text-xl border-t pt-2">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Enlace para revisar estatus */}
      <div className="mt-6">
        <a
          href={`/order-status/${order.orderNo}`}
          className="text-[#1D9099] font-semibold hover:underline"
        >
          You can check your order status here →
        </a>
      </div>
    </div>
  );
}
