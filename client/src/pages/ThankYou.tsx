import React, { useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ThankYou: React.FC = () => {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // 🧹 Limpia el carrito completamente al llegar a la página
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-50 px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-700 text-lg mb-4">
          Your order has been placed successfully.
        </p>

        {orderId ? (
          <p className="text-gray-500 text-sm mb-6">
            <strong>Order ID:</strong> {orderId}
          </p>
        ) : (
          <p className="text-red-500 text-sm mb-6">
            ⚠️ Order not found. Please check your connection or try again.
          </p>
        )}

        <img
          src="/attached_assets/coffee_success.png"
          alt="Success illustration"
          className="mx-auto mb-6 w-32 h-32 object-contain"
        />

        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
