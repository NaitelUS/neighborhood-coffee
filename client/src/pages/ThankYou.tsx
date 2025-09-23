import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderNo = params.get("orderNo");
    if (orderNo) {
      const saved = localStorage.getItem(`order-${orderNo}`);
      if (saved) {
        setOrder({ orderNo, ...JSON.parse(saved) });
      }
    }
  }, [location.search]);

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <p className="mt-2">Please check your order number.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Thank you for your order! 🎉</h2>
      <p className="mb-6 text-lg">
        Your order number is{" "}
        <span className="font-bold text-[#1D9099]">{order.orderNo}</span>.
      </p>

      {/* Receipt */}
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Your Receipt</h3>
        <ul className="space-y-2">
          {order.items.map((item: any, i: number) => (
            <li key={i} className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-medium text-lg">
                  {item.quantity}x {item.name}{" "}
                  {item.temperature && `(${item.temperature})`}
                </p>
                {item.addOns.length > 0 && (
                  <ul className="ml-6 text-sm text-gray-600 list-disc">
                    {item.addOns.map((a: string, j: number) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="font-semibold text-lg">
                $
                {(
                  (item.basePrice +
                    item.addOns.reduce(
                      (sum: number, addOnId: string) =>
                        sum +
                        (order.info?.addOns?.find((a: any) => a.id === addOnId)
                          ?.price || 0),
                      0
                    )) *
                  item.quantity
                ).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t pt-3 text-lg">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </p>
          {order.discount > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Discount (Coupon)</span>
              <span>- ${order.discount.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between font-bold text-2xl mt-2">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Order status link */}
      <div className="mt-6 text-center">
        <a
          href={`/order-status/${order.orderNo}`}
          className="text-[#1D9099] font-semibold underline"
        >
          You can check your order status here
        </a>
      </div>
    </div>
  );
}
