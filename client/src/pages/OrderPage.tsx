import React, { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";

export default function OrderPage() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Enviar orden completa a Airtable
  const handleOrderSubmit = async (info: any, schedule: string) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: info.name,
        customer_phone: info.phone,
        method: info.method,
        address: info.method === "Delivery" ? info.address : "",
        schedule,
        total,
        status: "Received",
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          option: item.option,
          addons: item.addons?.map((a) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ") || "",
        })),
      };

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");

      setIsSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("❌ Error sending order:", err);
      alert("There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 text-center bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          ✅ Order Received!
        </h2>
        <p className="text-gray-700">
          Thank you! Your order has been successfully submitted. 
          We’ll notify you when it’s ready for pickup or delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mt-6">
      {/* 🧾 Summary (Subtotal, Discounts, Total) */}
      <div>
        <OrderSummary />
      </div>

      {/* 👤 Customer Info + Schedule */}
      <div>
        <CustomerInfoForm onSubmit={handleOrderSubmit} />
      </div>

      {/* Loader visual */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600 mx-auto mb-3"></div>
            <p className="text-gray-700">Sending your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
