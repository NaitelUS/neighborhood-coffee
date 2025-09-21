import { useLocation } from "wouter";

export default function ThankYou() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const orderNo = params.get("orderNo");

  const orderData = orderNo
    ? JSON.parse(localStorage.getItem(`order-${orderNo}`) || "{}")
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-brown-700 mb-4">
        Thank you! Your order has been received.
      </h1>
      <p className="mb-6">Your order number is: #{orderNo}</p>

      {orderData && (
        <div className="bg-gray-50 p-4 rounded border max-w-lg w-full whitespace-pre-wrap">
          <strong>Order No:</strong> {orderData.orderNo}{"\n"}
          <strong>Name:</strong> {orderData.customer.name}{"\n"}
          <strong>Email:</strong> {orderData.customer.email}{"\n"}
          <strong>Phone:</strong> {orderData.customer.phone}{"\n"}
          <strong>Delivery:</strong>{" "}
          {orderData.customer.isDelivery ? "Delivery" : "Pickup"}{"\n"}
          <strong>Address:</strong> {orderData.customer.address || "N/A"}{"\n"}
          <strong>Preferred Date:</strong> {orderData.customer.preferredDate}{"\n"}
          <strong>Preferred Time:</strong> {orderData.customer.preferredTime}{"\n"}
          <strong>Notes:</strong> {orderData.customer.specialNotes || "N/A"}{"\n\n"}
          Items:
          {"\n"}
          {orderData.items
            .map(
              (i: any) =>
                `${i.quantity}x ${i.temperature} ${i.drinkName} - $${i.totalPrice.toFixed(
                  2
                )}`
            )
            .join("\n")}
          {"\n\n"}
          {orderData.discount && (
            <div>Promotional Discount: -{orderData.discount}</div>
          )}
          <strong>TOTAL: ${orderData.total.toFixed(2)}</strong>
        </div>
      )}

      <p className="mt-4">
        Track your order status here:{" "}
        <a
          href={`/order-status/${orderNo}`}
          className="text-blue-600 underline"
        >
          View Status
        </a>
      </p>

      <a
        href="/"
        className="mt-6 inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded"
      >
        Back to Menu
      </a>
    </div>
  );
}
