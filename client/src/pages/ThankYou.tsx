import { useLocation } from "react-router-dom";
import { addOnOptions } from "@/data/menuData";

export default function ThankYou() {
  const searchParams = new URLSearchParams(useLocation().search);
  const orderNo = searchParams.get("orderNo");
  const order = orderNo ? JSON.parse(localStorage.getItem(`order-${orderNo}`) || "null") : null;

  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p>Your order number is <span className="font-bold">{orderNo}</span></p>

      <div className="mt-4 border rounded-lg p-4 text-lg">
        <h2 className="font-bold text-xl mb-2">Order Summary</h2>
        <ul className="space-y-2">
          {order.items.map((item: any, index: number) => (
            <li key={index}>
              <p>
                {item.name} ({item.temperature}) x{item.quantity}
              </p>
              {item.addOns.length > 0 && (
                <ul className="ml-4 list-disc text-sm text-gray-600">
                  {item.addOns.map((id: string) => {
                    const addOn = addOnOptions.find((a) => a.id === id);
                    return <li key={id}>{addOn ? addOn.name : id}</li>;
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
          <p>Discount: -${order.discount.toFixed(2)}</p>
          <p className="text-2xl font-bold">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      <p className="mt-4">
        You can check your order status{" "}
        <a href={`/order-status/${orderNo}`} className="text-[#1D9099] font-bold underline">
          here
        </a>.
      </p>
    </div>
  );
}
