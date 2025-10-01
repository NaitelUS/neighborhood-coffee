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

  // ✅ Redirigir al menú principal
  const handleBackToMenu = () => {
    navigate("/"); // regresa al home sin limpiar el carrito
  };

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
        subtotal,
        discount_value: discount,
        coupon: appliedCoupon || null,
        total,
        status: "Received",
        items: cartItems.map((item) => ({
          name: item.name,
          option: item.option,
          price: item.price,
          addons:
            item.addons
              ?.map((a) => `${a.name} (+$${a.price.toFixed(2)})`)
              .join(", ") || "",
        })),
      };

      const res = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const result = await res.json();
      const orderId = result.id || "N/A";

      navigate(
        `/thank-you?order_id=${orderId}&total=${total.toFixed(
          2
        )}&name=${encodeURIComponent(info.name)}&discount=${discount}&coupon=${
          appliedCoupon || ""
        }`
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
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-6 px-4">
      {/* 🧾 Resumen */}
      <div>
        <OrderSummary />
      </div>

      {/* 👤 Cliente + Fecha */}
      <div>
        <CustomerInfoForm onSubmit={handleOrderSubmit} />

        {/* 🔙 Botón Back to Menu */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBackToMenu}
            className="px-6 py-2 rounded-md font-semibold bg-[#1D9099] text-white hover:bg-[#00454E] transition-all"
          >
            ← Back to Menu
          </button>
        </div>
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
