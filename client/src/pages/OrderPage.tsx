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

  // ✅ Enviar orden completa a Airtable
  const handleOrderSubmit = async (info: any, schedule: string) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // 🧠 Separa fecha y hora (si el schedule viene en formato "YYYY-MM-DD HH:mm")
      let schedule_date = "";
      let schedule_time = "";
      if (schedule) {
        const parts = schedule.split(" ");
        schedule_date = parts[0] || "";
        schedule_time = parts[1] || "";
      }

      const orderData = {
        customer_name: info.name,
        customer_phone: info.phone,
        order_type: info.method, // Pickup o Delivery
        address: info.method === "Delivery" ? info.address : "",
        schedule_date,
        schedule_time,
        subtotal,
        discount,
        total,
        coupon_code: appliedCoupon || "",
        items: cartItems.map((item) => ({
          name: item.name,
          option: item.option,
          price: item.price,
          addons:
            item.addons?.map((a) => ({
              name: a.name,
              price: a.price,
            })) || [],
        })),
      };

      // 🧠 Guardar en Airtable
      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const result = await res.json();
      const orderId = result.orderId || "N/A";

      // ✅ Redirigir a Thank You
      navigate(
        `/thank-you?order_id=${orderId}&total=${total.toFixed(
          2
        )}&name=${encodeURIComponent(info.name)}`
      );

      clearCart();
    } catch (err) {
      console.error("❌ Error sending order:", err);
      alert("There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-6 px-4">
      {/* 🧾 Resumen */}
      <div>
        <OrderSummary />
      </div>

      {/* 👤 Cliente + Fecha */}
      <div>
        <CustomerInfoForm onSubmit={handleOrderSubmit} />
      </div>

      {/* Loader */}
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
