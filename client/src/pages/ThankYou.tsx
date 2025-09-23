import { Link, useLocation } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderNo = params.get("orderNo");

  let order;
  if (orderNo) {
    const raw = localStorage.getItem(`order-${orderNo}`);
    if (raw) order = JSON.parse(raw);
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link to="/" className="text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-2">Order #: {orderNo}</p>
      <div className="border rounded-lg p-4 text-left mb-6">
        <h2 className="text-xl font-semibold mb-2">Receipt</h2>
        <ul className="list-disc ml-6">
          {order.items.map((item: any, idx: number) => (
            <li key={idx}>
              {item.quantity}x {item.name} ({item.temperature})
              {item.addOns?.length > 0 && (
                <ul className="ml-6 list-disc text-sm text-gray-600">
                  {item.addOns.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
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
          <p className="font-bold text-xl">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>
      <p className="mb-4 text-lg font-medium">
        You can check your order status{" "}
        <Link
          to={`/order-status/${orderNo}`}
          className="text-[#1D9099] underline font-bold"
        >
          here
        </Link>
        .
      </p>
      <Link
        to="/"
        className="bg-[#1D9099] hover:bg-[#00454E] text-white px-6 py-2 rounded"
      >
        Back to Menu
      </Link>
    </div>
  );
}
