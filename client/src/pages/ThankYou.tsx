import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get("orderNo");
    if (orderNo) {
      const stored = localStorage.getItem(`order-${orderNo}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, []);

  if (!order) {
    return <p className="p-6">Order not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p>Your order has been received.</p>
      <p className="mt-2">Order #: <b>{order.orderNo}</b></p>

      <h2 className="mt-4 font-bold text-xl">Summary</h2>
      <ul className="text-lg">
        {order.items.map((item: any, idx: number) => (
          <li key={idx} className="mb-2">
            {item.quantity}x {item.name} ({item.temperature})
            {item.addOns?.length > 0 && (
              <ul className="ml-6 text-base text-gray-700 list-disc">
                {item.addOns.map((addOn: string, i: number) => (
                  <li key={i}>{addOn}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 text-lg">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        {order.discount > 0 && (
          <p>Discount: -${order.discount.toFixed(2)}</p>
        )}
        <p className="mt-2 text-2xl font-bold">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="mt-4">
        <Link
          to={`/order-status/${order.orderNo}`}
          className="text-[#1D9099] underline font-semibold"
        >
          You can check your order here
        </Link>
      </div>
    </div>
  );
}
