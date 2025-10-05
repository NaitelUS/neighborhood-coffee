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
    console.log("🧠 Info del cliente recibido:", info);
    console.log("🧠 Schedule recibido:", schedule);
    console.log("🛒 Items en carrito:", cartItems);

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!info || !info.name) {
      alert("Missing customer info — please fill out the form.");
      return;
    }

    const orderData = {
  customer_name: info.name,
  customer_phone: info.phone,
  address: info.method === "Delivery" ? info.address || "" : "",
  order_type: info.method || "Pickup",
  schedule_date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD
  schedule_time: schedule
    ? schedule
    : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  subtotal,
  discount,
  total,
  coupon_code: appliedCoupon || null,
  status: "Received",
  items: cartItems.map((item) => ({
    name: item.name,
    option: item.option,
    price: item.price,
    addons:
      item.addons?.map((a) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ") ||
      "",
  })),
};


    console.log("📦 Enviando orden a Netlify:", orderData);
    alert("Debug: revisa la consola del navegador (F12 > Console)");

    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("📨 Respuesta del servidor:", res);

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Error HTTP:", errText);
        throw new Error("Failed to save order");
      }

      const result = await res.json();
      console.log("✅ Resultado:", result);

      const orderId = result.id || result.orderId || "N/A";

      // 🧾 Redirigir al Thank You
      navigate(
        `/thank-you?order_id=${orderId}&total=${total.toFixed(2)}&name=${encodeURIComponent(
          info.name
        )}&discount=${discount}&coupon=${appliedCoupon || ""}`
      );

      clearCart();
    } catch (err) {
      console.error("🚨 Error al enviar la orden:", err);
      alert("There was an error submitting your order. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-6">
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600 mx-auto mb-3"></div>
            <p className="text-gray-700">Submitting your order...</p>
          </div>
        </div>
      )}
    </div>
  );
}
