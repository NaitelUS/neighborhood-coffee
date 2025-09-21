import { useRoute } from "wouter";

export default function OrderStatus() {
  const [, params] = useRoute("/order-status/:id");
  const orderNo = params?.id;
  const orderData = orderNo
    ? JSON.parse(localStorage.getItem(`order-${orderNo}`) || "{}")
    : null;

  // Simulación de status (en real, esto vendría de la BD)
  const statusFlow = ["Received", "In Process", "On the Way", "Completed"];
  const randomStatus = statusFlow[Math.floor(Math.random() * statusFlow.length)];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">
        Order Status for #{orderNo}
      </h1>
      {orderData ? (
        <div className="bg-gray-50 p-4 rounded border max-w-lg w-full">
          <p><strong>Name:</strong> {orderData.customer.name}</p>
          <p><strong>Total:</strong> ${orderData.total.toFixed(2)}</p>
          <p className="mt-2"><strong>Current Status:</strong> {randomStatus}</p>
        </div>
      ) : (
        <p>Order not found.</p>
      )}

      <a
        href="/"
        className="mt-6 inline-block bg-[#1D9099] hover:bg-[#00454E] text-white px-4 py-2 rounded"
      >
        Back to Menu
      </a>
    </div>
  );
}
