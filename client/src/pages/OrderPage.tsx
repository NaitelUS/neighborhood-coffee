import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "@/context/CartContext";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";

export default function OrderPage() {
  const { cartItems, subtotal, discount, appliedCoupon, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (info: any, scheduleDate: string, scheduleTime: string) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: info.name,
        customer_phone: info.phone,
        order_type: info.method,
        address: info.method === "Delivery" ? info.address : "",
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
        subtotal,
        discount,
        coupon_code: appliedCoupon || "",
        total,
        items: cartItems.map((item) => ({
          name: item.name,
          option: item.option,
          price: item.price,
          addons:
            item.addons?.map((a) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ") || "",
        })),
      };

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const result = await res.json();
      navigate(`/thank-you?order_id=${result.orderId}&total=${total.toFixed(2)}&name=${encodeURIComponent(info.name)}`);
      clearCart();
    } catch (err) {
      console.error("❌ Error submitting order:", err);
      alert("There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-6">
      <div><OrderSummary /></div>
      <div><CustomerInfoForm onSubmit={handleOrderSubmit} /></div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#1D9099] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-700">Submitting your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
