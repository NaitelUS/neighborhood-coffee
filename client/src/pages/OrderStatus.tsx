// client/src/pages/OrderStatus.tsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState("Received");

  // Simula cambios de estado automáticos
  useEffect(() => {
    const steps = ["Received", "In Progress", "Ready", "Out for Delivery", "Completed"];
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < steps.length) {
        setStatus(steps[index]);
      } else {
        clearInterval(interval);
      }
    }, 5000); // cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>

      {id && (
        <p className="text-md mb-4">
          <span className="font-semibold">Order Number:</span> {id}
        </p>
      )}

      <div className="p-4 border rounded-lg shadow-md bg-gray-50">
        <p className="text-lg font-semibold">Current Status:</p>
        <p className="text-green-700 text-xl mt-2">{status}</p>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
