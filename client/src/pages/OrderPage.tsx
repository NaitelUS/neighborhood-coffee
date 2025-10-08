import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";
import { useNavigate, Link } from "react-router-dom";

export default function OrderPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    total,
    discountRate,
    appliedCoupon,
    clearCart,
  } = useContext(CartContext);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    order_type: "Pickup",
    address: "",
    schedule_date: "",
    schedule_time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("⚠️ Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/orders-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          order_type: form.order_type,
          address: form.address,
          schedule_date: form.schedule_date,
          schedule_time: form.schedule_time,
          notes: form.notes,
          subtotal: Number(subtotal) || 0,
          total: Number(total) || 0,
          discountRate: Number(discountRate) || 0,
          appliedCoupon: appliedCoupon || "",
          items: cartItems,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("❌ Order creation failed:", data);
        setError("⚠️ There was an error submitting your order. Please try again.");
        setLoading(false);
        return;
      }

      clearCart();
      navigate(`/thank-you?id=${data.orderId}`);
    } catch (err) {
      console.error("❌ Error submitting order:", err);
      setError("⚠️ There was an error submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-[#00454E] mb-6 text-center">
        Review your order
      </h2>

      {/* 🧾 Order Summary arriba */}
      {cartItems.length > 0 ? (
        <div className="mb-8 border-b pb-4">
          <OrderSummary />
          <div className="text-center mt-4">
            <Link to="/" className="text-[#1D9099] font-medium hover:underline">
              Want more items?
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}

      {/* 👤 Customer Info */}
      <h3 className="text-lg font-semibold text-[#00454E] mb-2">
        Customer Information
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customer_name"
          placeholder="Your name"
          value={form.customer_name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="tel"
          name="customer_phone"
          placeholder="Phone number"
          value={form.customer_phone}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        {/* ☕ Order Type (Radio buttons) */}
        <div className="flex items-center gap-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="order_type"
              value="Pickup"
              checked={form.order_type === "Pickup"}
              onChange={handleChange}
            />
            <span>Pickup</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="order_type"
              value="Delivery"
              checked={form.order_type === "Delivery"}
              onChange={handleChange}
            />
            <span>Delivery</span>
          </label>
        </div>

        {form.order_type === "Delivery" && (
          <input
            type="text"
            name="address"
            placeholder="Delivery address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        )}

        {/* 📅 Date / Time / Notes */}
        <input
          type="date"
          name="schedule_date"
          value={form.schedule_date}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="time"
          name="schedule_time"
          value={form.schedule_time}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <textarea
          name="notes"
          placeholder="Special instructions (optional)"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00454E] text-white py-2 rounded hover:bg-[#1D9099] transition"
        >
          {loading ? "Submitting..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
