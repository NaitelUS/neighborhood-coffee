import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type OrderData = {
  orderNo: string;
  items: {
    id: string;
    name: string;
    temperature?: "hot" | "iced";
    quantity: number;
    basePrice: number;
    addOns: string[];
  }[];
  info: any;
  subtotal: number;
  discount: number;
  total: number;
  status?: string;
};

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`order-${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrder({ orderNo: id, ...parsed });
      }
    }
  }, [id]);

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
      <h2 className="text-3xl font-bold mb-4">Order Status</h2>
      <p className="mb-2">
        Order number:{" "}
        <span className="font-semibold text-[#1D9099]">{order.orderNo}</span>
      </p>

      <div className="mb-6">
        <p className="text-lg font-medium">Current Status:</p>
        <p className="text-xl font-bold text-[#1D9099]">
          {order.status || "☕ Received"}
        </p>
      </div>

      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Order Details</h3>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-medium text-lg">
                  {item.quantity}x {item.name}{" "}
                  {item.temperature && `(${item.temperature})`}
                </p>
                {item.addOns.length > 0 && (
                  <ul className="ml-6 text-sm text-gray-600 list-disc">
                    {item.addOns.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="font-semibold text-lg">
                $
                {(
                  (item.basePrice +
                    item.addOns.reduce((sum) => sum + 0.5, 0)) *
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
              <span>Discount</span>
              <span>- ${order.discount.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between font-bold text-2xl mt-2">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
