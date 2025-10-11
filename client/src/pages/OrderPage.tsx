import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "@/context/CartContext";
import OrderSummary from "@/components/OrderSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";

export default function OrderPage() {
  const { cartItems, subtotal, discount, appliedCoupon, total, clearCart } =
    useContext(CartContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (
    info: any,
    schedule_date: string,
    schedule_time: string
  ) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: info.name,
        customer_phone: info.phone,
        address: info.method === "Delivery" ? info.address : "",
        order_type: info.method,
        schedule_date,
        schedule_time,
        subtotal,
        discount,
        total,
        coupon_code: appliedCoupon || "",
        notes: info.notes || "",
        items: cartItems.map((item) => ({
          name: item.name,
          option: item.option || "",
          price: item.price,
          qty: item.qty || 1,
          addons: item.addons || [],
        })),
      };

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!result.success || !result.orderId) {
        throw new Error(result.error || "Order creation failed");
      }

      const orderId = result.orderId;
      clearCart();
      navigate(`/thank-you?id=${orderId}`);
    } catch (err) {
      console.error("❌ Error sending order:", err);
      alert("There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 mt-6">
      <div>
        <OrderSummary />
      </div>
      <div>
        <CustomerInfoForm onSubmit={handleOrderSubmit} />
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1D9099] mx-auto mb-3"></div>
            <p className="text-gray-700">Submitting your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
