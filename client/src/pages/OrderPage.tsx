import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";
import CouponField from "../components/CouponField";

export default function OrderPage() {
  const { cartItems, subtotal, discountRate, total, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("Pickup");
  const [address, setAddress] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [notes, setNotes] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCouponApply = (coupon: string) => {
    setAppliedCoupon(coupon);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          order_type: orderType,
          address,
          schedule_date: scheduleDate,
          schedule_time: scheduleTime,
          notes,
          subtotal,
          discount: subtotal * discountRate, // ✅ monto real de descuento
          total,
          coupon: appliedCoupon || "", // ✅ nombre del cupón
          items: cartItems,
        }),
      });

      const data = await response.json();
      if (data.success) {
        clearCart();
        window.location.href = `/thank-you?id=${data.orderId}`;
      } else {
        alert("⚠️ There was an error submitting your order. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error submitting order:", err);
      alert("⚠️ There was an error submitting your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-[#00454E]">
        Complete your order
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Tipo de orden */}
        <div>
          <label className="block text-sm font-medium mb-1">Order Type</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input
                type="radio"
                value="Pickup"
                checked={orderType === "Pickup"}
                onChange={() => setOrderType("Pickup")}
                className="mr-2"
              />
              Pickup
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Delivery"
                checked={orderType === "Delivery"}
                onChange={() => setOrderType("Delivery")}
                className="mr-2"
              />
              Delivery
            </label>
          </div>
        </div>

        {orderType === "Delivery" && (
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

        {/* Fecha y hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Date
            </label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Time
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Any special requests?"
          />
        </div>

        {/* Campo de cupón */}
        <CouponField onDiscountApply={handleCouponApply} />

        {/* Resumen de orden */}
        <OrderSummary />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00454E] text-white py-3 rounded-lg font-semibold hover:bg-[#00626A] transition"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>

        <div className="text-center mt-4">
          <a
            href="/"
            className="text-[#00454E] underline text-sm hover:text-[#1D9099]"
          >
            Want more items?
          </a>
        </div>
      </form>
    </div>
  );
}
