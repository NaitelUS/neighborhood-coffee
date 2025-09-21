import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const [location] = useLocation();
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<string | null>(null);

  useEffect(() => {
    // Parse query string ?orderNo=123
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get("orderNo");
    setOrderNo(orderNumber);

    // Si guardamos detalles en localStorage antes de enviar el form
    const savedDetails = localStorage.getItem("lastOrderDetails");
    if (savedDetails) {
      setOrderDetails(savedDetails);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full bg-card shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-serif font-semibold text-primary mb-4">
          Thank you! Your order has been received. ☕
        </h1>
        {orderNo && (
          <p className="text-lg font-medium text-muted-foreground mb-4">
            Your order number is: <span className="font-bold">#{orderNo}</span>
          </p>
        )}

        {orderDetails ? (
          <pre className="text-left bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
            {orderDetails}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your order summary will appear here.
          </p>
        )}

        <a
          href="/"
          className="mt-6 inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-6 py-2 rounded"
        >
          Back to Menu
        </a>
      </div>
    </div>
  );
}
