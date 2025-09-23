import { useParams, Link } from "react-router-dom";

export default function OrderStatus() {
  const { orderNo } = useParams<{ orderNo: string }>();

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Status</h1>
      <div className="border rounded-lg p-6 shadow">
        <p className="text-lg font-semibold mb-2">
          <span className="font-bold">Order #:</span> {orderNo}
        </p>
        <p className="mb-4">
          <span className="font-bold">Customer:</span> {order.customerName}
        </p>

        <h2 className="text-xl font-semibold mb-2">Items</h2>
        <ul className="list-disc ml-6">
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="mb-2">
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

        <div className="mt-4 text-lg">
          <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
          {order.discount > 0 && (
            <p>Discount: -${order.discount.toFixed(2)}</p>
          )}
          <p className="font-bold text-2xl mt-2">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>

        <div className="mt-6">
          <p className="font-bold text-green-600 text-lg">
            Status: {order.status || "Received ✅ (waiting to be processed)"}
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/"
          className="bg-[#1D9099] hover:bg-[#00454E] text-white px-6 py-2 rounded"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
