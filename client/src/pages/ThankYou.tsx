import { useSearchParams } from "react-router-dom";

export default function ThankYou() {
  const [params] = useSearchParams();
  const orderNo = params.get("orderNo");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Thank you! Your order has been received 🎉
        </h1>
        <p className="text-lg mb-2">Your Order Number is:</p>
        <p className="text-3xl font-mono font-bold text-[#1D9099] mb-6">
          #{orderNo}
        </p>
        <p className="text-gray-700">
          Please keep this number to check your order status.
        </p>
      </div>
    </div>
  );
}
