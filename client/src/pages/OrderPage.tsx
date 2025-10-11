import React, { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import dayjs from "dayjs";

export default function OrderPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (info: any, date: string, time: string) => {
    setLoading(true);
    try {
      const orderId = `TNC-${dayjs().format("YYYYMMDDHHmmss")}`;

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customer: info,
          date,
          time,
          items: cartItems,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit order");

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error(err);
      alert("⚠️ There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-3xl font-semibold text-emerald-800 mb-4">
          Thank you for your order! ☕
        </h1>
        <p className="text-gray-600">
          We’ve received your order. You’ll get a confirmation soon.
        </p>
        <a
          href="/"
          className="inline-block mt-8 text-emerald-700 hover:underline"
        >
          ← Back to menu
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
      {/* 🧾 Order Summary */}
      <div className="w-full md:w-1/2">
        <OrderSummary />
      </div>

      {/* 👤 Customer Info */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4">
          Pickup Details
        </h2>
        <CustomerInfoForm onSubmit={handleOrderSubmit} />
      </div>
    </div>
  );
}
