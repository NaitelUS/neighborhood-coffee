import { useLocation } from "wouter";

export default function ThankYou() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const orderNo = params.get("orderNo");

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Thank you! Your order has been received ☕
      </h1>
      {orderNo && (
        <>
          <p className="text-lg mb-2">Your order number is: {orderNo}</p>
          <p className="text-lg">
            You can check your order status{" "}
            <a
              href={`/order-status/${orderNo}`}
              className="text-blue-600 underline"
            >
              here
            </a>
            .
          </p>
        </>
      )}
      <p className="mt-6 text-muted-foreground">
        We’ll start preparing your coffee right away!
      </p>
    </div>
  );
}
